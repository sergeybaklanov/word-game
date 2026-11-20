---
name: grammar-builder
description: Use when the user gives a B2 English grammar topic (name + source material) and wants it added to WordUp's grammar-b2 pipeline.
---

## Adding a B2 Grammar Topic to WordUp

Follow these steps to add a new grammar topic end to end, from drafting content through design and content review.

### 1. Validate Topic and Source Material

If the topic or source material is missing, ask for it — never invent grammar rules from nothing. Confirm you have:
- Topic name or title
- Source material (textbook excerpts, reference links, or examples the user wants covered)

### 2. Check for Slug Collision

Search `grammar-b2/topics-data.js` and `grammar-b2.js` for a slug collision (same or near-same topic). If found, stop and flag it to the user instead of creating a duplicate:
- Read both files and check if a topic with the same or similar slug already exists.
- If a collision is found, report it and ask the user to pick a different topic or modify the existing entry instead.

### 3. Draft Rules, Examples, and Exercises

Create content matching the density and tone of neighboring `grammar-b2.js` entries:
- **Rules:** Terse bullets (3–5 key points), bilingual (en/uk) where helpful.
- **Examples:** 3–5 bilingual examples (en/uk), showing concrete usage.
- **Exercises:** 8–14 practice exercises with hints, following the format: `{ sentence: '...', answer: '...', hint: '...' }`.

Match the style and detail level of existing topics (e.g., conditionals, future tenses).

### 4. Append to `grammar-b2.js`

Add the new object to the end of the `grammarB2Topics` array with this shape:
```javascript
{
  id: '<slug>',
  icon: '(emoji)',
  title: '<Full Title>',
  summary: '<1–2 sentence summary>',
  rules: [ /* array of rule strings */ ],
  examples: [ /* array of {en, uk} objects */ ],
  exercises: [ /* array of {sentence, answer, hint} objects */ ],
  refPage: '<slug>.html',
}
```

Ensure `id` matches the slug you will use in steps 5–6.

### 5. Create the HTML Reference Page

Create `grammar-b2/<slug>.html` reusing the shared component classes and following the structure of neighboring pages (copy the `<nav class="sidebar">`...`<main>` skeleton from an existing page like `infinitives.html` verbatim):
- Use existing component classes: `page-header`, `section`, `rule-block`, `ex-table`, `callout`, `topic-card`.
- `<nav class="sidebar">` keeps its static `nav-brand` + two `nav-back` links (identical on every page) — do NOT make the whole sidebar empty. Only leave nothing *after* those two links; `nav.js` appends the topic-list items there at runtime.
- `<div class="page-nav">` is fully empty — `nav.js` fills in the prev/next buttons at runtime.
- End the page with exactly these two script tags:
  ```html
  <script src="topics-data.js"></script>
  <script src="nav.js"></script>
  ```

Do NOT invent new CSS classes; reuse the existing system.

### 6. Add Entry to `GRAMMAR_B2_TOPICS`

Add exactly one new entry to the `GRAMMAR_B2_TOPICS` array in `grammar-b2/topics-data.js`:
- Choose the correct `navGroup` and `indexGroup` (ask the user if ambiguous which group the topic belongs in).
- Position it logically within its group.
- Include all required fields: `slug`, `navGroup`, `navLabel`, `indexGroup`, `cardTag`, `cardTitle`, `cardDesc`.
- Set `refPage` to the HTML filename created in step 5 (e.g., `'<slug>.html'`).
- Optionally include a `toc` array if the page has sections.

### 7. Dispatch Designer for Visual Review

Invoke the `designer` agent on the new page only (the HTML file created in step 5):
- The designer will check for mobile layout, contrast, and component consistency.
- Wait for the designer to report either `PASS` or `ISSUES`.

### 8. Dispatch Reviewer for Content Check

Invoke the `reviewer` agent with the content checklist on both:
- The new HTML reference page
- The corresponding entries in `grammar-b2.js` and `grammar-b2/topics-data.js`

The reviewer will validate:
- Grammar accuracy and completeness
- Bilingual quality (en/uk)
- Exercise quality and hint clarity
- Consistency with the site's existing content standards

Wait for the reviewer to report either `PASS` or issues requiring fixes.

### 9. Apply Fixes and Re-dispatch if Needed

If the designer or reviewer reported issues:
- Fix the content, markup, or data entries as flagged.
- Re-dispatch both the designer and reviewer once to confirm the fixes.
- Stop after one re-dispatch cycle; if either agent still reports issues, escalate to the user.

If both returned `PASS`, proceed to step 10.

### 10. Report Done

Confirm that the topic has been successfully added:
- Provide a link to the new reference page (e.g., `grammar-b2/<slug>.html`).
- Confirm that the Grammar tab entry (`topics-data.js`) is wired and will appear in the sidebar navigation and index.
- Note any caveats or manual steps the user may need to take (if any).
