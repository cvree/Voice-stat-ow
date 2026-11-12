# Measuring team comms

A comms metric is useful when a coach can open the number, see the calls and events behind it, and disagree with it. Every metric on this page is a count or a time difference over stored evidence. None is a grade.

These are proposed definitions. None has been computed on a real session, and no value on this page is a benchmark.

## Inputs

| Input | From | Needed for |
| --- | --- | --- |
| Speaker turns with start and end | [Discord bot](discord-bot.md) | Level 0 and above |
| Game events and fight list | [ScrimTime logs, Parsertime-compatible](parsertime.md) | Level 1 and above |
| Timed, glossary-corrected words | [Transcription](transcription.md) | Level 2 and above |
| Clock uncertainty for the map | Alignment step | Deciding which timing metrics may be shown |

## Fight windows

Windows reuse Parsertime's constants so both tools describe the same fight.

| Window | Span | Question it serves |
| --- | --- | --- |
| Pre-fight | 12 seconds before the first kill, to the first kill | Was there a plan? |
| In-fight | First kill to last kill, kills at most 15 seconds apart | What was called under pressure? |
| Post-fight | Last kill to 10 seconds after | Did the team reset together? |
| Between fights | Everything else in the round | Ult tracking and setup talk |

The 10-second post-fight span is a proposal. Agree it with the coach before the first report.

## Level 0: audio only

Available from the first working capture. No transcript and no log.

| Metric | Definition | Reading it |
| --- | --- | --- |
| Talk share | A speaker's speech seconds divided by team speech seconds | Who carries the channel |
| Turn count and median turn length | Per speaker, per map | Short frequent calls against long explanations |
| Overlap ratio | Seconds with two or more speakers, divided by seconds with at least one | Crowding |
| Longest silence | Longest gap with no speaker, per round | Dead air |
| Response gap | Time from one speaker's turn end to the next speaker's start | Pace of exchange |

## Level 1: audio plus fights

| Metric | Definition | Reading it |
| --- | --- | --- |
| Pre-fight talk | Speech seconds and distinct speakers in the pre-fight window | Fights entered without a word |
| In-fight overlap | Overlap ratio inside the in-fight window | Whether calls collide when it matters |
| Post-fight first voice | Seconds from the last kill to the first turn | How fast anyone speaks after a fight |
| Silence after a lost fight | Longest gap in the post-fight window, lost fights only | Whether the channel goes quiet after losses |
| Talk share by fight result | Talk share in won fights against lost fights | Whether the caller changes when behind |

Fight result uses Parsertime's rule: more kills wins, a Mercy resurrection cancels one opposing kill, equal is a draw.

## Level 2: what was said

Each transcript segment gets zero or more tags from a fixed rule set. Rules are keyword and pattern lists in a versioned local file, applied deterministically.

| Tag | Example phrases | Notes |
| --- | --- | --- |
| Target | "Ana one", "focus Kiri", "Winston low" | Resolves a hero name through the glossary |
| Enemy info | "Tracer behind", "they have nano" | Position or resource of the other team |
| Ult status | "I have beat", "blade in ten" | Own team's ult state |
| Ult plan | "nano blade next fight", "save rally" | Intent to use or hold |
| Engage | "go", "walk with me", "diving now" | Directive to commit |
| Disengage | "back", "reset", "regroup", "don't feed" | Directive to stop |
| Status | "I'm dead", "I'm one", "no suzu" | Own state |
| Acknowledge | "okay", "copy", "got it", "yep" | Counts only after a directive from another speaker |

A segment with no tag stays untagged. There is no tag for tone, mood, or blame.

