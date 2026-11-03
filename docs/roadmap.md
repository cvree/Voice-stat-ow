# Roadmap with acceptance criteria

Order is driven by evidence and reliability. There are no promised ship dates. Work on the public website can continue independently while the local application is validated.

## Milestone 0: public foundation

**Delivered in this repository:** a responsive project site, synthetic review lab, annotation/export interactions, browsable documentation, and a verification-gated Pages workflow. Publishing requires a GitHub repository and Pages configuration. A supplied workflow is not a completed deployment.

## Milestone 1: reproducible, trustworthy pilot

**Next priority.** Establish the recovered application’s actual behavior before extending it.

- Pin dependencies and model/tool revisions; reproduce installation on a clean Windows environment.
- Run parser, report, dashboard, and integration tests with recorded results.
- Validate current Discord receive, consent transitions, failures, stops, and long-session behavior.
- Complete participant removal across raw, derived, temporary, and exported local data; document backup limits.
- Confirm the loopback boundary and test writes, exported content, configuration, and local-model data minimization.

**Exit criteria:** a documented short volunteer pilot passes capture/stop/consent checks, produces inspectable evidence, and demonstrates deletion without unexplained residual copies under operator control. Any unresolved platform incompatibility is recorded and blocks claims of readiness.

## Milestone 2: alignment and vocabulary

- Implement a shared sync marker linking comms, Workshop logs, and optional VOD.
- Surface uncertainty instead of implying exact timing from a heuristic offset.
- Add a team glossary and a reversible correction workflow.
- Review candidate false positives and failure modes with a coach.

**Exit criteria:** start/end anchors verify alignment and drift within a team-agreed tolerance, and sampled transcripts/candidates have documented correction and usefulness feedback. The team defines tolerances before evaluating results.

## Milestone 3: a repeatable coach workflow

- Preserve coach verdicts and notes across report regeneration and schema changes.
- Provide precise, tested VOD links where a verified sync basis exists.
- Improve installation and diagnostics; a signed Windows package requires a maintainable signing/release process.
- Document recovery from a crash, failed model run, and incomplete export.

**Exit criteria:** a coach can operate an approved session, find evidence, correct a candidate, export chosen moments, and complete cleanup using the guide without developer intervention.

## Milestone 4: deliberate sharing and team learning

- Design selective sharing and encrypted bundles with consent scope and revocation limits documented.
- Add longitudinal views based on coach-approved moments with stable definitions and roster context.
- Evaluate any optional local model against a fixed, permissioned evidence set before exposing stronger claims.

**Exit criteria:** sharing boundaries are tested, privacy/deletion responsibilities are explicit, and trends are descriptive with comparable denominators. No emotion scoring, automatic player grades, or causal win-rate claims.

## Not in the current scope

Live tactical assistance, opponent voice recording, public player rankings, automatic blame assignment, hosted transcript ingestion, and claims of research validation are outside this project’s current purpose. The near-term goal is a reliable post-scrim review process for one consenting team.
