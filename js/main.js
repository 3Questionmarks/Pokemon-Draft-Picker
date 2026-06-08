/* Page initialization and event listeners. */

// ===== PAGE INITIALIZATION =====

    loadImportedListsFromStorage();
    renderImportedListDropdown();
    if (activeImportedListName && importedCustomLists[activeImportedListName]) {
      applyCustomListObject(importedCustomLists[activeImportedListName], activeImportedListName);
    }
    createPlayerInputs();
    pokemonPerPlayerElement.disabled = draftAllPossibleElement.checked;
    updatePokemonList();
    updateModeSettings();
    updateCustomListSetupStatus();
    updateCustomListEditorControls();
    validateSetup();
    resizeAllNumberInputs();
