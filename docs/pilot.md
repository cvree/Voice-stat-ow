# A small, consent-based pilot

Start with one operator, one coach, and willing volunteers in a private test channel. The first objective is reliable, understandable behavior—not a polished performance report.

## Gate 1: establish the environment

Use synthetic data first. Run the application tests and diagnostic command, inspect the local dashboard, verify the network listener, and record installed versions. Confirm storage, encryption, accessible stop controls, and a deletion process. Keep the optional local model off until the deterministic pipeline is understood.

## Gate 2: prove consent and recording behavior

With volunteers, check a missing consent, unanimous consent, a late arrival, revocation, disconnect/reconnect, channel movement, and an explicit stop. Inspect actual output files after each action. No files should be captured during a state that should pause recording. A visible status message alone is insufficient evidence.

Test current Discord voice receive before a long session. If expected audio is missing or capture continues after a stop/revoke event, stop the pilot and investigate. Do not use a real roster to discover basic capture failures.

## Gate 3: one short map

Use a compatible Workshop log and a short, approved recording. Note the session start and map offset. Verify two anchors against the recording/VOD, transcribe after play, generate candidate moments, and inspect the local report.

The starter’s default offsets are estimates. Log missing events and clock ambiguity explicitly. Do not interpret “late” calls if the alignment cannot support the claim.

## Gate 4: coach review

Have a coach inspect at least 20 candidate moments across a few short sessions before increasing scope. This is a proposed sample size for exploratory feedback, not a statistically justified efficacy study. For each candidate, record whether it is useful, misleading, or missing context, and why. Use the original recording and VOD as references.

| Measurement | How to record it | What it can establish |
| --- | --- | --- |
| Capture integrity | Expected vs playable speaker segments; gaps and errors | Reliability in the tested setup |
| Clock error | Offset at two or more recognizable anchors | Alignment uncertainty and drift |
| Transcript corrections | Manually corrected words and game terms for a defined sample | Accuracy on that sample only |
| Candidate usefulness | Coach verdict and rationale for every sampled card | Human usefulness, not tactical truth |
| Review time | Time to find and inspect moments, including corrections | A descriptive baseline |
| Resource usage | Processing time, RAM/VRAM, disk growth, thermal impact | Hardware planning for that setup |
| Participant experience | Voluntary feedback on consent, comfort, and control | Whether the process is acceptable to those participants |

## A useful review output

Choose up to three moments and one actionable team agreement. For example: “When a reset is called, acknowledge it before adding a new target call.” This is a discussion prompt, not an instruction derived from measured evidence on this website.

## Stop and revise when necessary

Stop for consent failures, unexpected access, missing or corrupted audio, unclear clock alignment, persistent misleading cards, unmanageable resources, or participant discomfort. Record a minimal technical description without uploading private evidence to a public issue.

## Close the loop

Confirm the team can correct the interpretation and request removal. Execute the [deletion checklist](privacy.md) with a volunteer session, including clips and exports. Agree on retention and any follow-up before running another block. Share pilot observations externally only with explicit permission and a clear method/limitations statement.
