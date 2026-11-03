# Help build a review tool worth trusting

The most useful contribution is one that closes a specific uncertainty. Competitive players can identify confusing review questions. Coaches can test whether evidence helps a discussion. Engineers can make installation, parsing, capture, and deletion easier to verify.

## Good first contributions

| Perspective | Useful contribution |
| --- | --- |
| Player | A fictional scenario showing ambiguous, useful, or conflicting calls |
| Coach | A rubric for useful vs misleading candidates, tested with consented evidence |
| Frontend/accessibility | Keyboard, screen-reader, narrow-screen, reduced-motion, and documentation improvements |
| Audio/platform engineering | Reproducible volunteer tests of capture, consent transitions, and failure recovery |
| Data engineering | Synthetic parser fixtures, timestamp edge cases, stable evidence-reference tests |
| Privacy/security | Specific tests of local access, deletion, export scope, and model-context minimization |

## Website workflow

Use Node.js 24. Run `npm run dev` to preview and `npm run verify` before submitting changes. Edit the source folders; do not commit `dist/`. There are no npm runtime or development dependencies.

For browser checks, use desktop and mobile widths, keyboard-only navigation, a JavaScript-disabled load, and a Network panel check for unexpected requests. Confirm that per-scenario notes and interpretations export correctly and that the synthetic label remains visible.

## Contribution boundaries

Keep real voices, transcripts, identifiers, Workshop logs, credentials, and private coaching outcomes out of public issues and commits. Use synthetic fixtures or describe the problem without publishing the evidence. Ask participants before sharing any real examples privately with a maintainer.

Keep capability language precise: source-present, validated in a defined environment, or planned. Do not add fabricated adoption numbers, accuracy percentages, performance metrics, testimonials, or “working” labels unsupported by testing.

## Where to discuss work

Until the new website repository is published, use the project owner’s [GitHub profile](https://github.com/cvree) to locate the actual project destination. The site has no fabricated sign-up, contact submission, or repository issue link. After publication, maintainers can set the real repository URL in `site.config.json`.

Start with one [roadmap milestone](roadmap.md), a concrete expected behavior, and the evidence that will show it works. App development belongs in the separate application repository; website changes can ship independently.
