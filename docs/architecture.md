# Architecture and boundaries

The public website and local application are separate systems. This repository deploys only static information and synthetic examples. It neither connects to Discord nor calls the operator’s local dashboard.

## Proposed pilot data flow

| Stage | Input and component | Output | Boundary |
| --- | --- | --- | --- |
| Consent and capture | Discord bot, per-session consent state, voice receive | Per-speaker timestamped Ogg/Opus speech turns | Discord transports the call over the internet; files are written locally |
| Transcription | FFmpeg conversion, local whisper.cpp CLI and model | Timestamped transcript segments | Local executable; process after the scrim |
| Log import | Compatible ScrimTime/Parsertime-style Workshop text logs | Normalized events and preserved source lines | Local files; parser compatibility must be tested |
| Alignment | Session start and supplied map offsets | Candidate fight windows and joined evidence | Heuristic clock placement requires calibration |
| Review generation | Deterministic communication heuristics and game events | Candidate moments, stories, summaries | Candidate detection is not causal inference |
| Human review | Local dashboard, original audio/VOD, coach | Notes, interpretation, chosen lessons | The coach can reject a candidate |
| Export | Local report and clip exporters | HTML, Markdown, JSON, CSV, Ogg | Sharing creates additional copies to manage |

The optional Ollama analyst is outside the deterministic core. Source contains a loopback URL allowlist, rejected redirects, an evidence bundle, and reference checking. It still needs testing; a reference existing in a bundle does not prove that a model’s statement is supported by that reference. Do not treat it as a factual authority.

## Storage

The recovered application uses these local paths relative to its configured data root:

| Path | Intended contents |
| --- | --- |
| `.data/commslab.sqlite` | Sessions, consent, metadata, transcripts, game events, review state |
| `.data/sessions/<id>/raw/` | Speaker-specific Ogg segments |
| `.data/sessions/<id>/game/` | Copied source Workshop logs |
| `.data/sessions/<id>/transcript/work/` | Temporary converted audio and transcription work |
| `.data/sessions/<id>/analysis/` | Reports and derived exports |
| `.data/sessions/<id>/analysis/clips/` | Mixed multi-speaker review clips |

The intended dashboard bind address is `127.0.0.1:4317`. Verify the actual listener before a pilot. Loopback limits network exposure; it does not encrypt files or protect against other software or people using the same machine. Avoid port forwarding and public tunnels.

## Clock alignment is a first-class limitation

The starter defaults the first map to the communications session start and later maps to the previous map plus a 60-second break. Those defaults can be wrong. A manual import can supply seconds after the session start:

```bash
pnpm import -- <session-id> <log-file> <map-index> <seconds-after-session-start>
```

Check at least two recognizable anchors against the source recording or VOD, including one late in the map to expose drift. If alignment is uncertain, mark affected cards as needing context. A future shared marker must be validated before clickable VOD timestamps can be called precise.

The website’s offset slider demonstrates why timing uncertainty matters. It shifts fictional game events relative to fixed calls, without claiming to solve synchronization.

## Threat and reliability boundaries

- Bot tokens belong in local configuration, never in a public repository or report.
- Recordings, transcripts, exports, and backups can identify people even when names are removed.
- The starter’s name normalization and call classification can misread game vocabulary or conversational intent.
- Speaker-specific Discord streams avoid mixed-audio diarization, but packet loss, overlap, reconnects, and receive compatibility still require testing.
- Durable coach notes and stable evidence IDs are source-present behavior to validate across regeneration.
- Keeping data local does not verify consent handling, deletion completeness, encryption, or model output accuracy.

## Website implementation

The build uses Node.js built-ins only. It copies `site/`, renders a restricted escaped Markdown subset from `docs/`, adds configured links, and copies synthetic downloads from `examples/`. GitHub Pages receives only `dist/`.

Documentation and the core project explanation work without JavaScript. The review lab enhances the page with browser-memory notes and a local Markdown download. There are no upload controls, analytics packages, externally hosted fonts, or browser microphone permissions.

The proposed [demo contract](demo.md) offers a narrow future integration boundary. It is not an importer for the existing application’s report format.
