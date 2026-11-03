# Start with the right component

The easiest first step is the public [synthetic review lab](../index.html#review). It needs only a modern browser. It does not ask for Discord access, a recording, a model, or an API key.

## Run this website locally

Install [Node.js 24 LTS](https://nodejs.org/en/download). Download this website repository, extract it, open a terminal inside its folder, and run:

```bash
npm run dev
```

Open `http://127.0.0.1:4173`. After source changes, stop with Ctrl+C and rerun. To verify the repository:

```bash
npm run verify
```

The build output is `dist/`. To publish it, follow [Deploy the website](deployment.md). These instructions install no analysis software.

## Locate the analysis starter

The separate application was delivered as `overwatch-comms-lab-starter.zip`. Its root contains `src/`, `scripts/setup-windows.ps1`, `.env.example`, and a package named `overwatch-comms-lab` at version `0.3.0`.

That archive is not included in this public website repository, and no public application download is claimed. Use your existing copy, or obtain a reviewed release from the maintainer once an application repository is available. Do not run the following application commands inside the website folder.

## First application check: synthetic data only

The recovered application README uses Node.js 24+ and pnpm. Install a current pnpm version using its [official installation instructions](https://pnpm.io/installation), then open a terminal at the application root:

```bash
pnpm install
```

In Windows PowerShell, create the local configuration:

```powershell
Copy-Item .env.example .env
pnpm test
pnpm demo
pnpm dev
```

Open `http://127.0.0.1:4317`. This is the application’s loopback dashboard, separate from the website on port 4173. Leave Discord credentials blank for this first check. Keep your terminal open while the server runs.

These commands are grounded in the recovered source, not a newly verified Windows installation. Record any install or native-module failures before proceeding. The starter does not include a dependency lockfile, so record resolved package versions for a reproducible pilot.

## Add local transcription after the demo

Install FFmpeg, Git, CMake, a compatible C++ build toolchain, and whisper.cpp with a downloaded model. The starter has a Windows helper, but it also invokes Corepack and downloads moving upstream versions. Review it before running; Corepack may need separate installation on your Node distribution. Visual Studio Build Tools with C++ support may be required by the build.

Its documented helper command, from the application root, is:

```powershell
.\scripts\setup-windows.ps1
```

If PowerShell blocks the script, review the file and your organization’s script policy; use an approved way to run it. Do not weaken system-wide policy to follow this guide.

For a manual install, set actual executable/model paths in the application’s local `.env`:

```dotenv
WHISPER_CPP_BIN=C:\tools\whisper.cpp\build\bin\Release\whisper-cli.exe
WHISPER_MODEL=C:\tools\whisper.cpp\models\ggml-medium.en.bin
FFMPEG_BIN=C:\ffmpeg\bin\ffmpeg.exe
```

```bash
pnpm doctor
```

Resolve missing tool/model checks before attempting transcription. The website does not depend on these tools. See [hardware assumptions](hardware.md) and [whisper.cpp’s official build guide](https://github.com/ggml-org/whisper.cpp).

## Only then connect a private Discord test

Use an application-specific bot in a private test server. Keep the bot token only in the application’s ignored `.env`. Follow its own README for guild registration, and run `pnpm register-commands` followed by `pnpm dev`.

Before any real scrim, test consent, joins, revocation, stops, and deletion with willing volunteers. Confirm current Discord voice-receive compatibility; source presence is not a live-service guarantee. Use [the pilot protocol](pilot.md) before recording a team.

## After a stopped test session

Replace the placeholders with an actual session ID and log directory in the application:

```bash
pnpm import-folder -- <session-id> "C:\path\to\Workshop"
pnpm transcribe -- <session-id>
pnpm report -- <session-id>
pnpm clips -- <session-id>
pnpm export -- <session-id>
```

The CLI source supports these commands. They remain a pilot procedure, not a claim of a completed end-to-end run. Never publish the resulting session directory to Pages.
