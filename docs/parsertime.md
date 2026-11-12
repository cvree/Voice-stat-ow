# ScrimTime and Parsertime integration

Voice Stat - OW does not need to rebuild scrim statistics. Parsertime already turns ScrimTime Workshop logs into fights, ult usage, and per-player stats. The job here is narrower: put what the team said next to the fights Parsertime already finds, using the same log files and the same fight boundaries.

This page records what was read in the actual Parsertime source, what was measured in its sample logs, and the integration steps that follow. Nothing here has been run against a live Parsertime account.

## What was inspected

| Item | Value |
| --- | --- |
| Repository | [luxdotdev/parsertime](https://github.com/luxdotdev/parsertime) |
| Commit read | `09cde05c6077a76eb208760425f20e8481dbfe41`, dated October 12, 2026 |
| License | MIT, copyright 2024 lux.dev |
| Layout | pnpm and Turborepo monorepo: `apps/web` (Next.js, Prisma, Postgres), `apps/bot` (discord.js on Bun), `apps/docs` |
| Log source | [ScrimTime Workshop code DKEEH](https://workshop.codes/DKEEH), credited on its listing to Caldoran |
| Parser | `apps/web/src/lib/parser/client.ts`, function `parseLogText` |
| Event tuple types | `apps/web/src/types/parser.ts` |
| Sample logs | Ten files in `apps/web/test/samples/`, dated December 2023 to April 2026 |

The workshop.codes listing could not be opened from the research environment, so the ScrimTime version and its own log documentation still need a direct read by the operator.

## How the logs are produced

The Parsertime README gives the procedure: in Overwatch 2 enable Gameplay, then Enable Workshop Inspector Log File, and host the scrim with the ScrimTime code. The Workshop writes one text file per map to `Documents/Overwatch/Workshop`. Only the lobby host's PC gets the file.

Files are named `Log-YYYY-MM-DD-HH-MM-SS.txt`. Parsertime's bulk uploader (`filename-timestamp.ts`) reads that name as the host PC's local time and uses it to sort maps into play order.

## The line format

Each line is a bracketed clock, a space, then comma-separated fields. Parsertime drops the bracketed field and keys on the event name.

```text
[00:00:00] ,match_start,0,Lijiang Tower,Control,Team 1,Team 2
[00:04:59] ,ultimate_start,85.53,Team 2,Aramori,Baptiste,0,1
[00:03:53] ,kill,20.08,Team 1,YAI,Baptiste,Team 1,YAI,Baptiste,0,200,0,True
```

Those lines come from Parsertime's public test samples. The second field after the event name is `match_time` in seconds.

| Event | Fields after `match_time` | Use for comms review |
| --- | --- | --- |
| `match_start` | map name, map type, team 1 name, team 2 name | Map identity and team sides |
| `round_start`, `round_end`, `setup_complete` | round number, capturing team, scores, objective index | Round boundaries and setup time |
| `kill` | attacker team, name, hero; victim team, name, hero; ability; damage; critical; environmental | Fight boundaries, first death, death callouts |
| `ultimate_charged`, `ultimate_start`, `ultimate_end` | team, player, hero, duplicate flag, ultimate id | Ult tracking and ult plan timing |
| `hero_spawn`, `hero_swap` | team, player, hero, previous hero, hero time played | Which hero a speaker is on at any moment |
| `objective_captured`, `point_progress`, `payload_progress` | round, capturing team, objective index, progress | Objective context for a call |
| `mercy_rez`, `dva_remech`, `echo_duplicate_start` | hero-specific fields | Fight outcome corrections |
| `offensive_assist`, `defensive_assist` | team, player, hero | Supporting context |
| `player_stat` | 36 per-round totals from eliminations to hero time played | Parsertime's stats; not needed for comms |
| `damage`, `healing` | attacker and victim triples, ability, amount, positions | Present in the 2026 samples; who was under pressure when a call was made |
| `ability_1_used`, `ability_2_used` | team, player, hero, position | Present in the 2026 samples; cooldown calls |

The April 2026 samples add coordinates such as `(6.38, 270.00, 295.06)` to kill, damage, and ability lines. Parsertime splits on commas outside parentheses (`splitLinePreservingCoords`). A naive `split(',')` breaks on these lines.

## Parser behaviours an adapter must copy

- A censored event name `****` is restored to `kill` before other asterisk handling.
- Any other field containing an asterisk becomes `0`.
- A `kill` row whose attacker team is `All Teams` takes the victim's team, name, and hero as the attacker.
- `mercy_rez` rows with an empty field are discarded.
- Team names are kept as strings even when they look numeric.
- Parsertime documents that only English-language logs are supported.

Parsertime is MIT licensed, so its parser can be ported or vendored with the copyright notice kept. Port it together with its sample logs as test fixtures, and record the upstream commit so drift is visible.

## Measured: the bracket clock and match time are different clocks

In all ten sample logs, the bracketed clock minus `match_time` was computed for every event.

| Sample | Offset during first round (s) | Offset during a later round (s) | Spread inside the first round (s) |
| --- | --- | --- | --- |
| `Log-2023-12-12-22-15-10` | 82.5 | 145.6 | 1.02 |
| `Log-2024-01-22-20-02-45` | 213.5 | 262.7 | 1.01 |
| `Log-2024-01-22-20-21-43` | 119.9 | 241.2 | 1.11 |
| `Log-2024-06-16-22-24-33` | 131.8 | 223.9 | 2.39 |
| `Log-2026-04-02-17-21-48` | 92.0 | 231.9 | 1.03 |
| `Log-2026-04-15-21-12-58` | 158.6 | 416.0 | 1.01 |

Three consequences follow.

- `match_time` stops between rounds and during setup. It cannot be mapped to real time with one offset per map.
- The bracketed clock keeps running, so it is the field to align against voice. Its resolution is one second, which sets a floor of about one second on any timing claim.
- Inside a round the two clocks agree to about one second, so sub-second ordering between events can still come from `match_time`.

The working model is therefore: event wall time equals the log's start time plus the bracketed clock. Whether the filename timestamp equals bracket zero is not established by the files alone. That is experiment E3 in the [roadmap](roadmap.md#experiments-that-decide-the-design).

## Fight boundaries: use Parsertime's definition

Parsertime groups kills into a fight when consecutive kills are at most 15 seconds apart (`FIGHT_GAP_SECONDS` in `apps/web/src/lib/utils.ts`). Its fight-initiation analysis looks back 12 seconds before the first kill (`INITIATION_LOOKBACK_SEC` in `fight-initiation.ts`). Mercy resurrections are folded in as events that undo a kill when deciding the winner.

Using the same two constants means fight 4 in a Voice Stat review is fight 4 in Parsertime's killfeed. A coach can move between the two tools without re-finding the moment. The comms windows in [comms metrics](comms-metrics.md) are built on these boundaries.

## Integration ladder

Each rung works without the ones after it.

| Rung | What it does | Depends on Parsertime changing? |
| --- | --- | --- |
| 1. Shared files | The team uploads logs to Parsertime as today; the local app reads the same files from the Workshop folder | No |
| 2. Compatible parsing | The local adapter reproduces `parseLogText` behaviour and passes Parsertime's sample logs | No |
| 3. Same fights | Fight numbering matches Parsertime's 15-second grouping; review cards cite map and fight number | No |
| 4. Cross-check import | Parsertime's killfeed CSV export (`fight_number`, `fight_start`, `fight_end`, kill rows) is imported to confirm the local fight list matches | No |
| 5. Deep links | Each review card stores the Parsertime map URL, shaped `/[team]/scrim/[scrimId]/map/[mapId]`, pasted once per map by the operator | No |
| 6. VOD timestamps | With a measured VOD offset, cards produce YouTube or Twitch links with a start time, the same URL forms Parsertime's `parseVodUrl` accepts for its per-map VOD field | No |
| 7. Notes hand-off | The coach pastes an approved comms summary into Parsertime's per-map note | No |
| 8. Upstream proposal | Open an issue proposing an optional per-map comms attachment or a read API for fights | Yes |

No public, token-based API was found in the inspected commit. The scrim, note, and VOD routes authenticate a signed-in browser session, and the bot routes use a shared bot secret. Rungs 1 to 7 are designed around that. Do not script a personal session against Parsertime's routes; ask upstream first.

## Player identity

Log rows carry in-game player names. Voice capture carries Discord user IDs. The join needs a roster table the team maintains: Discord user, in-game name as it appears in logs, and usual role. Parsertime keeps its own BattleTag link per account; this table stays local.

Hero at a given moment comes from `hero_spawn` and `hero_swap`, so "our Ana" in a transcript can be resolved to a player per fight rather than per map.

## Known upstream limits that affect comms metrics

Parsertime's own known-issues page lists these at the inspected commit.

- Healing dealt is not tracked for Juno and Wuyang because the Workshop does not expose it.
- Clash objective captures are recorded incorrectly.
- Flashpoint logs can contain only four rounds.
- Push maps record no score; Parsertime approximates the winner.

The ScrimTime listing also has user reports of logs not being written. A missing log means a map has voice but no events. The pipeline must report that plainly and fall back to audio-only metrics for the map.

## Attribution

Parsertime and ScrimTime belong to their authors. Voice Stat - OW is not affiliated with or endorsed by either. Any ported parser code keeps the MIT notice, and the sample logs stay in the application repository's test fixtures, not on this public website.
