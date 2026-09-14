---
name: dragon-hunt
description: "Run an adversarial end-to-end bug hunt across product, backend, auth, data, integrations, MCP/agent surfaces, and deployment assumptions — then prove, fix, test, and log every defect found. Behaves like a chaotic user plus a skeptical security reviewer, not a diff reader. Use when: A system is about to be called ready and the happy path working is not good enough, Before exposing a service publicly through a reverse proxy or tunnel, Auditing an app end to end rather than reviewing a single change, A bug keeps recurring and the surrounding surface is suspect, The user asks for a bug hunt, adversarial audit, or pre-launch shakedown."
metadata:
  category: dev
---

# Dragon Hunt

## Purpose

An adversarial product audit for the moments when "the happy path works" is not
good enough. Find real bugs, prove them, fix them, and leave durable evidence.

## When to Use

- Before declaring a system ready, especially before it goes public.
- Onboarding to an app whose reliability you do not yet trust.
- After a stretch of fast feature work with thin test coverage.

## Do Not Use

- For a single pull request or a narrow diff. Use `/code-review` instead — this
  skill deliberately ignores diff boundaries.
- For purely visual defects. Use `visual-qa-dogfood`.
- For architecture and modularity concerns. Use `full-systems-audit`.

## Operating Posture

- Assume bugs exist. Look for the first thing that feels too trusting, too
  implicit, too environment-dependent, too visually fragile, or too untouched by
  tests.
- Prefer proof over suspicion. A bug is real when you can reproduce it with a
  browser, a test, a request, an MCP call, database state, or a source-level
  invariant.
- Fix what you can reach in the current turn. Do not stop at a report unless the
  user asked for audit-only mode.
- Do not batch vague refactors. Each fix needs a concrete failure mode and a
  verification.
- Keep a discovery backlog for anything observed but not fixed. Close or defer
  every item before claiming the hunt complete.

## Hunt Map

Work through these surfaces. Adapt to the app, but do not skip a surface just
because it is inconvenient.

1. **Auth and sessions**
   - Try forged, stale, cross-environment, missing-secret, default-secret,
     logout, callback, and redirect flows.
   - Check open redirects, protocol-relative URLs, backslash normalisation,
     control characters, and callback state cookies.
   - If the service sits behind an access proxy, check whether it actually
     depends on that proxy for its authorisation, and what happens when a
     request arrives directly on the internal network instead of through it.

2. **Authorization and data ownership**
   - Try editing, deleting, viewing, adding, importing, saving, or notifying
     across user boundaries.
   - Include soft-deleted records, orphaned records, duplicate rows, and stale
     relationship rows.

3. **Input and upload boundaries**
   - Try empty, huge, malformed, duplicate, special-character, HTML/script, SVG,
     MIME-confused, and same-timestamp inputs.
   - Verify server-side checks, not only client affordances.

4. **Critical product journeys**
   - Use the real UI at desktop and mobile viewports.
   - Exercise create, edit, delete, search, add/remove, undo/redo, notification,
     import, export, and settings flows.
   - Test both mouse and keyboard where the interaction should be accessible.

5. **API, MCP, and agent surfaces**
   - Exercise the same product actions through public APIs, internal APIs, and
     any MCP tools the service exposes.
   - Verify tool names, parameters, error messages, idempotency, and cleanup.

6. **Persistence and deployment assumptions**
   - Compare local, container, and deployed adapters and secrets. Look for code
     that silently falls back in production.
   - Check migrations, remote schema assumptions, storage keys, queues, rate
     limits, and third-party credentials.
   - Homelab specifics worth probing: bind-mount paths that exist on the host
     but not in the container, `.env` values present locally but absent in the
     compose environment, healthcheck endpoints that return 200 while the app is
     broken, and network-backed volumes (NFS, SMB) that fail differently from
     local disk.

7. **Visual and interaction integrity**
   - Inspect every changed surface at realistic viewport sizes.
   - Look for overlapping text, accidental borders, mixed component generations,
     broken animation, unclear click targets, inaccessible contrast, and
     desktop/mobile layouts that tell different stories.
   - Hand anything substantial to `visual-qa-dogfood`.

## Proof Loop

For each suspected bug:

1. Reproduce it with the smallest reliable path.
2. Add or update a failing test when practical.
3. Patch the smallest product surface that owns the bug.
4. Re-run the focused test.
5. Re-run the wider suite needed for the blast radius.
6. Re-test the original reproduction path.
7. Record the finding and its verification in the summary or the active backlog.

## Constraints & Guardrails

- Never run destructive probes against live data. Snapshot, copy, or use a
  fixture first. In practice: no writes against a production container's volume
  without a backup, and no `docker compose down -v`.
- Confirm before touching any network-backed or shared mount. Other hosts are
  probably using it.
- Stop any long-running servers or sessions you started.

## Completion Bar

You are done only when:

- Every fixed bug has a test or an explicit manual verification note.
- Every discovered-but-unfixed item is marked deferred, superseded, or handed
  off with a real path.
- The browser, API, and MCP surfaces relevant to the request have been
  exercised.
- The repo's full verification suite has passed, or the failures are clearly
  unrelated and documented with evidence.

## Anti-Patterns

- Reporting a suspicion without a reproduction.
- Declaring the hunt complete with open backlog items.
- Fixing a symptom in the caller instead of the surface that owns the bug.
- Skipping the deployment-assumptions surface because "it works locally."

---

Adapted from `ourostack/ouroboros-skills` (`skills/dragon-hunt`).
