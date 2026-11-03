# Hardware, storage, and costs

The initial development target is the owner’s Windows gaming laptop with an RTX 5090. No on-device benchmark was available when this website was built. The GPU name alone does not establish a supported toolchain, memory availability, throughput, or acceptable gaming impact.

## Two very different requirements

| Component | Requirement or planning assumption | Evidence level |
| --- | --- | --- |
| Public website | Modern browser; no GPU or model | Implemented static website |
| Website maintenance | Node.js 22+; Node.js 24 used by the workflow | Repository configuration |
| Analysis app runtime | Node.js 24+, pnpm, writable local data folder | Recovered application package and README |
| Transcription | FFmpeg, whisper.cpp CLI, downloaded compatible model | Recovered transcription implementation |
| GPU acceleration | Compatible NVIDIA driver, CUDA toolkit, C++ toolchain, GPU-enabled whisper.cpp build | Optional path to validate on the actual machine |
| Pilot memory | Start planning around 16–32 GB system RAM | Estimate, not a tested minimum |
| Pilot disk headroom | Start with 20–50 GB free, then measure usage | Estimate; model choice and video can change it substantially |
| Optional analyst | Local Ollama plus a suitable model | Additional memory/disk load; not needed for deterministic review |

whisper.cpp documents CPU support and optional CUDA acceleration. Consult its [official README](https://github.com/ggml-org/whisper.cpp) for current build and model details. Start with one short synthetic or consented file on CPU; validate a GPU build separately. A modern GPU can still fail with an incompatible driver, toolkit, compiler, or binary.

## Process after the scrim

Recording should be kept lightweight. Run transcription and any local language model after play to avoid competing with the game for GPU memory, power, and cooling. Check laptop thermals, free space, audio integrity, and background apps. Measure actual frame-time impact if the same laptop both plays and records.

## A transparent disk estimate

For encoded audio, before container overhead and duplication:

```text
audio GB ≈ bitrate_kbps × recorded_hours × 3600 ÷ 8 ÷ 1,000,000
```

A hypothetical continuously encoded 64 kbps stream for two hours is about 0.058 GB. Five such streams are about 0.288 GB. The starter records separate speech turns rather than continuous streams, and actual Discord bitrate and speaking time vary. This is arithmetic, not a measured output size.

A hypothetical 12 Mbps video for two hours is about 10.8 GB. Video can dominate storage. The starter’s FFmpeg review clips are audio, not an implemented full-game VOD recorder. OBS is a separate optional capture tool; see its [audio-track guide](https://obsproject.com/kb/multiple-audio-track-recording-guide). Separating game audio, microphone, and voice-chat sources is useful, but one mixed Discord channel track does not identify individual speakers.

Budget for model downloads, converted temporary WAVs, SQLite and logs, clips, report copies, and backups. Measure actual per-session growth before setting a longer retention policy.

## What “no paid API required” means

The proposed core uses local software and downloaded models, without a mandatory per-minute AI transcription bill. That does not make operation costless. Hardware, electricity, disk space, backups, setup, and coach/operator time all count. GitHub Pages hosting eligibility and usage limits depend on GitHub’s current terms and repository visibility; see [deployment](deployment.md).

## Record a real benchmark before making promises

- Record OS, driver, CUDA/compiler, whisper.cpp revision, model, and command line.
- Use a permitted clip with known duration; document language, speaker count, and noise.
- Measure wall time, peak RAM/VRAM, disk growth, and failures, with other workloads recorded.
- Manually check hero names, callouts, timestamps, and omissions against the original audio.
- Publish only results the participants approve, alongside method and limitations.
