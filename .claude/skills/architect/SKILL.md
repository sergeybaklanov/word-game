---
name: architect
description: Use for general WordUp site work (bugs, features, refactors, redesigns) that should go through plan → build → QA → review, not for adding grammar topics (use grammar-builder instead).
---

## Procedure

1. **Read the task and relevant files.** Read enough of the task description and relevant files to write a short brief (what files are involved, what approach to take) — not a full design doc, just enough for the `developer` agent to act unambiguously.

2. **Dispatch the developer agent.** Send the brief to the `developer` agent with a request to implement the changes described in the task.

3. **Dispatch QA.** Once the developer reports back, dispatch the `qa` agent to verify that the changes work correctly and don't break existing functionality.

4. **Dispatch reviewer (general checklist).** Send the diff to the `reviewer` agent to perform a general code review using the standard review checklist.

5. **Handle failures with retry cap.** If either `qa` or `reviewer` reports failure, send the specifics back to the `developer` agent and repeat from step 2. Cap the retry loop at 3 build→qa→review cycles. If still unresolved after 3 cycles, stop and report the specific blocking issue to the user instead of looping again.

6. **Report success.** On successful completion (all agents pass), report what changed and why in 3–5 sentences.
