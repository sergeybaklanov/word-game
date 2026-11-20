# WordUp Dev Team (grammar-builder + architect) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up 4 reusable Claude Code agents (`designer`, `reviewer`, `qa`, `developer`) and 2 orchestrating skills (`grammar-builder`, `architect`), and use the first real dispatch of those agents to fix the exact reliability/mobile gaps the design doc identified in `grammar-b2/`.

**Architecture:** Build and prove the 4 agents first against small synthetic/real checks, then dogfood them (manually sequenced, since the skills don't exist yet) to deliver the nav data-refactor and the dark-mode/phone-breakpoint CSS fix — this both validates the agents and ships the fix. Only then write `grammar-builder` and `architect`, which just codify the sequence already proven to work.

**Tech Stack:** Plain HTML/CSS/JS (no framework, no build step), Python stdlib `http.server` for local serving, Playwright MCP tools for mobile-viewport browser verification, Claude Code project skills/agents.

**Spec:** `docs/superpowers/specs/2026-11-20-grammar-dev-team-design.md`

## Global Constraints

- No backend, no build tooling, no `package.json`, no test framework — stdlib Python and vanilla JS only.
- Project skills live at `.claude/skills/<name>/SKILL.md`; project agents live at `.claude/agents/<name>.md`.
- `grammar-builder` targets only the B2 pipeline (`grammar-b2.js` + `grammar-b2/`); `grammar.js` (A-level) is out of scope.
- `grammar-builder`'s end-of-pipeline check is `designer` + `reviewer` only — never `qa`.
- `qa` and `designer` verify mobile behavior via Playwright MCP at a ~390×844 viewport against a local `python -m http.server`; never `file://` (`script.js` is an ES module).
- The nav refactor (Task 5) must render every existing page byte-for-byte equivalent to its current output — no visual change.
- `grammar-b2/styles.css` dark mode reuses its existing token names (`--ink`, `--paper`, `--card`, `--rule`, `--muted`, `--hint`) inside a `@media (prefers-color-scheme: dark)` block; it does not merge with the main app's `--bg`/`--primary` tokens, and no toggle UI is added.
- New phone breakpoint: `@media (max-width: 480px)`, distinct from the existing `900px` tablet breakpoint.

## Review Focus

- A grammar topic added via `grammar-builder` whose slug already exists in `topics-data.js`/`grammar-b2.js` — must be caught and refused/flagged, not silently duplicated (Task 7).
- `architect`'s build→qa→review loop never converging — must stop after a fixed retry cap and surface the unresolved issue to the user instead of looping forever (Task 8).
- The local `python -m http.server` port already being in use when `qa`/`designer` start it — must pick a free port rather than failing outright (Tasks 1, 3).
- `reviewer` dispatched on a task that matches neither its "content" nor "general" checklist — must say which checklist it used/ask, not silently guess (Task 2).
- Dark mode making example/translation text unreadable (contrast) even though no visual *light-mode* regression occurred — Task 6's own test checks computed contrast, not just "did light mode change."

---

### Task 1: `designer` agent

**Files:**
- Create: `.claude/agents/designer.md`

**Interfaces:**
- Produces: a subagent invocable as `designer` via the Agent tool, given a prompt naming one or more pages/files to review.

- [ ] **Step 1: Write `.claude/agents/designer.md`**

YAML frontmatter: `name: designer`, a one-line `description` ("Proactive visual/UX reviewer for WordUp — mobile-first, matches the site's existing component system."), `tools: Read, Glob, Grep, Edit, Bash, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_console_messages`.

Body must instruct the agent to, for every review:
1. Start `python -m http.server` from the repo root on a free port (check with a quick probe; pick another port if the default is busy) and stop it when done.
2. Load each target page at a 390×844 viewport via Playwright; screenshot it.
3. Re-check with `page.emulateMedia({colorScheme:'dark'})` (or the Playwright MCP equivalent call) emulated.
4. Flag: horizontal overflow, clipped/overlapping text, tables that don't scroll instead of clipping, SVGs that don't scale to the container, touch targets under ~44px, any color that isn't readable against `--paper`/`--card` in both schemes.
5. Confirm new markup reuses existing classes (`rule-block`, `ex-table`, `callout`, `topic-card`, `page-header`, etc.) instead of inventing new ones.
6. Apply straightforward CSS/markup fixes directly (within the existing token system); report anything needing a judgment call instead of guessing.
7. End with an explicit `PASS` or `ISSUES: <list>` verdict.

- [ ] **Step 2: Synthetic test — invoke `designer` on an existing page**

Invoke the Agent tool with `designer` and the prompt: "Review `grammar-b2/infinitives.html` for mobile/visual issues." Expected: the transcript shows it starting a local server, navigating via Playwright at a phone viewport, taking at least one screenshot, checking both color schemes, and ending with an explicit `PASS` or `ISSUES` verdict referencing concrete elements on the page (not a generic restatement).

Then occupy `designer`'s default port first (`python -m http.server 8000 &`, note the PID) and repeat the same invocation. Expected: it still succeeds, on a different port — confirming the "probe/pick another port" instruction works — then stop both servers (`kill` the PID, and whichever port `designer` used).

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/designer.md
git commit -m "feat: add designer agent for mobile/visual review"
```

---

### Task 2: `reviewer` agent

**Files:**
- Create: `.claude/agents/reviewer.md`

**Interfaces:**
- Produces: a subagent invocable as `reviewer`, given a prompt describing what changed and which checklist applies (`content` for grammar topics, `general` for everything else).

- [ ] **Step 1: Write `.claude/agents/reviewer.md`**

Frontmatter: `name: reviewer`, description ("Quality gate for WordUp changes — reports PASS/CHANGES_NEEDED, never edits."), `tools: Read, Glob, Grep, Bash` (no `Edit`/`Write` — reviewer must be able to reject work, not quietly fix it).

Body must define two checklists and require the agent to state which one it's using (and ask if the dispatch prompt doesn't make it clear, rather than guessing):

*Content checklist* (grammar topics):
1. Every rule/example is grammatically correct English for the stated level.
2. Every Ukrainian translation is accurate and natural.
3. The new `grammar-b2.js` entry has the same object shape as its neighbors (`id, icon, title, summary, rules, examples, exercises, refPage`).
4. The new `grammar-b2/<slug>.html` only uses the shared component classes and has empty mount points for `nav.sidebar`'s topic list and `.page-nav` — no hand-written sidebar/page-nav markup.
5. `grammar-b2/topics-data.js` has exactly one new entry, correctly grouped, and `refPage` matches the new file name. The entry's `slug` does not already exist elsewhere in the file (flag as `CHANGES_NEEDED` if it does).

*General checklist* (everything else):
1. The diff matches the stated task goal; nothing unrelated changed.
2. No hardcoded per-page sidebar/page-nav markup was reintroduced (`grammar-b2/*.html` must stay mount-point-driven, see Task 5).
3. Existing design tokens were reused; no new magic colors/sizes.
4. No `qa`-reported console errors remain unresolved.

End with `PASS` or `CHANGES_NEEDED: <itemized list>`.

- [ ] **Step 2: Red/green test — confirm `reviewer` actually catches a defect**

Temporarily edit one example's Ukrainian translation in `grammar-b2/infinitives.html` to something wrong (e.g. swap in an incorrect translation). Invoke `reviewer` with the content checklist against that file. Expected: `CHANGES_NEEDED` citing that specific line. Revert the temporary edit (`git checkout -- grammar-b2/infinitives.html`) and confirm `git diff` is clean.

Then invoke `reviewer` again with a deliberately ambiguous prompt that names a file but neither checklist ("look at `grammar-b2/comparing.html`"). Expected: it states which checklist it's applying (or asks) instead of silently picking one.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/reviewer.md
git commit -m "feat: add reviewer agent for content and code review"
```

---

### Task 3: `qa` agent

**Files:**
- Create: `.claude/agents/qa.md`

**Interfaces:**
- Produces: a subagent invocable as `qa`, given a prompt naming the pages/flows to verify.

- [ ] **Step 1: Write `.claude/agents/qa.md`**

Frontmatter: `name: qa`, description ("Functional + mobile-interactive verifier for WordUp — drives a real browser, never just reads code."), `tools: Read, Glob, Grep, Bash, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_resize, mcp__plugin_playwright_playwright__browser_click, mcp__plugin_playwright_playwright__browser_type, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_console_messages`.

Body must instruct the agent to:
1. Start `python -m http.server` on a free port (probe first, pick another if busy), stop it when done.
2. At 390×844: exercise the actual changed interaction (clicks, tab switches, nav links, exercise inputs) and confirm expected behavior.
3. Read the browser console; zero new errors/warnings is required.
4. Click every link on the changed/added page and confirm none 404 against the local server.
5. Repeat at one more viewport (≈768px) to sanity-check the `900px`/`480px` CSS breakpoints.
6. End with `PASS` or `FAIL: <repro steps>`.

- [ ] **Step 2: Synthetic test — invoke `qa` against the current site**

Invoke `qa` with: "Verify every sidebar link on `grammar-b2/infinitives.html` resolves and the page has no console errors." Expected: it starts a server, navigates, clicks through the sidebar links it finds, reports console output, and ends with `PASS` (current site has no known broken links) with concrete evidence (which links it clicked) rather than a generic statement.

Then occupy `qa`'s default port first (same method as Task 1 Step 2) and repeat. Expected: it still succeeds on a different port; stop both servers afterward.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/qa.md
git commit -m "feat: add qa agent for functional mobile verification"
```

---

### Task 4: `developer` agent

**Files:**
- Create: `.claude/agents/developer.md`

**Interfaces:**
- Produces: a subagent invocable as `developer`, given an implementation brief.

- [ ] **Step 1: Write `.claude/agents/developer.md`**

Frontmatter: `name: developer`, description ("Full-stack implementer for WordUp — plain HTML/CSS/JS, no new dependencies."), `tools: Read, Edit, Write, Glob, Grep, Bash`.

Body must state:
1. The site is plain static HTML/CSS/JS; never introduce a build step, `package.json`, or dependency.
2. `grammar-b2/topics-data.js` + `grammar-b2/nav.js` are the single source of truth for sidebar/prev-next/index-card navigation — never hand-edit sidebar or `.page-nav` markup inside an individual `grammar-b2/*.html` file again.
3. `grammar-b2.js` entries and `grammar-b2/<slug>.html` pages must stay in sync via `refPage`.
4. Implement exactly the brief given; do not add unrelated improvements.
5. Hand back a short list of files touched and why.

- [ ] **Step 2: Synthetic test — invoke `developer` on a trivial real brief**

Invoke `developer` with: "In `grammar-b2/styles.css`, add `.gap-body svg { max-width: 100%; height: auto; display: block; }` so inline timeline SVGs can't force horizontal overflow on narrow screens. Nothing else." Expected: the rule is added, nothing else in the repo changes (`git diff` shows exactly that one addition).

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/developer.md grammar-b2/styles.css
git commit -m "feat: add developer agent; constrain gap-card SVGs to container width"
```

---

### Task 5: Nav data-refactor (dogfeeds `developer`, `qa`, `reviewer`)

**Files:**
- Create: `grammar-b2/topics-data.js`
- Modify: `grammar-b2/nav.js`
- Modify: all 17 files in `grammar-b2/*.html` (`comparing`, `conditionals`, `exercise`, `future-plans`, `future-tenses`, `get-phrases`, `giving-advice`, `index`, `infinitives`, `passive-voice`, `past-habits`, `past-tenses`, `present-tenses`, `reported-speech`, `stative-verbs`, `tense-contrasts`, `wishes-regrets`)

**Interfaces:**
- Produces: `GRAMMAR_B2_TOPICS` (global array, loaded via `<script src="topics-data.js">` before `nav.js`), each entry shaped
  `{ slug, navGroup, navLabel, indexGroup, cardTag, cardTitle, cardDesc }`.
  Order in the array is both the sidebar order within a `navGroup` and the flattened prev/next chain order (index.html is not in the array).
- Consumes (by `nav.js`): the DOM's own `.section[id]` + `.section-title` elements on the current page, to build in-page TOC sub-links under the active sidebar item (do not store anchors in the data file — they're derived from each page's own content).

- [ ] **Step 1: Write `grammar-b2/topics-data.js`** with this exact data (transcribed from the current site, group order matters):

```js
const GRAMMAR_B2_TOPICS = [
  { slug: 'present-tenses', navGroup: 'Present Tenses', navLabel: 'Present Tenses', indexGroup: 'Tenses', cardTag: 'Present', cardTitle: 'Present Tenses', cardDesc: 'Simple, Continuous, Perfect, Perfect Continuous — with timelines and signal words.' },
  { slug: 'past-tenses', navGroup: 'Past Tenses', navLabel: 'Past Tenses', indexGroup: 'Tenses', cardTag: 'Past', cardTitle: 'Past Tenses', cardDesc: 'Simple, Continuous, Perfect, Perfect Continuous — interrupted actions, earlier past, duration.' },
  { slug: 'future-tenses', navGroup: 'Future Tenses', navLabel: 'Future Tenses', indexGroup: 'Tenses', cardTag: 'Future', cardTitle: 'Future Tenses', cardDesc: 'will, going to, Future Continuous, Future Perfect — and how to pick the right one.' },
  { slug: 'stative-verbs', navGroup: 'B2 Special Topics', navLabel: 'Stative Verbs', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Stative Verbs', cardDesc: "Verbs that can't be continuous. Know, love, have, think — and their tricky dual meanings." },
  { slug: 'conditionals', navGroup: 'B2 Special Topics', navLabel: 'Conditional Sentences', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Conditionals', cardDesc: 'Zero, first, second, third — and the mixed conditional (past cause → present result).' },
  { slug: 'reported-speech', navGroup: 'B2 Special Topics', navLabel: 'Reported Speech', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Reported Speech', cardDesc: 'Tense backshift, time/place word changes, and reporting verb patterns.' },
  { slug: 'passive-voice', navGroup: 'B2 Special Topics', navLabel: 'Passive Voice', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Passive Voice', cardDesc: 'Formation across all tenses, when to use it, by/with, two-object passive, get-passive.' },
  { slug: 'tense-contrasts', navGroup: 'B2 Special Topics', navLabel: 'Tense Contrasts', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Tense Contrasts', cardDesc: 'The 4 most confused tense pairs. Plus: time clause rules — never use will after when/until.' },
  { slug: 'past-habits', navGroup: 'B2 Special Topics', navLabel: 'Past Habits & Plans', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Past Habits & Plans', cardDesc: "used to, would, was going to, was supposed to — what's the difference?" },
  { slug: 'wishes-regrets', navGroup: 'B2 Special Topics', navLabel: 'Wishes & Regrets', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Wishes & Regrets', cardDesc: "wish + PS/PP/would, if only, it's high time, would rather." },
  { slug: 'future-plans', navGroup: 'B2 Special Topics', navLabel: 'Future Plans', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Future Plans', cardDesc: 'All 5 future forms with a decision-tree diagram. Plus: be about to, be due to, be likely to.' },
  { slug: 'comparing', navGroup: 'B2 Special Topics', navLabel: 'Comparing', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Comparing', cardDesc: 'Comparatives, superlatives, as…as, the more…the better, modifiers, like vs as.' },
  { slug: 'get-phrases', navGroup: 'B2 Special Topics', navLabel: 'GET Phrases', indexGroup: 'B2 Special Topics', cardTag: 'Vocabulary', cardTitle: 'GET Phrases', cardDesc: '16 phrasal verbs, GET + adjective (change of state), causative GET, get-passive — with a visual map.' },
  { slug: 'giving-advice', navGroup: 'B2 Special Topics', navLabel: 'Giving & Reacting to Advice', indexGroup: 'B2 Special Topics', cardTag: 'Functional language', cardTitle: 'Giving & Reacting to Advice', cardDesc: 'From gentle suggestions to firm warnings, plus how to accept, doubt, or ask for a more specific suggestion.' },
  { slug: 'infinitives', navGroup: 'B2 Special Topics', navLabel: 'Infinitives', indexGroup: 'B2 Special Topics', cardTag: 'Grammar', cardTitle: 'Infinitives', cardDesc: 'All six infinitive forms — simple, continuous, perfect, perfect continuous, and their passive versions.' },
  { slug: 'exercise', navGroup: 'Exercises', navLabel: 'Gap-Fill Exercise', indexGroup: 'Exercises', cardTag: 'Gap-fill', cardTitle: 'Forum Post Exercise', cardDesc: '9 gaps across Past Perfect, Past Continuous, Present Perfect — each explained with a timeline diagram.' },
];
```

- [ ] **Step 2: Implement rendering in `grammar-b2/nav.js`**, added to the existing IIFE and wired into the existing `DOMContentLoaded` handler:
  - `renderSidebarTopics()`: finds `nav.sidebar`, appends (after the existing static brand/back-link markup) one `<div class="nav-group-label">` per `navGroup` change plus one `<a class="nav-item" href="{slug}.html">{navLabel}</a>` per entry, in `GRAMMAR_B2_TOPICS` order. Guard: no-op if `nav.sidebar` isn't present on the page (e.g. `index.html`).
  - After rendering, `markActivePage()` (existing function) still sets `.active`; then for the active item only, insert one `<a class="nav-item" href="#{id}" style="padding-left:36px;font-size:12px">{title}</a>` immediately after it for every `.section[id]` found in `main`, reading each section's `.section-title` text as the label.
  - `renderPrevNext()`: finds `.page-nav` (guard if absent), computes the current page's index in `GRAMMAR_B2_TOPICS` by matching the current filename, and injects the prev button (omitted for the first entry) and next button (`index.html` for the last entry, "Back to / All Topics" labelled, matching current `exercise.html` markup) using the existing `.page-nav-btn`/`.page-nav-dir`/`.page-nav-label` classes and each neighbor's `navLabel`.
  - `renderIndexCards()`: if `.index-content` is present (i.e. on `index.html`), for each distinct `indexGroup` in order, render `<div class="index-group-label">{indexGroup}</div>` + `<div class="index-grid">` containing one `<a class="index-card" href="{slug}.html">` (tag/title/desc/arrow) per entry in that group, matching current markup exactly.
  - Call all three new functions from the existing `DOMContentLoaded` listener, before `initKeyNav()` (prev/next buttons must exist before key-nav wires to them).

- [ ] **Step 3: Migrate all 17 `grammar-b2/*.html` files**
  - In every file's `<nav class="sidebar">`: delete everything from the first `<div class="nav-group-label">` (or, on `index.html`, there is no sidebar — skip) through the final `<a class="nav-item" ...>` of that block, including any page-specific `href="#..."` anchor sub-items — leave only the `nav-brand` div and the two `nav-back` anchors inside `<nav class="sidebar">...</nav>`.
  - In every file's `<div class="page-nav">`: delete the inner `<a class="page-nav-btn ...>` children, leaving `<div class="page-nav"></div>` empty.
  - In `index.html`: delete every hardcoded `<div class="index-group-label">...</div>` and `<div class="index-grid">...</div>` pair, leaving one empty `<div class="index-content"></div>` wrapper (keep the surrounding hero markup and the footer note untouched).
  - Add `<script src="topics-data.js"></script>` immediately before each file's existing `<script src="nav.js"></script>`.

- [ ] **Step 4: Dispatch `developer` with this task's brief** (steps 1-3 above) instead of editing by hand, to dogfood the agent. Review its file list against the 19 files named above (17 HTML + `topics-data.js` + `nav.js`); nothing else should be touched.

- [ ] **Step 5: Verify no hardcoded nav markup remains**

Run: `grep -rl 'class="nav-group-label"\|class="page-nav-btn"\|class="index-group-label"' grammar-b2/*.html`
Expected: no output (zero matches — that markup now only exists inside `nav.js`'s generated strings).

- [ ] **Step 6: Dispatch `qa` against at least 3 representative pages** (`index.html`, `infinitives.html` — the page with in-page TOC anchors — and `exercise.html` — the last-in-chain page). Expected: `PASS`, confirming sidebar links, prev/next links, and index cards all resolve and match pre-refactor behavior, with no console errors.

- [ ] **Step 7: Dispatch `reviewer` with the general checklist** against the full diff. Expected: `PASS`, confirming no stray hardcoded nav markup reappeared and nothing unrelated changed. If `CHANGES_NEEDED`, send the specifics back to `developer` (Step 4) and repeat Steps 5-7 once.

- [ ] **Step 8: Commit**

```bash
git add grammar-b2/topics-data.js grammar-b2/nav.js grammar-b2/*.html
git commit -m "refactor: drive grammar-b2 sidebar/prev-next/index cards from one data file"
```

---

### Task 6: Dark mode + phone breakpoint for `grammar-b2/styles.css`

**Files:**
- Modify: `grammar-b2/styles.css`

**Interfaces:**
- Consumes: the existing `:root` token names from Task 5's unchanged pages (`--ink`, `--paper`, `--card`, `--rule`, `--muted`, `--hint`).

- [ ] **Step 1: Dispatch `developer` with this brief:**
  1. Add, right after the existing `:root { ... }` block:
     ```css
     @media (prefers-color-scheme: dark) {
       :root {
         --ink:   #ece8de;
         --paper: #17140f;
         --card:  #211d16;
         --rule:  #332d22;
         --muted: #a99d87;
         --hint:  #7d7362;
       }
     }
     ```
  2. Change `.ex-table-wrap` (currently `overflow: hidden`) to `overflow-x: auto; overflow-y: hidden;` and add `.ex-table { min-width: 480px; }` so narrow phones scroll the table horizontally instead of clipping its three columns.
  3. Add a new responsive block (the existing one is `@media (max-width: 900px) { ... }`):
     ```css
     @media (max-width: 480px) {
       .page-header h1 { font-size: 22px; }
       .section-title { font-size: 20px; }
       .ex-table-wrap { margin: 0 -18px; border-radius: 0; border-left: none; border-right: none; }
     }
     ```
  4. Nothing else in the file changes.

- [ ] **Step 2: Dispatch `designer` against `grammar-b2/infinitives.html` and `grammar-b2/exercise.html`** (the page with the widest tables/SVGs). Required checks: light-mode screenshot unchanged in substance from before Step 1; dark-mode screenshot shows the new `--paper`/`--ink` values with readable contrast; `.ex-table-wrap` scrolls horizontally at 390px width instead of clipping; `.gap-body svg` (fixed in Task 4) still fits the viewport. Expected: `PASS`.

- [ ] **Step 3: Verify the exact dark values landed**

Run: `grep -A6 "prefers-color-scheme: dark" grammar-b2/styles.css`
Expected: the six variable overrides from Step 1, verbatim.

- [ ] **Step 4: Commit**

```bash
git add grammar-b2/styles.css
git commit -m "fix: add dark mode and a phone breakpoint to grammar-b2 reference pages"
```

---

### Task 7: `grammar-builder` skill

**Files:**
- Create: `.claude/skills/grammar-builder/SKILL.md`

**Interfaces:**
- Consumes: `GRAMMAR_B2_TOPICS` shape from Task 5, the `designer`/`reviewer` agents from Tasks 1-2.
- Produces: a skill invocable by name, given a topic + source material from the user.

- [ ] **Step 1: Write `.claude/skills/grammar-builder/SKILL.md`**

Frontmatter: `name: grammar-builder`, `description`: "Use when the user gives a B2 English grammar topic (name + source material) and wants it added to WordUp's grammar-b2 pipeline."

Body, as an ordered procedure:
1. If the topic or source material is missing, ask for it — never invent grammar rules from nothing.
2. Check `grammar-b2/topics-data.js` and `grammar-b2.js` for a slug collision (same or near-same topic); if found, stop and flag it to the user instead of creating a duplicate.
3. Draft rules (terse bullets), 3-5 bilingual (en/uk) examples, and 8-14 practice exercises with hints, matching the density and tone of neighboring `grammar-b2.js` entries.
4. Append the new object to `grammar-b2.js` with the same shape as its neighbors (`id, icon, title, summary, rules, examples, exercises, refPage`).
5. Create `grammar-b2/<slug>.html` reusing the shared component classes (`page-header`, `section`, `rule-block`, `ex-table`, `callout`, `topic-card`) with empty mount points for the sidebar topic list and `.page-nav` (per Task 5) and `<script src="topics-data.js"></script>` + `<script src="nav.js"></script>` at the end.
6. Add exactly one new entry to `GRAMMAR_B2_TOPICS` in `grammar-b2/topics-data.js`, in the right `navGroup`/`indexGroup` and position (ask the user if it's ambiguous which group it belongs in); set `refPage` on the `grammar-b2.js` entry to match.
7. Dispatch `designer` on the new page only.
8. Dispatch `reviewer` with the content checklist on the new page + data entries.
9. Apply any fixes reviewer/designer surfaced that need redrafting; re-dispatch once if either returned non-`PASS`.
10. Report done with a link to the new reference page and confirmation the app's Grammar tab entry is wired.

- [ ] **Step 2: Disposable end-to-end test**

Invoke `grammar-builder` with a throwaway topic, e.g. slug `test-topic-zzz`, trivial content ("one rule, one example, two exercises"). Expected: `grammar-b2.js` gains one entry, `grammar-b2/test-topic-zzz.html` is created, `topics-data.js` gains one entry, `designer`+`reviewer` both ran and reported `PASS`. Then revert everything the dry run created:

```bash
git checkout -- grammar-b2.js grammar-b2/topics-data.js
rm grammar-b2/test-topic-zzz.html
git status
```

Expected: `git status` shows the repo back to pre-test state.

Then invoke `grammar-builder` a second time with a slug that already exists, e.g. "add a grammar topic for infinitives" (collides with `infinitives`). Expected: it stops and flags the collision to the user instead of creating a duplicate entry or file — confirm with `git status` that nothing was created.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/grammar-builder/SKILL.md
git commit -m "feat: add grammar-builder skill"
```

---

### Task 8: `architect` skill + end-to-end validation

**Files:**
- Create: `.claude/skills/architect/SKILL.md`

**Interfaces:**
- Consumes: `developer`, `qa`, `reviewer` agents from Tasks 2-4.
- Produces: a skill invocable by name, given a general task description.

- [ ] **Step 1: Write `.claude/skills/architect/SKILL.md`**

Frontmatter: `name: architect`, `description`: "Use for general WordUp site work (bugs, features, refactors, redesigns) that should go through plan → build → QA → review, not for adding grammar topics (use grammar-builder instead)."

Body, as an ordered procedure:
1. Read enough of the task and the relevant files to write a short brief (what files, what approach) — not a full design doc, just enough for `developer` to act unambiguously.
2. Dispatch `developer` with that brief.
3. Dispatch `qa` against the result.
4. Dispatch `reviewer` (general checklist) against the diff.
5. If either `qa` or `reviewer` reports failure, send the specifics back to `developer` and repeat from step 2. Cap at 3 build→qa→review cycles; if still unresolved after 3, stop and report the specific blocking issue to the user instead of looping again.
6. On success, report what changed and why, in 3-5 sentences.

- [ ] **Step 2: End-to-end validation on a real small task**

Invoke `architect` with: "`grammar-b2/stative-verbs.html`'s `<title>` and `<h1>` should both say 'Stative Verbs' consistently with the sidebar label — check all 17 `grammar-b2/*.html` pages for any `<title>`/`<h1>` text that doesn't match its `navLabel` in `topics-data.js`, and fix any mismatch." Expected: `architect` runs the full loop (`developer` checks and fixes any mismatch or reports none found; `qa` confirms pages still render; `reviewer` confirms the diff is scoped to only the mismatches found) and reports done. If it finds zero mismatches, that's a valid pass — confirm via `grep` that no `<title>`/`navLabel` pair actually differs, so a "nothing to fix" report is verified, not assumed.

Also confirm the retry cap exists as written, since forcing 3 real failing cycles isn't practical here: `grep -n "3" .claude/skills/architect/SKILL.md` shows the cap, and the body text explicitly says to stop and report to the user rather than loop indefinitely past it.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/architect/SKILL.md
git commit -m "feat: add architect skill for general site work"
```
