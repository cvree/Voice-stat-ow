# Feature evidence and status

The source archive inspected on November 3, 2026 identifies the analysis application as `overwatch-comms-lab` version `0.3.0`. Inspection establishes implementation intent and code presence. It does not establish reliable operation in a current Discord session, on Windows, or on the target RTX 5090 laptop.

## Available in this website

| Capability | What it does | Limit |
| --- | --- | --- |
| Synthetic review lab | Switches scenarios, filters evidence, inspects timeline positions | Fictional fixtures; no inference or audio playback |
| Clock exploration | Moves game-event timestamps relative to calls | Teaching tool; no real clock calibration |
| Coach annotations | Keeps a separate note and interpretation for each example | Memory only; reload clears them |
| Sample export | Downloads all scenarios, notes, interpretations, and offsets as Markdown | Synthetic material, not an application report |
| Field manual | Documents architecture, setup, privacy, pilot, and roadmap | Setup procedures for the app need target-machine verification |
| Pages workflow | Verifies before deploying the static output | Repository and Pages must first be enabled by the owner |

## Source-present analysis prototype

| Feature | Inspected source | Validation still needed |
| --- | --- | --- |
| Consent-gated Discord commands | `src/bot.ts`, `src/session-service.ts` | Missing consent, joins, revoke, reconnect, move, stop behavior |
| Per-speaker recording | `src/audio-recorder.ts` | Current Discord receive support, loss, long sessions, file integrity |
| Local transcription | `src/transcribe.ts` | whisper.cpp path/model compatibility, word accuracy, GPU build |
| Workshop parsing/import | `src/workshop-parser.ts`, `src/scrim-import.ts` | Representative permitted logs, malformed input, schema changes |
| Review candidates | `src/report-engine.ts`, `src/comm-analysis.ts` | False positives, original context, tactical usefulness |
| Hero-time-weighted stats | `src/game-analytics.ts` | Hero-switch windows, log completeness, metric interpretation |
| Dashboard and exports | `src/dashboard.ts`, `src/report-export.ts` | Access boundary, regeneration behavior, escaping, shared-copy handling |
| Mixed review clips | `src/clip-export.ts` | Speaker timing, playback, deletion of derived audio |
| Optional local model questions | `src/local-analyst.ts` | Endpoint safeguards, context minimization, citation support, hallucinations |
| Retention and participant deletion | `src/session-service.ts`, `src/db.ts` | Cleanup invocation and all copies, including derived exports and backups |

The archive contains test files for analytics, reports, parser behavior, imports, and dashboard behavior. They were not executed as part of building this separate website. Do not turn test-file presence into a claim of a passed application test suite.

## Researched and designed, not built

The [Discord bot](discord-bot.md), [transcription](transcription.md), [ScrimTime and Parsertime](parsertime.md), and [comms metrics](comms-metrics.md) pages describe designs and proposed tests dated November 12, 2026. The Parsertime findings come from reading its public source and sample logs. The recovered recorder predates Discord's mandatory voice encryption and must be re-proven before any capture claim.

## Planned functionality

Verified shared sync markers, precise VOD links, a signed Windows installer, glossary correction memory, encrypted sharing bundles, and longitudinal coach-approved trends remain roadmap work. No release dates or performance guarantees are attached.

## Claims that require evidence

Do not publish accuracy, processing-speed, time-saving, team-performance, player-ranking, or causal claims from these examples. Measure a defined task, retain the methodology and limitations, and obtain permission before publishing any pilot observations. See the [pilot protocol](pilot.md).
