# Discord bot: capture that survives encryption

The bot's job is small and strict: join one voice channel, record only people who opted in, write one audio stream per speaker with trustworthy timestamps, and stop when told. Everything else in the project depends on that file set being complete.

Discord changed the ground under this in 2026. This page states what changed, the build steps, and the tests that decide whether the capture path is usable.

## What changed in 2026

Discord's end-to-end encryption protocol for voice is called DAVE. Discord announced that from early March 2026 every voice call is end-to-end encrypted and clients must support DAVE to join. Bots that connect to voice are clients for this purpose.

| Fact | Source | Checked |
| --- | --- | --- |
| DAVE is mandatory for voice connections | [Discord's announcement](https://discord.com/blog/every-voice-and-video-call-on-discord-is-now-end-to-end-encrypted) | November 12, 2026 |
| `@discordjs/voice` 0.19.x reported reconnect loops and zero received audio under DAVE | [discord.js issue 11419](https://github.com/discordjs/discord.js/issues/11419), closed March 13, 2026 by pull request 11449 | November 12, 2026 |
| Packet loss during DAVE key transitions was split into a separate issue, 11441 | Same thread | November 12, 2026 |
| Current npm versions: `discord.js` 14.28.1, `@discordjs/voice` 0.19.2, `@snazzah/davey` 0.2.0 | npm registry | November 12, 2026 |
| `@discordjs/voice` 0.19.2 requires Node.js 22.12 or newer and depends on `@snazzah/davey` | npm registry metadata | November 12, 2026 |

The recovered starter predates this. Its `src/audio-recorder.ts` has to be treated as untested against DAVE until the soak test below passes. The issue thread does not state which release carries the fix, so the installed version must be proven by test, not by version number.

Discord's developer documentation and the discord.js guide could not be opened from the research environment. Read both before coding against the receive API.

## Build steps

### 1. Create a private application

- Create an application and bot in the Discord Developer Portal. Keep it private and install it only in the team's server.
- Scopes: `bot` and `applications.commands`.
- Gateway intents: `Guilds` and `GuildVoiceStates`. No privileged intents and no message content.
- Channel permissions: View Channel, Connect, Send Messages, Embed Links. The bot never needs Speak.
- Put the token in the application's ignored `.env`. Rotate it if it ever appears in a log, screenshot, or report.

### 2. Pin the voice stack

```bash
pnpm add discord.js@14.28.1 @discordjs/voice@0.19.2 @snazzah/davey @discordjs/opus
pnpm install --frozen-lockfile
```

Commit the lockfile. The starter shipped without one, which makes a DAVE regression impossible to bisect.

### 3. Commands

| Command | Who | Effect |
| --- | --- | --- |
| `/scrim link` | Each player, once | Stores Discord user to in-game name and role |
| `/scrim start` | Operator | Bot joins, posts a consent message with Agree and Decline buttons, records nobody yet |
| Agree button | Each player | Recording starts for that player only |
| `/scrim mark <label>` | Anyone | Writes a labelled timestamp, used as a sync anchor and a bookmark |
| `/scrim status` | Anyone | Lists who is recorded, elapsed time, disk used, last error |
| `/scrim pause` and `/scrim resume` | Operator | Stops and restarts all subscriptions |
| `/scrim revoke` | Each player | Stops that player's recording immediately |
| `/scrim stop` | Operator | Ends capture, leaves the channel, queues processing |
| `/scrim forget-me <session>` | Each player | Deletes that player's audio and transcript from a session |

### 4. The receive loop

The shape below follows the public `@discordjs/voice` receive API. Verify names against the pinned version.

```js
const connection = joinVoiceChannel({ channelId, guildId, adapterCreator, selfDeaf: false, selfMute: true });
await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

connection.receiver.speaking.on('start', (userId) => {
  if (!consent.has(userId) || active.has(userId)) return;
  const startedAt = clock.now();
  const opus = connection.receiver.subscribe(userId, {
    end: { behavior: EndBehaviorType.AfterSilence, duration: 800 },
  });
  writeTurn({ userId, startedAt, opus });
});
```

- One subscription per consenting speaker. Per-speaker streams remove the need for diarization.
- Write Opus packets straight into an Ogg container. Do not decode during the game.
- Count packets per turn. Each Opus packet is normally 20 ms, so packet count times 20 ms against wall duration gives a per-turn loss estimate.
- Close a turn after 800 ms of silence. The value is a starting point; too short splits one call into two, too long merges two speakers' exchanges.

### 5. One clock for everything

- At session start record `Date.now()` once, then timestamp every turn, mark, and log observation from a monotonic clock (`process.hrtime.bigint()`).
- Store the turn start as seconds since session start. Never rebuild time from file modification dates.
- Check OS time sync before a session. On Windows, `w32tm /query /status` shows the last sync and offset.
- If the bot runs on the lobby host's PC, the Workshop log and the audio share one clock. This is the preferred setup; see [Parsertime integration](parsertime.md#measured-the-bracket-clock-and-match-time-are-different-clocks).

### 6. Consent state machine

| Event | Required behaviour |
| --- | --- |
| Player has not answered | No subscription, no file |
| Player agrees | Subscription opens from that moment; earlier speech is not recovered |
| Player joins late | Bot sends the consent prompt to that player; no recording until Agree |
| Player revokes | Subscription destroyed within one second; open turn file closed and flagged |
| Player leaves or moves channel | Subscription destroyed; rejoin requires no new consent in the same session |
| Bot is disconnected or moved | Session marked interrupted; recording does not resume silently |
| Non-roster person joins | Prompted like anyone else; nothing recorded by default |

The bot shows state in the channel: a pinned status message and a nickname prefix while recording. A status message is not proof. Gate 2 of the [pilot protocol](pilot.md) inspects the files.

### 7. Failure handling

- On voice close code 4017 or repeated reconnects, stop, post the error in the channel, and keep what was already written.
- Flush and fsync turn files on close. Write a session manifest listing every turn with user, start, duration, packet count, and SHA-256.
- On crash, the next start finds the unfinished session and marks it interrupted instead of appending.

## The soak test that decides the capture path

Run this before any real scrim, with volunteers.

1. Five consenting speakers in a normal voice channel for 60 minutes, including two rejoin cycles and one channel move.
2. One speaker reads a numbered list at a steady pace, so missing numbers are audible gaps.
3. In parallel, one participant records their own microphone locally as a reference track.
4. After stop, compare: turns expected against turns written, packet-count duration against wall duration, and reference track against bot track for the same speaker.

| Measure | Pass | Fail action |
| --- | --- | --- |
| Session reaches Ready and stays connected | No unplanned reconnect in 60 minutes | Record close codes; try the next `@discordjs/voice` or `@snazzah/davey` release |
| Decrypt errors | Zero `DecryptionFailed` after the first second of a turn | Capture logs; compare with issue 11419 |
| Estimated packet loss per speaker | Under 2 percent | Inspect DAVE transition moments, the subject of issue 11441 |
| Missing numbered items | None | Fail the path |
| Files after revoke | No audio later than the revoke time | Fix before anything else |

The thresholds are proposals for the team to agree before the test, not measured results.

## If the bot path fails

| Fallback | How | Cost |
| --- | --- | --- |
| A. Different receive library | Any maintained library with DAVE receive support, behind the same turn-file manifest | Rewrite of one module |
| B. Self-hosted Craig | [Craig](https://github.com/CraigChat/craig) is an ISC-licensed multi-track Discord recorder; import its per-speaker tracks | More services to run; its DAVE status was not confirmed in this research |
| C. Hosted Craig | Invite the public bot and download tracks | Audio leaves the team's machine, which breaks the local-first rule; needs explicit team agreement |
| D. Local microphone capture | Each player records their own microphone with OBS or a small recorder and submits the file | Five uploads per scrim and a clock sync step per player |

Keep the downstream format identical for all paths: per-speaker audio, a manifest, and seconds since session start. Transcription and metrics then do not care which path produced the audio.

## Policy and courtesy

Recording people has legal and platform rules that vary by place. Read Discord's current Developer Terms of Service and Developer Policy before running the bot, tell every participant plainly that a recording bot is present, and follow the [privacy model](privacy.md). Opponent voice is never in scope.
