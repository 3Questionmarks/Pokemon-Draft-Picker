# Pokémon Draft Picker file structure

This version keeps the app as one page but separates the code into easier-to-edit files.

- `index.html`: page structure only.
- `style.css`: all styling.
- `pokemon-data.js`: Pokémon data.
- `js/pokemon-utils.js`: Pokémon/dex/type filtering and saved-list helpers.
- `js/state.js`: shared state variables and DOM references.
- `js/setup.js`: setup screen, validation, and navigation.
- `js/list-view.js`: list view, search/filtering, and custom-list editing.
- `js/sprites.js`: sprite URLs, shiny handling, and form cycling.
- `js/draft.js`: classic/reverse draft flow and player display.
- `js/market-draft.js`: market/reverse-market draft flow.
- `js/import-export.js`: draft and custom-list import/export.
- `js/main.js`: event listeners and startup initialization.

The script order in `index.html` matters. Keep `pokemon-data.js` first and `main.js` last.
