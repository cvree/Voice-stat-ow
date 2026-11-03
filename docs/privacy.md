# Privacy and participant control

Voice Stat - OW’s intended use is voluntary post-scrim team learning. The public website does not record or transcribe. The separate starter’s privacy mechanisms need verification before handling real participants’ data.

## Public website

The review lab uses fictional fixtures. Coach notes and interpretations stay in JavaScript memory for that tab until reload or close. Export creates a file on the visitor’s device. The site uses no cookies, localStorage, analytics, third-party fonts, microphone permissions, or application API. Avoid typing private team details into a public sample demonstration.

GitHub or another host still serves the pages and handles request metadata. Website code cannot promise that its hosting provider keeps no access logs.

## Proposed recording practice

- Use one dedicated team channel and explain the purpose before joining it.
- State what is captured, where files live, who can access them, and the deletion schedule.
- Collect fresh explicit consent for each session. Presence in a server or scrim is not permission to record.
- Stop or pause whenever a participant lacks or revokes consent.
- Record only the participating team. Exclude unrelated conversations and opponent channels.
- Allow corrections and removal requests without using them as a negative player evaluation.
- Restrict access to the operator and agreed coach. Use device encryption and a protected login.

These are operating principles, not a certification that the prototype enforces them. Confirm recording requirements applicable to the participants and the institution before a pilot.

## Local-first has network exceptions

Discord carries the voice call over the internet. Software installation and model downloads also need network access. The intended transcription and deterministic review run locally after setup. The optional Ollama path is intended for a loopback-only model, but its configuration and data bundle require their own review.

The source’s model bundle removes some infrastructure identifiers, yet includes session details, names, notes, and evidence. It is not an anonymization guarantee. Keep it on the operator’s machine and inspect what is supplied before enabling it.

## Retention is not one deletion switch

The starter configures a default 14-day raw-audio expiry. Cleanup is application code, not an operating-system guarantee. If the app is stopped, the machine is off, a backup exists, or a file was exported, expiry alone cannot guarantee removal. Confirm cleanup runs and verify actual files are gone. Prefer shorter retention whenever practical.

The participant deletion command is scoped to the active session. Source revokes consent and removes participant audio and transcript rows, and requests report regeneration. Game logs remain. Mixed clips, older exports, temporary files, notes, backups, other sessions, and copies already shared may still contain identifying content. Do not promise complete erasure from that command alone.

## Removal checklist for an operator

1. Stop capture and confirm the recording indicator/state before changing data.
2. Identify the affected participant and all relevant sessions locally.
3. Use the supported participant-removal path and verify raw audio/transcript removal.
4. Regenerate or remove derived reports and mixed clips; inspect notes and copied Workshop logs.
5. Check temporary transcription work, downloaded exports, backups, and copies shared with coaches.
6. Record what was removed and any copies outside your control, without duplicating sensitive content in the record.

Test this process with a synthetic or volunteer session before relying on it for a roster. Complete derivative deletion and cross-session controls are a [roadmap gate](roadmap.md), not a completed product guarantee.

## Human boundaries

Do not infer emotion, personality, leadership quality, intent, effort, or player value from transcripts. Avoid automated public rankings or disciplinary conclusions. Missing context, transcription errors, and unclear timing can change the story. The useful output is a review question, checked by people who know the game and the team.
