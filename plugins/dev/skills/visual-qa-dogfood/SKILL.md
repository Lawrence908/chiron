---
name: visual-qa-dogfood
description: "Force screenshot-backed verification of any change that touches a user-visible surface, so a task is never called done on passing metrics alone. Produces an absurdity ledger of visual defects with a disposition for each, and re-captures evidence after fixes. Use when: A diff changes UI, CSS, layout, typography, visual assets, or rendered document output, The user supplies a screenshot or says something looks wrong / weird / broken / off, A probe reports dimensions, clipping, overflow, or contrast for a visual surface, You are about to declare a frontend task complete because tests passed."
metadata:
  category: dev
---

# Visual QA Dogfood

## Purpose

Close the gap between "all automated checks pass" and "a human opens it and
immediately sees nonsense." Metrics are necessary but never sufficient for a
visual surface.

## When to Use

- The diff touches UI, rendered document output, layout CSS, typography, visual
  assets, viewport behaviour, or screenshots.
- The user supplied a screenshot, or said something "looks wrong", "weird",
  "ugly", "unreadable", "off", or "not done".
- A validation harness reported dimensions, clipping, overflow, contrast, or
  scroll metrics for a visual surface.
- You are tempted to call the UI done because tests and probes passed.

## Do Not Use

- Backend-only changes with no rendered output.
- Pure copy edits inside an existing, already-verified layout.
- As a substitute for `dragon-hunt` (functional bugs) or `/code-review` (code
  quality). This skill only asks "does it look right to a human."

## Inputs Required

- The diff, and a way to render the affected surfaces.
- A capture tool. Usually the Playwright MCP (`browser_navigate` then
  `browser_take_screenshot`), the app's own dev server, or a container reachable
  through your reverse proxy.
- At least one piece of realistic content. A fixture with three words does not
  exercise the layout.

## Workflow

1. **Name the surfaces.** List every user-visible surface touched or plausibly
   affected: routes, panels, document states, light and dark themes, viewport
   sizes, and empty / loading / error states.

2. **Use realistic content.** Prefer the user's own screenshot or source
   fixture, plus at least one dense, ugly, real-world example. Never edit live
   user data to test with; copy it into a fixture first.

3. **Capture visuals.** Cover a desktop viewport and a narrow one whenever the
   layout can vary. 1920x1080 is the realistic desktop default — a 900px-tall
   screenshot is not what your users see.

4. **Inspect like a user, not a meter.** Look for:
   - huge empty regions, tiny content ribbons, bad column balance
   - content clipped, overlapped, hidden behind chrome, or starting off-screen
   - local scroll where page scroll belongs, and the reverse
   - unreadable line length, crushed words, awkward wraps, illegible contrast
   - controls that do not look clickable, labels that lie, stale product names
   - state mismatch between what the app says and what it shows

5. **Write an absurdity ledger.** For each oddity record: screenshot path,
   viewport and state, why a user would perceive it as broken, and a
   disposition — `ready`, `fixed`, `intentionally accepted`, `out of scope`, or
   `needs review`. "Probe passed" is not a disposition.

6. **Fix the highest-signal `ready` item.** If it is in scope and tractable,
   patch it now rather than reporting it.

7. **Re-capture after fixes.** Final evidence must come from the fixed build,
   never a stale screenshot.

8. **Review gate.** For non-trivial visual changes, spawn a fresh subagent with
   the before/after screenshots, the diff, and the ledger. Ask for `PASS` or
   concrete visual blockers.

## Constraints & Guardrails

- Never edit live user documents or production data to produce a test case.
- Stop any dev server or browser session you started, unless the user asked for
  it to stay up.
- Do not claim you inspected a surface you did not actually render.

## Outputs Produced

- Screenshots of every touched surface, at the viewports that matter.
- An absurdity ledger with a disposition on every entry.
- The fixes applied, plus fresh evidence from the fixed build.

## Done Means

- Touched surfaces have visual evidence.
- No `ready` or `needs review` items remain in the ledger.
- Automated checks still pass.
- A review gate passed, or the change was trivial enough to justify skipping it.
- The deployed or packaged surface was verified, not only a dev build.

## Anti-Patterns

- Declaring done from DOM metrics without viewing the surface.
- Testing only the bug's first screenshot and not nearby variants.
- Accepting "horizontal scroll exists" without checking whether the content is
  readable.
- Cropping a screenshot so the broken relationship to the viewport disappears.
- Treating a user's screenshot as illustrative rather than as the primary repro.

---

Adapted from `ourostack/ouroboros-skills` (`skills/visual-qa-dogfood`).
