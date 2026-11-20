# Design: a small Claude Code "dev team" for WordUp

## Intent and why

WordUp is a mobile-first, static (no backend, no build step) English-learning
app: `index.html` + `script.js` drive a tabbed Practice/Grammar/Plan/Progress
app in Ukrainian, backed by `grammar.js` (A-level) and `grammar-b2.js`
(B2-level) topic data. B2 topics additionally get a full deep-dive reference
page under `grammar-b2/*.html`, sharing `styles.css` + `nav.js`.

The user adds new B2 grammar topics by hand today (source material → rules,
bilingual examples, exercises → app entry → reference page → sidebar/index/
prev-next links hand-edited across up to 15 HTML files). That's slow and the
hand-edited nav is the main source of dead links. Separately, the user wants
a repeatable way to do general site work (features, fixes, redesigns) with
the same rigor: plan it, build it, test it on a phone-sized viewport, review
it, before calling it done.

Goal: two Claude Code skills and four agents that cover both needs without
duplicating logic, sized to a one-person hobby project (no CI, no deploy
pipeline — these run locally in Claude Code).

## Goals

- A `grammar-builder` skill: given a topic name + source material, produces
  a new B2 grammar topic end to end — `grammar-b2.js` entry, `grammar-b2/
  <slug>.html` reference page matching the existing visual system exactly,
  and all navigation wiring — then gets it checked by the `designer` and
  `reviewer` agents before reporting done.
- An `architect` skill: given a general task (bug fix, feature, refactor,
  redesign), plans it, delegates implementation to the `developer` agent,
  has `qa` verify it on a phone-width viewport, has `reviewer` review the
  diff, loops on failures, reports done.
- Four agents, shared by both skills where it makes sense: `developer`,
  `qa`, `reviewer`, `designer`.
- Fix the hand-duplicated sidebar/prev-next/index-card markup in
  `grammar-b2/*.html` so adding a topic touches one data file, not up to
  15 HTML files. This is a prerequisite for `grammar-builder` being
  reliable, not an optional nice-to-have.
- Everything mobile-first: `qa` and `designer` judge against a phone
  viewport (≈375–430px) by default, not desktop.

## Non-goals

- No backend, no build tooling, no package.json, no test framework
  introduction. The site stays plain HTML/CSS/JS.
- No rewrite of the main app's tab system, SRS logic, or the A-level
  (`grammar.js`) content pipeline. Only the B2 pipeline is in scope for
  `grammar-builder`.
- No CI/CD, no automated deploy. These skills/agents run interactively in
  Claude Code sessions only.
- `architect` does not replace `grammar-builder` for the routine "add a
  topic" task — that always goes through `grammar-builder` directly, which
  is faster and doesn't re-derive the recipe each time.

## Anti-goals

- A sidebar refactor that changes the page's visual output. The nav
  becomes data-driven, but should render byte-for-byte equivalent markup
  on existing pages (verified by the `reviewer`/`qa` pass before this is
  considered done).
- Agents that rubber-stamp. `qa` and `reviewer` must be able to say "no,
  this breaks on mobile" / "no, this grammar rule is wrong" and send work
  back — that's the entire point of having them.
- Over-engineering the orchestration. `architect` is a loop, not a
  framework: plan → build → qa → review → (loop on failure) → done.

## Constraints

- Project skills live under `.claude/skills/<name>/SKILL.md`; project
  agents live under `.claude/agents/<name>.md` — both are picked up
  automatically by this Claude Code project.
- `grammar-b2/styles.css` currently has no dark-mode variables and no
  mobile breakpoint below 900px (sidebar-collapse only); the main app
  (`styles.css`) has light/dark via `--theme` tokens and a 420px
  breakpoint. `designer`/`qa` need to know this gap exists — closing it is
  in scope as a one-time fix, not something every future grammar page
  re-litigates.
- `grammar-b2.js` and `grammar-b2/*.html` must stay in sync (the app's
  quick-practice entry links to the reference page via `refPage`); the
  generator and the nav refactor must preserve that link.

## Approaches considered

- **A — two skills sharing four agents (chosen).** `architect` for general
  work, `grammar-builder` as a dedicated fast path for the one recipe run
  constantly, both ending in the same `designer` + `reviewer` pass.
  Nothing duplicated, no overhead on the routine task.
- **B — one unified `architect` for everything,** including grammar
  topics. Simpler entry point, but the most repetitive task loses its
  shortcut and re-pays planning overhead every run.
