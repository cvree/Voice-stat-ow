# The Voice Stat - OW field manual

Voice Stat - OW explores a practical question: can a team review its communications alongside match events without sending recordings to a cloud AI service?

The public website makes that idea inspectable. The separate local analysis starter provides a prototype to evaluate. A real pilot must establish whether it is reliable, accurate, respectful of participants, and useful to a coach.

## Choose your starting point

| You want to… | Read |
| --- | --- |
| Try the website or locate the separate application | [Getting started](getting-started.md) |
| Understand what exists and what is unverified | [Feature status](feature-status.md) |
| Inspect components, storage, and clocks | [Architecture](architecture.md) |
| Estimate local hardware and operating costs | [Hardware and costs](hardware.md) |
| Understand consent, retention, and deletion | [Privacy model](privacy.md) |
| Build capture that works under Discord's voice encryption | [Discord bot](discord-bot.md) |
| Set up hands-free transcription and measure it | [Automatic transcription](transcription.md) |
| Join voice to ScrimTime logs and Parsertime fights | [ScrimTime and Parsertime](parsertime.md) |
| See how comms are counted, and what is never scored | [Comms metrics](comms-metrics.md) |
| Run a small consenting test | [Pilot protocol](pilot.md) |
| Contribute toward a milestone | [Roadmap](roadmap.md) and [Contributing](contributing.md) |
| Publish and maintain the site | [Deployment](deployment.md) |

## Three separate things

**Website:** the public pages you are reading and a functional synthetic browser demo. It runs no model, captures no microphone, and imports no real team data.

**Analysis starter:** Overwatch Comms Lab v0.3.0, recovered from the earlier project archive. Source exists for a recorder, local transcription, parsing, a dashboard, and exports. This website build does not establish that those components work together on the target machine today.

**Future product:** verified synchronization, repeatable installation, team vocabulary correction, and coach-approved trends. These are milestones with acceptance criteria, not current features or release promises.

## Read claims at the right level

“Source present” means code was inspected. “Validated” requires a reproducible test in the intended environment. “Useful” requires coach feedback against real, consented evidence. No transcription accuracy, inference speed, win-rate improvement, or coaching time savings are asserted here.

The [sources and provenance page](provenance.md) records what informed the site and what remains unknown.