| Metric | Definition | Needs |
| --- | --- | --- |
| Call mix | Share of tagged segments per tag, per fight window | Tags |
| Plan presence | Fights with at least one ult plan or engage tag in the pre-fight window, divided by fights | Tags, fights |
| Closed-loop rate | Engage and disengage directives followed within 3 seconds by an acknowledge from a different speaker, divided by directives | Tags, word times |
| Caller concentration | Largest single speaker's share of engage and disengage directives | Tags |
| Ult call lead | For each `ultimate_start` by a rostered player, seconds from the nearest earlier ult plan or ult status naming that ult to the event | Tags, events, alignment |
| Uncalled ults | `ultimate_start` events with no matching call in the 20 seconds before | Tags, events, alignment |
| Stacked ults | Two team `ultimate_start` events within 3 seconds with no ult plan naming both | Tags, events |
| Death call gap | For each teammate death, seconds to the first status or enemy info naming that player or hero | Tags, events, alignment |
| Target follow-through | Target calls where the named enemy hero dies within 5 seconds, divided by target calls | Tags, events, alignment |
| Reset latency | In lost fights, seconds from the kill that put the team two down to the first disengage | Tags, events, alignment |

The 3, 5, and 20 second spans are starting values to agree with the coach and then hold fixed, so weeks can be compared.

## Timing metrics have an error budget

The log's wall clock has one-second resolution, and the audio-to-log alignment has its own uncertainty per map.

| Map alignment uncertainty | What is shown |
| --- | --- |
| Up to 1 second | Timing metrics in one-second bands: before, within 1 second, 1 to 3 seconds after, more than 3 seconds after |
| 1 to 3 seconds | Only before and after, with the uncertainty printed |
| Over 3 seconds or unknown | Timing metrics hidden for the map; Level 0 metrics and untimed counts still shown |

No timing metric is ever shown in milliseconds. Ordering between two game events may use `match_time`, which is finer inside a round.

## What a number must carry

- A denominator. "4 of 11 fights had a pre-fight plan", never "36 percent" alone.
- Links to every segment and event counted, by stable evidence ID.
- The glossary, tag-rule, and alignment versions that produced it.
- A coach verdict field: useful, misleading, or needs context.

A metric with fewer than five instances in a session is listed as a count without a rate.

## Validating the tags

The tag rules are the weakest link, so they get their own test before any metric built on them is shown to players.

1. A coach hand-tags 300 segments from two sessions, blind to the rule output.
2. A second person tags 100 of the same segments.
3. Compute agreement between the two people first. Where people disagree, the tag definition is unclear and is rewritten.
4. Compute precision and recall of the rules per tag against the coach.

| Check | Proposed bar |
| --- | --- |
| Human agreement per tag | Cohen's kappa of at least 0.7 |
| Rule precision per tag | At least 0.85 |
| Rule recall per tag | At least 0.6 |

A tag below the bar is hidden from metrics and still shown on the timeline as a hint. Recall is allowed to be lower than precision: a missed call costs the coach a find, a false call costs trust.

## From metrics to action

The report ends with at most three items, chosen by the coach, in one form: the observation with its count, two example moments, and one team agreement to try next block. For example: "Engage calls were acknowledged in 3 of 14 fights. Next block, the main support answers every go call." The next session's report shows the same metric beside the last one.

## What will not be measured

- Emotion, tilt, toxicity, or tone.
- A single per-player comms score or ranking.
- Any claim that a comms pattern caused a win or a loss.
- Anything about opponents' voice.

Trends are descriptive and per team. Comparing two players' talk share across different roles or heroes is not a like-for-like comparison and is not offered.

## Research leads

These are starting points for definitions, not validation of this project.

- [Strategic Communication in Esports](https://essay.utwente.nl/essays/104050), University of Twente, 2024: speech overlap and silence against outcomes in League of Legends team voice.
- [In-game call-outs and intensity in Valorant](https://studenttheses.uu.nl/handle/20.500.12932/48022), Utrecht University thesis, 2024: call-outs against team performance using audio and game logs.
- Rusk, Taylor, and Ståhl, Simulation and Gaming, 2024: callouts as shared perception in team shooters.

Closed-loop communication comes from aviation and medical team training. No study was found that tests it in Overwatch, so the closed-loop rate here is an untested proposal.
