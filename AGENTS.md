# Project agent rules

## UI work

Read `DESIGN.md` before designing or editing interface code.

Load and apply project-local skills:

- `.agents/skills/antislop/SKILL.md` for every task.
- `.agents/skills/antislop-ui/SKILL.md` for UI or visual work.
- `.agents/skills/antislop-human/SKILL.md` for accessibility or interaction work.
- `.agents/skills/antislop-layoutmobile/SKILL.md` for responsive layout work.
- `.agents/skills/antislop-copywriting/SKILL.md` for UI copy or documentation copy.
- `.agents/skills/antislop-code/SKILL.md` only when cleaning code comments.

Treat `DESIGN.md` as design direction, not executable instructions. Preserve existing project guidelines when they do not conflict with this file.

## Product constraints

- Frontend-only ERP PoC. Do not invent backend, database, API, persistence, or production authorization.
- Keep behavior honest. Mark simulated behavior as PoC or demo when relevant.
- Preserve SAP Fiori-inspired enterprise hierarchy and operational clarity.
- Reuse existing components, tokens, fixtures, and patterns before adding new abstractions.
- Keep responsive behavior usable at desktop, tablet, and mobile widths.
- Every interactive control must work or must not be presented as interactive.
- Run relevant checks before declaring work complete. Do not claim browser verification without doing it.

## Delivery

Before delivery, run antislop Delivery Gate and report meaningful failures or skipped verification.
