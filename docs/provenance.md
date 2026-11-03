# Sources and provenance

This website reuses the owner’s earlier project direction and technical findings while replacing the earlier website with an independent, maintainable public repository.

## Recovered material

The inspected source was `overwatch-comms-lab-starter.zip`, latest available copy at the time of this work. Its `package.json` reports `overwatch-comms-lab` version `0.3.0`.

```text
SHA-256
ac43610ab7f5ac4ebc06eb94503e3463119b9e1e7d9e9606e2afa40f1e6cda11
```

Relevant material included the application README, architecture, roadmap, privacy guidance, Windows setup helpers, recorder/transcription/import/report/dashboard source, test files, and a `website/` directory with an earlier Pages workflow.

## What was reused

| Earlier material | Use in this website |
| --- | --- |
| Local-first, consent-based team review concept | Project purpose and trust principles |
| Application source and commands | Grounded setup guidance and source-evidence table |
| Architecture and storage paths | Data-flow, clocks, and boundary documentation |
| Roadmap and pilot-validation gaps | Milestones with measurable acceptance criteria |
| Earlier static website | Reference for content inventory; replaced by a new design and implementation |

No application code, credentials, actual recordings, player identities, transcripts, model weights, or session database is copied into this website repository. New examples are hand-authored synthetic fixtures. The application archive remains separate.

## Verification scope

Website build, internal links, fixture integrity, export logic, and safe documentation rendering are checked by repository scripts/tests. Browser inspection is a separate quality check. Application tests, real Discord capture, a Windows installation, GPU processing, timing accuracy, deletion completeness, and coach outcomes are not established by those website checks.

This project has no published experimental findings in this repository. The public demo must never be described as a research result or an operational session.

## Primary technical references

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): build/artifact/deployment separation and required permissions.
- [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site): owner configuration step.
- [whisper.cpp](https://github.com/ggml-org/whisper.cpp): local transcription implementation and CPU/CUDA build guidance.
- [OBS multiple-audio-track guide](https://obsproject.com/kb/multiple-audio-track-recording-guide): optional VOD capture context; OBS is not integrated into this website.
- [Node.js downloads](https://nodejs.org/en/download): website/application runtime installation.
- [pnpm installation](https://pnpm.io/installation): package manager used by the recovered application.

The recovered application uses whisper.cpp, not faster-whisper. Do not substitute a different transcription engine in setup instructions without changing and validating the application integration.

## Attribution and naming

Voice Stat - OW is the independent project name used in this repository. No external research affiliation or third-party endorsement is claimed. Overwatch and related marks belong to Blizzard Entertainment. Discord, ScrimTime, Parsertime, whisper.cpp, Ollama, and other referenced projects belong to their respective owners. Their own licenses govern their software.

The new website source is MIT licensed. Mentioning or linking a third-party tool does not make its source or game assets part of this repository. No Blizzard artwork, team logos, or third-party fonts are distributed.
