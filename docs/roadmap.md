# Roadmap: from recovered starter to a working review loop

The target is one sentence a team can test.

> Fifteen minutes after the last map, the coach opens a local review where every fight Parsertime found sits beside what the team said before, during, and after it, with counted comms metrics, and no audio has left the team's machine.

Everything below is ordered to reach that sentence with evidence at each step. There are no ship dates. A phase is finished when its exit test passes, and not before.

## Where the project stands

| Layer | State on November 12, 2026 |
| --- | --- |
| Public website and synthetic review lab | Built and verified in this repository |
| Recovered application, Overwatch Comms Lab v0.3.0 | Source inspected; never installed or run |
| Discord capture | Source predates Discord's mandatory voice encryption; must be re-proven |
| Transcription | whisper.cpp integration present in source; no benchmark |
| ScrimTime and Parsertime | Real Parsertime source and sample logs read; integration designed, not built |
| Comms metrics | Definitions proposed; none computed on a real session |

Four research pages back this roadmap: [Discord bot](discord-bot.md), [automatic transcription](transcription.md), [ScrimTime and Parsertime](parsertime.md), and [comms metrics](comms-metrics.md).

## What the research changed

| Finding | Consequence for the plan |
| --- | --- |
| Discord made end-to-end voice encryption mandatory in March 2026, and the main Node voice library had receive failures under it | Capture is the first risk to retire. Phase 1 is a soak test, not a feature build |
| Parsertime's fights are kills at most 15 seconds apart, with a 12-second look-back for initiation | Use the same constants so both tools number the same fights |
| In ten real sample logs the bracketed clock keeps running while `match_time` pauses between rounds | Align voice to the bracketed clock. One offset per map on `match_time` is wrong |
| The bracketed clock has one-second resolution | Timing metrics are shown in one-second bands, never milliseconds |
| Parsertime exposes no public token API in the commit read | Integrate through shared log files, matching fight numbers, and deep links; propose anything more upstream |
| Newer logs include damage, healing, ability use, and positions | Cooldown and pressure context is available for later metrics without a new data source |
| Parsertime is MIT licensed with public sample logs | Its parser can be ported with attribution and its samples used as fixtures |

## The pipeline being built

| Stage | Component | Output | Detail |
| --- | --- | --- | --- |
| 1. Consent and capture | Discord bot | Per-speaker Ogg turns, manifest, session clock | [Discord bot](discord-bot.md) |
| 2. Log pickup | Workshop folder watcher | Raw ScrimTime logs matched to the session | [Parsertime integration](parsertime.md) |
| 3. Transcribe | FFmpeg and whisper.cpp queue | Timed words per speaker | [Transcription](transcription.md) |
| 4. Parse and align | Parsertime-compatible parser, clock model | Events and fights on the session clock, with uncertainty | [Parsertime integration](parsertime.md) |
| 5. Measure | Deterministic tag rules and metric functions | Counted metrics with evidence IDs | [Comms metrics](comms-metrics.md) |
| 6. Review | Local dashboard | Fight board, audio playback, coach verdicts | Phase 5 |
| 7. Hand off | Exports and links | Parsertime deep links, VOD timestamps, approved summary | Phase 6 |

## Experiments that decide the design

Run these first. Each is small, and each can change the plan.

