# Verification scope — November 3, 2026

The website was checked with Node.js v24.22.1. `npm run verify` builds 12 documentation pages, checks all generated local links and fragments, checks relative project-site paths and runtime-data exclusions, and runs seven focused Node tests covering evidence integrity, clock alignment, timeline bounds, annotation export, documentation escaping, the proposed synthetic fixture, and local HTTP routing.

The self-contained preview is generated from the same sources. Its embedded JavaScript was syntax-checked. Local HTTP checks cover the home page, documentation, assets, synthetic downloads, and the `/voice-stat-ow/` prefix used to simulate a GitHub project URL.

Full Chromium rendering, mobile visual inspection, screen-reader behavior, and browser-level interaction/download checks could not be completed here: the environment has no browser binary, and its network policy blocked the browser download. Those checks remain in the contributor checklist. Automated website checks do not establish application readiness or complete accessibility conformance.

No remote GitHub repository was created, no workflow was executed on GitHub, and no live website was published. The available GitHub connection did not expose repository creation or Pages configuration. `README.md` and `docs/deployment.md` contain the exact owner steps to publish.

The recovered analysis application was inspected but not installed or run. Real Discord capture, consent transitions, Windows/CUDA compatibility, transcription accuracy, alignment precision, deletion completeness, and coaching usefulness remain pilot validation work.

## Update — November 12, 2026

Four research pages and a rewritten roadmap were added, bringing the build to 16 documentation pages. `npm run verify` was rerun. The new pages are designs and proposed tests. The Parsertime findings come from reading its public source and sample logs at commit `09cde05`; the clock-offset table was computed from those samples. No Discord capture, transcription, alignment, or metric was run. `workshop.codes`, `docs.discord.com`, and `discordjs.guide` were unreachable from the research environment and were not read.
