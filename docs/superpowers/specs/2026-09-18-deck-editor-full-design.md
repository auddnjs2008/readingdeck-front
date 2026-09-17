# Full Deck Editor Redesign

## Scope

Apply ReadingDeck's editorial design to the complete shared editor used by
`/decks/create` and `/decks/[deckId]/edit`.

## Implementation

- Replace the absolutely centered navigation title with a flexible, truncating
  title next to the back link. Keep save and publish actions visible on mobile.
- Place list/graph controls in a stable toolbar above the workspace.
- Replace the draft checklist with a compact heading, card count and metadata action.
- Present ordered cards as divided reading entries, with distinct quotation styling,
  book covers, keyboard selection, reorder and removal controls.
- Present the library and card picker as flat rows with search and type toggles.
- Use restrained graph nodes, uncropped book covers, visible connection handles,
  and a horizontal zoom/layout toolbar. Remove the miniature overview.
- Match the selected-card inspector and metadata dialog to the same typography
  and surfaces. Preserve existing handlers and API contracts.
- Use dynamic viewport height on mobile and keep the add button clear of feedback.

## Verification

Browser checks used mocked profile, book and card responses on the temporary
local server. No real account data was written.

- Desktop 1440 x 900: book selection, two card additions, graph conversion and
  selected-card inspector rendered without horizontal overflow.
- Mobile 390 x 844: add-card sheet, card selection and metadata dialog rendered;
  dialog bounds fit the viewport.
- Mobile light and dark appearances inspected with screenshots.
- ESLint and TypeScript passed; full lint retains five pre-existing warnings.

Actual backend save/publish and drag gestures were not exercised in this pass.
