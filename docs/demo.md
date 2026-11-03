# The synthetic lab and data contract

The website’s [review lab](../index.html#review) is an interactive explanation of a proposed review workflow. All speech, timestamps, events, and candidate cards are hand-authored fiction. No real match, trained model, automatic detection, audio file, or accuracy result is represented.

## Implemented interactions

1. Choose reset timing, an ultimate plan, or overlapping calls. Arrow keys, Home, and End operate the scenario tabs.
2. Scrub the timeline or select an evidence row. The nearest evidence is highlighted and described by the slider’s accessible value.
3. Filter the evidence list to comms or game events. The overview still shows both tracks for context.
4. Move the game-clock offset from -5 to +5 seconds. Calls remain fixed while events move, changing apparent order.
5. Add an interpretation and note. Each scenario keeps its own values in memory.
6. Export a Markdown file containing all scenarios, notes, interpretations, clock offsets, and limitations. Clear resets all scenario annotations and offsets.

There is intentionally no play button because there is no sample audio. Reloading or closing the page removes notes. Downloaded exports remain on your device until you remove them.

## Source and pure functions

`site/data.js` is the single fixture source for the lab. It contains stable evidence IDs, relative times in seconds, speaker-role labels, and candidate questions. `alignedEvidence` shifts only game-event timestamps and returns a sorted copy. `exportMarkdown` produces a complete synthetic report. Node tests cover these functions and fixture references.

The visual speech bars indicate authored time spans. Their decorative inner texture does not represent recorded waveform amplitude.

## Proposed integration contract, version 1

A future application adapter could export a minimal, explicitly shareable review object. This proposal is separate from the recovered application’s existing JSON format. No adapter or real-file importer is implemented here.

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Explicit contract version: `1` |
| `synthetic` | Must be `true` for all public fixtures in this repository |
| `sessionLabel` | Fictional display label, with no real roster identity |
| `clock` | Relative-seconds basis and uncertainty note |
| `evidence` | Stable ID, kind, relative time, optional end time and speaker, text |
| `cards` | Observation, review question, and resolvable evidence IDs |
| `limitations` | Required interpretation limits |

Download the [synthetic review JSON](../downloads/synthetic-review.json), [proposed JSON Schema](../downloads/review.schema.json), or [sample Markdown review](../downloads/synthetic-review.md).

## Rules for any future adapter

Validate the schema, field lengths, finite times, unique IDs, and cross-references. Escape text at render time, treat transcripts as untrusted content, and reject active URLs or executable markup. Use relative clocks with explicit uncertainty. Never quietly publish names, recordings, raw logs, tokens, or coach notes from a real session.

A shareable object needs an explicit operator decision and participant agreement. A schema does not provide anonymization or permission. Real evidence must remain outside this public repository until the sharing design and consent scope are reviewed.