| ID | Question | Method | Decides |
| --- | --- | --- | --- |
| E1 | Does the pinned voice stack receive clean audio under mandatory encryption for an hour? | The soak test in [Discord bot](discord-bot.md#the-soak-test-that-decides-the-capture-path) | Own bot or a fallback capture path |
| E2 | Which model and run shape fit the laptop? | Benchmarks B1 to B4 in [transcription](transcription.md#benchmarks-to-record) | Model, stitched or per-turn runs, GPU build |
| E3 | Does the log filename time equal bracket zero, and to what error? | Host a custom game, say "mark" on voice at three scoreboard-visible moments, compare filename time plus bracket clock against the bot clock | Whether alignment can be automatic |
| E4 | Is the Workshop log appended during the match or written at the end? | Tail the file while a custom game runs and timestamp each new line on arrival | Whether events can be stamped live by the bot's own clock |
| E5 | Does a ported parser match Parsertime on its ten sample logs? | Compare event counts and fight lists per file | Whether fight numbers can be trusted across tools |
| E6 | Can two people agree on the call tags? | The 300-segment tagging exercise in [comms metrics](comms-metrics.md#validating-the-tags) | Which tags are allowed to feed metrics |

## Phase 0: public foundation

**Delivered.** Project site, synthetic review lab, field manual, and a verification-gated Pages workflow. Publishing still needs the owner's Pages setting.

## Phase 1: reproducible starter and capture that survives encryption

- Create the application repository from the recovered archive. Commit a lockfile and pin Node.js 24.
- Run the existing tests and record results. Fix nothing yet; list failures.
- Upgrade the voice stack to the pinned versions and run experiment E1.
- Implement the consent state machine and the turn manifest with packet counts and hashes.
- Add `/scrim mark` and the single session clock.
- Prove revoke, late join, channel move, and stop by inspecting files.

**Exit test:** a 60-minute, five-speaker volunteer session passes every row of the soak table; no audio exists after any revoke time; a clean Windows install from the lockfile reproduces the build. If E1 fails, the phase exits through a documented fallback path with the same manifest format.

## Phase 2: hands-free transcription

- Build the job queue triggered by `/scrim stop`, with retries and a visible failure state.
- Stitch per-speaker audio onto the session clock.
- Create the first team glossary and the normalization log.
- Build the 200-turn gold set and run experiment E2.
- Post a "review ready" message with the local link.

**Exit test:** a two-hour session is transcribed with no operator action; word error rate, term recall, hallucination rate, word timing error, and real-time factor are recorded for the chosen model; every segment traces to a whisper.cpp tag, model hash, and glossary version.

## Phase 3: ScrimTime logs and the Parsertime join

- Port Parsertime's `parseLogText` behaviour with attribution and run experiment E5.
- Watch the Workshop folder and attach logs whose time falls inside the session.
- Run experiments E3 and E4, then implement the clock model with a stored uncertainty per map.
- Build the roster table linking Discord users to in-game names.
- Number fights with the 15-second rule and store Parsertime map links on each map.

**Exit test:** on Parsertime's sample logs the adapter's event counts and fight lists match; on one real map, three spoken marks land within the team's agreed tolerance at the start and end of the map; a map with a missing log is reported and degrades to audio-only metrics.

## Phase 4: comms metrics, version 1

- Ship Level 0 metrics from capture alone.
- Ship Level 1 metrics on fight windows.
- Write the tag rules, run experiment E6, and enable only tags that pass.
- Ship Level 2 metrics with the error-budget display rule.
- Print a denominator and evidence links with every number.

**Exit test:** every metric in a report opens the exact segments and events it counted; tags below the precision bar are absent from metrics; timing metrics are hidden on any map whose alignment uncertainty exceeds three seconds.

## Phase 5: the coach's review board

- One screen per map: fights in Parsertime order, each with pre, in, and post windows.
- Audio playback of any segment and a mixed clip of any window.
- Coach verdicts and notes that survive report regeneration.
- A glossary correction made in the review feeds the next session.
- A closing step that picks at most three moments and one team agreement.

**Exit test:** a coach who did not build the tool runs a session from `/scrim start` to a three-item review using the guide alone, inside 15 minutes of the last map, and their verdicts are intact after a forced regeneration.

## Phase 6: Parsertime hand-off and VOD

- Import Parsertime's killfeed export to cross-check fight lists.
- Measure the VOD offset from the same marks and generate timestamped YouTube or Twitch links.
- Export a coach-approved summary formatted for Parsertime's per-map note.
- Open an upstream issue describing the use case and asking about a supported integration point.

**Exit test:** for a sampled ten fights, the Parsertime fight, the VOD timestamp, and the comms window show the same moment; no automated call is made to Parsertime with a personal session.

## Phase 7: trends a team can trust

- Session-over-session views of a fixed metric set with fixed windows and tag versions.
- Roster and role context on every trend; no cross-role player comparisons.
- The team agreement from each review shown against the metric it targeted.

**Exit test:** four consecutive sessions produce comparable numbers under one definition set, and a definition change is visible as a break in the series, not a silent shift.

## Phase 8: packaging and deliberate sharing

- A signed Windows installer with a first-run diagnostic.
- Complete participant deletion across audio, transcripts, clips, exports, and temporary files, with a report of what was removed.
- Encrypted, consent-scoped share bundles.
- Optional local model questions, evaluated on a fixed evidence set before exposure.

**Exit test:** a second team installs and runs a session without developer help; a deletion request leaves no recoverable copy under the operator's control; a shared bundle opens only with its key and lists whose data it holds.

## The first fourteen days

| Day | Action | Evidence produced |
| --- | --- | --- |
| 1 | Create the application repository; commit the archive, a lockfile, and the upstream hash | A reproducible install |
| 2 | Run the existing test suite and `pnpm doctor`; record every failure | A baseline list |
| 3 | Create the private Discord application and test server | Bot online with two intents |
| 4 to 5 | Upgrade the voice stack; get one consenting speaker's turn written under encryption | First Ogg file and manifest |
| 6 | Run the 60-minute soak test with volunteers | E1 result |
| 7 | Build whisper.cpp on CPU; transcribe one turn | First JSON transcript |
| 8 | Host a custom game with ScrimTime; run E3 and E4 with spoken marks | Clock model decision |
| 9 | Port the parser; run it on Parsertime's ten samples | E5 result |
| 10 | Compute Level 0 metrics on the soak session | First real numbers, audio only |
| 11 to 12 | Hand-correct the 200-turn gold set; run B1 | Model choice |
| 13 | Join one real map: fights with their comms windows | First fight board, command line only |
| 14 | Review with a coach; write down what was useless | Phase priorities confirmed or changed |

The days are an order of work for one developer, not a schedule commitment.

## Risks

| Risk | Signal | Response |
| --- | --- | --- |
| Voice receive breaks again after a Discord or library change | Reconnect loops, decrypt errors, rising packet loss | Pinned versions, the soak test in CI as a manual gate, fallback capture paths behind one manifest format |
| Workshop logs are not written | A map with voice and no file | Report it; audio-only metrics; keep the replay code to re-run later |
| ScrimTime or the log format changes | Parser fixture failures | Fixtures from Parsertime's samples; track the upstream commit |
| Clock alignment cannot be made automatic | E3 error above tolerance | Fall back to spoken marks at map start and end; hide timing metrics when unknown |
| Transcription misses game vocabulary | Low term recall on the gold set | Glossary prompt and rewrite rules; restrict metrics to tags that pass validation |
| Tags are too noisy to count | Precision below the bar in E6 | Ship Level 0 and Level 1 only; show tags as hints |
| Players feel monitored | Declined consent, quiet channel | No scores, no tone analysis, visible state, easy revoke, coach-only access |
| Recording rules differ by place | A participant in a region with stricter consent law | Explicit consent every session; no recording by default |
| The laptop cannot play and capture at once | Frame-time impact during the soak | Run the bot on a second machine and accept a cross-machine clock step |

## How progress is counted

| Measure | Target to agree with the team |
| --- | --- |
| Capture completeness | Estimated packet loss under 2 percent per speaker |
| Time to review | Review ready within 15 minutes of `/scrim stop` |
| Alignment | Marks within 1 second at map start and end |
| Glossary term recall | Set after B1; raised each glossary revision |
| Tag precision | At least 0.85 for every tag used in a metric |
| Coach verdicts | Share of sampled cards marked useful, tracked per session |
| Deletion | Zero residual files in the deletion test |

These are proposed targets. None has been measured.

## Decisions already made

- Local-first stays. Hosted transcription and hosted recording are not on the path.
- whisper.cpp stays for the pilot. A second engine is evaluated only behind the same segment schema and gold set.
- Parsertime is the statistics tool. This project does not rebuild scoreboards, ratings, or heatmaps.
- Metrics are deterministic and counted. A language model never produces a number.

## Not in scope

Live tactical assistance, opponent voice, public player rankings, emotion or tone scoring, automatic blame, hosted transcript ingestion, and claims of research validation. The goal is a reliable post-scrim review for one consenting team, then a second.
