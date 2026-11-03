# Voice Stat - OW — Make the next review count.

The public website and field manual for a local-first Overwatch communications review project. Designed for competitive players, coaches, and collaborators who want to connect what happened in a fight with what the team said.

**This repository is the website.** It includes a working synthetic review lab, not the Discord recorder or analysis application. No real team data, model weights, credentials, or application source is bundled.

## Run it

Install [Node.js 24 LTS](https://nodejs.org/en/download), open a terminal in this folder, and run:

```bash
npm run dev
```

Open `http://127.0.0.1:4173`. No package installation, paid API, or build service is needed. After editing source files, stop the server with Ctrl+C and run the command again. This intentionally simple server does not hot-reload.

```bash
npm run verify
```

This builds the site, checks internal links and fragments, checks project-subpath compatibility and runtime-data exclusions, and tests demo/export behavior and documentation escaping.

## What is here

| Item | Purpose |
| --- | --- |
| `site/` | Responsive landing page, shared design system, browser interactions |
| `site/data.js` | Three explicitly fictional review scenarios; pure export/alignment functions |
| `docs/` | Markdown documentation, compiled into browsable HTML |
| `examples/` | Synthetic sample report, proposed review contract, JSON Schema |
| `scripts/` | Dependency-free build, local preview server, link checks, Markdown renderer |
| `tests/` | Node tests for evidence integrity, alignment, export, and safe rendering |
| `.github/workflows/pages.yml` | Verify pull requests; deploy verified `main` to Pages |
| `site.config.json` | Optional real repository links; empty until a repo exists |
| `dist/` | Generated public site; ignored by Git; only this directory is deployed |

The demo supports keyboard-operated scenario tabs, timeline inspection, comms/event filters, clock-offset exploration, per-scenario coach notes, interpretation selection, and Markdown download. Notes live in tab memory, with no persistence or server submission. It does not play audio, transcribe, or infer anything from an actual match.

For a single-file offline preview with embedded documentation, run `npm run preview-file`. It writes `../deliverables/Voice-Stat-OW-preview.html` by default; `node scripts/portable-preview.mjs /absolute/output.html` selects another destination after a normal build. The Pages deployment still uses the smaller multi-file build.

## Current project status

The recovered `overwatch-comms-lab-starter.zip` identifies its analysis application as Overwatch Comms Lab v0.3.0. Source contains consent-gated Discord capture, whisper.cpp transcription, Workshop parsing, review generation, SQLite storage, a dashboard, exports, and an optional local model interface. Those are **source-present prototype features**, not capabilities validated by building this website. No RTX 5090 performance, live Discord reliability, accuracy, or coaching outcome is claimed.

Read the [feature evidence](docs/feature-status.md) and [provenance](docs/provenance.md). The earlier site’s broad “working now” claims have been replaced with explicit source/validation distinctions. Voice Stat - OW is an independent project with no third-party affiliation or endorsement.

## Publish under your GitHub account

1. Create a new **public** repository named `voice-stat-ow` at [GitHub’s new repository page](https://github.com/new). Leave the README, license, and .gitignore options unchecked because these files already exist here.
2. In this folder, run:

```bash
git init -b main
git add .
git commit -m "Build Voice Stat - OW public website and review lab"
git remote add origin https://github.com/cvree/voice-stat-ow.git
git push -u origin main
```

3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**. This enables the deployment mechanism expected by the included workflow.
4. Open **Actions → Verify and deploy Pages → Run workflow → main**. The workflow must succeed before the site is available.
5. After deployment, use the URL shown in the workflow’s `github-pages` environment. With the exact account/repository above, the expected URL is `https://cvree.github.io/voice-stat-ow/`; it is not live until deployment succeeds.
6. Set `repositoryUrl` in `site.config.json` to the new repository’s actual URL, commit, and push. Leave `applicationUrl` empty until a separate application repository is ready to share.

Existing Git repository? Check `git status` and `git remote -v` first; do not replace another project’s remote. If you choose a different account or repository name, use its actual URL in the commands. All website assets use relative paths, so the site also supports other Pages project names.

The supplied GitHub connection could list/edit existing repositories but did not expose repository creation or Pages configuration. This deliverable is ready to push; no remote repository or live deployment was created here.

## Field manual

- [Getting started: website vs application](docs/getting-started.md)
- [Architecture and trust boundaries](docs/architecture.md)
- [Hardware, disk, and costs](docs/hardware.md)
- [Privacy, retention, and deletion limits](docs/privacy.md)
- [Consent-based pilot protocol](docs/pilot.md)
- [Milestones and acceptance criteria](docs/roadmap.md)
- [Synthetic demo and proposed data contract](docs/demo.md)
- [Contributing](docs/contributing.md)
- [Deployment, rollback, and maintenance](docs/deployment.md)

## Maintenance

Edit `site/` for the homepage, styles, and demo. Edit `docs/*.md` for the field manual. Run `npm run verify` before opening a pull request. No third-party runtime assets, fonts, cookies, analytics, or application endpoint are used. The Pages workflow deploys only the allowlisted build output, never the application or project root. GitHub itself still hosts requests and may retain service logs.

For manual browser verification, see [CONTRIBUTING.md](CONTRIBUTING.md). The site uses progressive enhancement: core information and all documentation work without JavaScript. This build is MIT licensed; trademarks and linked third-party software remain their owners’ property.
