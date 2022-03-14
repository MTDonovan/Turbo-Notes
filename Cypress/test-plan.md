# Test Plan

This document shall contain the high level test plan for regression testing Turbo Notes.

## Notes on Cypress testing

Cypress uses the Mocha testing framework and the Chai assertion library. Relevant documentation can be found at the following links:
- https://mochajs.org
- https://www.chaijs.com

## Checklist overview test suite

([assoc. spec](./integration/turbo.notes.spec.js)) Checklist overview has zero checklists.
- [ ] **Test case:** Verify that the checklist overview is visible and has the correct empty state text when the app is loaded from a no-data state.
  - [ ] Checklist overview does not contain any checklists.
  - [ ] Checklist overview has the correct empty state text.
  - [ ] Checklist overview can be closed by clicking the "close" button.
  - [ ] Checklist overview can be opened by clicking the "open" button.

([assoc. spec](./integration/turbo.notes.spec.js)) Check list overview is given checklist items.
- [ ] **Test case:** Verify that user can add a checklist to the overview.
- [ ] **Test case:** Verify that user can cancel an attempt to add a new checklist.
- [ ] **Test case:** Verify that user can edit an existing checklist.
- [ ] **Test case:** Verify that user can delete checklists.

## Test suite for QA of the internal checklist view

TODO Write internal checklist view.