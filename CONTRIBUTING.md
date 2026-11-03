# Contributing to the Voice Stat - OW website

Run `npm run dev` and `npm run verify` with Node.js 24. Change source in `site/`, `docs/`, `examples/`, or `scripts/`; generated `dist/` is not committed. This site intentionally has no npm dependencies.

## Verify a change

1. Run `npm run verify`.
2. Open the preview at `/` and `/voice-stat-ow/`. Test a docs page under both paths.
3. At 1440 px and 390 px widths, check navigation, long text, tables, and horizontal overflow. Also check a 320 px viewport and 200% browser zoom.
4. Use only the keyboard: skip link, mobile menu (Escape closes it), scenario tabs (arrows, Home, End), range inputs, filters, notes, export, and FAQ disclosures.
5. Enter notes in two scenarios. Switch tabs and confirm each note and interpretation survives. Export and confirm all examples and notes appear, including the synthetic disclaimer.
6. Move the clock offset. Game events should move; calls should stay fixed. Clear the demo and confirm all notes, interpretations, and offsets reset.
7. Disable JavaScript. The lab should explain how to enable it, while the project explanation and docs remain readable.
8. Inspect the browser’s console and Network panel. There should be no failed assets, third-party requests, recording permissions, or calls to a local analysis app.

## Review expectations

Keep provenance and capability labels accurate. Do not add fabricated testimonials, team logos, model accuracy, results, benchmarks, or public claims about untested code. Use only synthetic data in this repository. Do not paste Discord tokens, actual player voices, real transcripts, log identifiers, or private scrim outcomes into issues.

The Markdown renderer intentionally supports a small subset documented in `scripts/markdown.mjs`. Use flat lists, fenced code, pipe tables, standard links, and headings; raw HTML is escaped. For a new Markdown feature, add a focused renderer test.

When adding third-party actions or libraries, review and record their license and maintenance impact. The existing Dependabot configuration monitors GitHub Actions monthly.