- **C — four standalone agents, no orchestrating skills.** Least to
  build, but no enforced sequence — defeats the point of asking for an
  "architect that manages" agents and a skill that "generates grammar."

User picked **A**.

## Decided (the user's calls / this conversation's calls)

- Architecture: Approach A (two skills, four shared agents) — user's pick.
- `designer` and `reviewer` are general-purpose, usable by both pipelines
  and standalone for ad-hoc requests ("review the Progress tab's mobile
  UX") — follows from picking A.
- The nav/prev-next/index-card duplication across `grammar-b2/*.html` gets
  fixed as a shared-data refactor before `grammar-builder` is relied on —
  stated as my call during brainstorming, no objection raised.
- `qa` and `designer` drive an actual mobile-width browser pass via the
  Playwright MCP tools (device-size `browser_resize`, screenshot,
  console messages), not just a code read — static analysis alone can't
  catch overflow, tap-target, or dark-mode-contrast problems. Playwright
  over claude-in-chrome because it's scriptable headlessly from a
  subagent without depending on the user's own logged-in Chrome tabs.
- Local serving for any browser pass: `python -m http.server` from the
  repo root (stdlib, zero new dependency, consistent with the existing
  `create_review_tracks.py` already assuming Python is installed).
  `index.html` loads `script.js` as an ES module, so `file://` won't
  work — agents must serve over HTTP, hit `http://localhost:<port>/...`,
  and stop the server when done. This does not add a package.json or any
  build step.
- `grammar-builder`'s end-of-pipeline check is `designer` + `reviewer`
  only — no `qa` dispatch. `designer` already does a Playwright
  screenshot-at-phone-width pass as part of its visual review (catches
  the main risk for a mostly-static reference page: overflow, contrast,
  broken layout); `reviewer` verifies links/nav-wiring/content accuracy
  by reading the files, not by driving a browser. `qa`'s heavier
  functional/interactive pass (click-through, console-error checking) is
  reserved for `architect`'s general pipeline, where real interactivity
  (tabs, SRS, forms) is actually at stake. This keeps `grammar-builder`
  fast, per its own goal, without skipping real mobile verification.
- `grammar-b2/styles.css` gets its own new dark-mode block and a new
  sub-480px phone breakpoint, using its own token names (it already has
  a distinct `--ink`/`--paper`/`--card`/... set). It stays visually
  independent from the main app's `--bg`/`--primary` tokens rather than
  merging into one shared token source — the reference site (quiet,
  serif, editorial) and the app (colorful, rounded, app-like) are
  deliberately different visual languages; forcing a shared token source
  across them would blur that, not fix the actual bug (missing dark mode
  and missing phone breakpoint).
- Skills/agents are placed per Claude Code convention:
  `.claude/skills/grammar-builder/SKILL.md`,
  `.claude/skills/architect/SKILL.md`,
  `.claude/agents/developer.md`, `.claude/agents/qa.md`,
  `.claude/agents/reviewer.md`, `.claude/agents/designer.md`.
- `grammar-builder` targets the B2 pipeline (`grammar-b2.js` +
  `grammar-b2/`) only, matching where all recent work has happened; the
  A-level pipeline (`grammar.js`, no reference pages) is out of scope
  unless the user asks separately.

## What's left to the builder

- Exact shape of the shared nav-data file (fields needed for sidebar
  grouping, card tag/description, and prev-next order) and how `nav.js`
  and `index.html` consume it — implementer's call, must render current
  pages unchanged.
- Exact prompts/checklists inside each agent's `.md` file (what `qa`
  checks item-by-item, what `reviewer` checks item-by-item, what
  `designer` checks against `styles.css`/`grammar-b2/styles.css` tokens)
  — implementer's call, informed by the existing component system
  (`rule-block`, `ex-table`, `callout`, `page-nav`, SVG timeline pattern)
  documented in this repo's `grammar-b2/*.html`.
- Whether `grammar-builder`'s content drafting step (rules/examples/
  exercises/Ukrainian translation) is done inline by the skill or
  delegated to the `developer` agent — implementer's call; given
  `grammar-builder` is meant to be the lightweight fast path, doing it
  inline (no subagent dispatch) is likely simpler and is the suggested
  default.
- Whether to use the `skill-creator` skill to scaffold/validate the two
  SKILL.md files — recommended, not required.
