# Automatic transcription

Auto-transcribe means the operator types `/scrim stop` and does nothing else. A queue converts each speaker's audio, runs a local model, applies the team glossary, and stores timed segments. The coach gets a message when the review is ready.

No accuracy or speed figure is claimed here. This page gives the pipeline, the commands to verify on the target machine, and the measurements that decide the model.

## Pipeline

| Step | Input | Tool | Output |
| --- | --- | --- | --- |
| 1. Queue | Stopped session manifest | SQLite `jobs` table with state and attempt count | One job per speaker |
| 2. Stitch | A speaker's turn files and start times | FFmpeg | One 16 kHz mono WAV per speaker, silence inserted so file time equals session time |
| 3. Detect speech | Speaker WAV | Voice activity detection | Speech regions; silence skipped |
| 4. Transcribe | Speech regions, glossary prompt | whisper.cpp | JSON segments with start, end, text, token probabilities |
| 5. Normalize | Segments | Glossary rules | Corrected text; original kept |
| 6. Store | Segments | SQLite | `segments` rows keyed by session, speaker, start |
| 7. Notify | Completed session | Bot message | Local review link for the coach |

Stitching each speaker into one file means one model load per speaker, not one per turn, and timestamps come out already in session time. Whether that is faster than per-turn runs on the target laptop is benchmark B2 below.

## Engine

The recovered application calls the whisper.cpp command-line tool. Keep it for the pilot; switching engines changes the integration and resets validation.

| Item | Value | Checked |
| --- | --- | --- |
| Project | [ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp) | November 12, 2026 |
| Latest release seen | v1.9.5, a maintenance release | November 12, 2026 |
| Voice activity detection | Silero VAD support is built into recent releases | Secondary sources; confirm in the pinned build |

Pin one release tag and one model file by SHA-256. Record both in the session metadata so a transcript can always be traced to the build that made it.

## Commands to verify on the target machine

Run the help first. Flag names below are the ones documented by whisper.cpp at the time of writing and must match the pinned build.

```bash
whisper-cli --help
```

```bash
ffmpeg -i speaker.ogg -ar 16000 -ac 1 -c:a pcm_s16le speaker.wav
```

```bash
whisper-cli -m models/ggml-large-v3-turbo.bin -f speaker.wav -l en -oj -of speaker --prompt "Ana, Kiriko, Lucio, Juno, Winston, nano, suzu, beat, reset, regroup"
```

Add voice activity detection and word-level output only after the plain run works.

```bash
whisper-cli -m models/ggml-large-v3-turbo.bin -f speaker.wav -l en -ojf -of speaker --vad --vad-model models/silero-vad.bin -ml 1 -sow
```

- `-oj` writes JSON; `-ojf` writes JSON with token detail.
- `--prompt` biases the decoder toward listed terms. It is the cheapest glossary lever.
- `-ml 1 -sow` requests word-level segments. Latency metrics need word times, not segment times.

## Choosing the model

Do not pick by reputation. Run the candidates on the same gold set and choose from the table.

| Candidate | Why test it |
| --- | --- |
| `medium.en` | The starter's documented default; English-only |
| `large-v3-turbo` | Reduced decoder; a common speed and accuracy trade for short utterances |
| `large-v3` | Reference for the best accuracy the machine can afford after the scrim |

## The team glossary

Game vocabulary is where general speech models fail. The glossary is a versioned local file with three parts.

| Part | Example | Used by |
| --- | --- | --- |
| Prompt terms | Current hero names, map names, ability nicknames | The `--prompt` string |
| Rewrite rules | `anna` to `Ana`, `keeriko` to `Kiriko`, `loose yo` to `Lucio` | Normalization after transcription |
| Roster aliases | `Bee` to the player whose handle is `BlueBee` | Resolving who a call was about |

Rules are applied to a copy. The model's original text is kept, every rewrite is logged with its rule ID, and a rule can be switched off and the session re-normalized without re-transcribing.

Build the first glossary from the hero roster of the current patch, the map pool, and thirty minutes of the team's own corrected transcript. Review it at every hero release.

## Measuring quality

### Gold set

- 200 turns from at least three consenting speakers and two maps.
- Hand-corrected by one person, with a second person checking 40 of them.
- Stored locally with the session; never published.

### Measures

| Measure | Definition | Why it matters |
| --- | --- | --- |
| Word error rate | Substitutions plus deletions plus insertions, divided by reference words | General accuracy |
| Term recall | Glossary terms correctly transcribed, divided by glossary terms spoken | A wrong hero name breaks a metric; a wrong filler word does not |
| Term precision | Correct glossary terms, divided by glossary terms output | Catches the model inventing game words in noise |
| Hallucination rate | Segments with text where the reference is silence or noise | Short gaming clips trigger this |
| Word timing error | Median absolute difference between model and hand-marked word start, on 50 words | Sets the floor for latency metrics |
| Real-time factor | Processing seconds divided by audio seconds | Whether the review is ready before the team leaves |

### Benchmarks to record

- B1: each candidate model on the gold set, CPU build.
- B2: stitched-per-speaker against per-turn runs, same model.
- B3: the chosen model on a GPU build, with peak VRAM and wall time for a two-hour session.
- B4: with and without the glossary prompt, to measure what the prompt actually buys.

Write each result with OS, driver, whisper.cpp tag, model hash, and command line, as the [hardware page](hardware.md) requires.

## Operating rules

- Transcribe after the scrim. A model competing with the game for the GPU costs frames and makes both worse.
- A failed job retries twice, then stops and reports. It never blocks other speakers.
- Low-confidence segments are kept and flagged, not dropped. The coach can open the audio.
- Temporary WAV files are deleted when a job finishes and are covered by the session deletion path.
- Transcripts are untrusted text. Escape on render, and never pass them to a shell.

## Later options, not pilot scope

Live captions during play, speaker-adapted models, and cloud transcription are out of scope. A second engine can be evaluated later behind the same segment schema, on the same gold set, before any switch.
