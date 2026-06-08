/* Pokémon filtering, dex, type, form, and custom-list storage helpers. */

// ===== POKÉMON DATA HELPERS =====

    function getSelectedTagFilters() {
      const selectedTags = {};
      tagFilterElements.forEach((checkbox) => {
        selectedTags[checkbox.value] = checkbox.checked;
      });
      return selectedTags;
    }

    function pokemonPassesTagFilters(pokemon) {
      const tags = pokemon.tags || [];
      const selectedTags = getSelectedTagFilters();

      if (tags.includes("alternateForm") && !includeAlternateFormsElement.checked) {
        return false;
      }

      if (tags.includes("abilityForm") && !includeAbilityFormsElement.checked) {
        return false;
      }

      if (tags.includes("itemForm") && !includeItemFormsElement.checked) {
        return false;
      }

      if (tags.includes("battleOnlyForm") || tags.includes("visualOnlyForm")) {
        return false;
      }

      return tags
        .filter((tag) => !["alternateForm", "abilityForm", "itemForm"].includes(tag))
        .every((tag) => selectedTags[tag] !== false);
    }

    function getPokemonNamesForDex(gameKey, dexKey) {
      return PokemonDraftData.pokemon
        .filter((pokemon) => {
          const gameInfo = gameKey === "all"
            ? Object.values(pokemon.games || {})[0]
            : pokemon.games[gameKey];
          if (!gameInfo) return false;

          if (!pokemonPassesTagFilters(pokemon)) return false;

          if (dexKey === "stage1") {
            return gameInfo.stage1;
          }

          if (dexKey === "fullyEvolved") {
            return gameInfo.fullyEvolved;
          }

          return true;
        })
        .sort((a, b) => {
          const idA = a.natDexId ?? 99999;
          const idB = b.natDexId ?? 99999;
          const formA = a.formOrder ?? 0;
          const formB = b.formOrder ?? 0;

          if (idA !== idB) return idA - idB;
          if (formA !== formB) return formA - formB;
          return a.name.localeCompare(b.name);
        })
        .map((pokemon) => pokemon.name);
    }

    function getSelectedPokemonList() {
      return getPokemonNamesForDex(selectedPokemonGame, selectedPokemonDex);
    }

    function getCurrentListViewerPokemonList() {
      if (customDraftList) {
        return customListEditMode ? getPokemonNamesForDex("all", "full") : [...customDraftList.pokemon];
      }

      return getPokemonNamesForDex(selectedPokemonGame, selectedPokemonDex);
    }

    function getFilteredListViewerPokemon() {
      const pokemonList = getCurrentListViewerPokemonList();
      const searchTerm = listSearchInputElement.value.trim().toLowerCase();
      const searchedPokemonList = searchTerm
        ? pokemonList.filter((pokemon) => getPokemonDisplayName(pokemon).toLowerCase().includes(searchTerm) || pokemon.toLowerCase().includes(searchTerm))
        : pokemonList;

      return searchedPokemonList.filter(pokemonMatchesListExtraFilters);
    }

    function browserStorageAvailable() {
      try {
        const testKey = "__pokemonDraftStorageTest__";
        window.localStorage.setItem(testKey, "1");
        window.localStorage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    }

    function updateImportedListStorageStatus() {
      if (!importedListStorageStatusElement) return;
      const savedCount = Object.keys(importedCustomLists).length;
      importedListStorageStatusElement.textContent =
        `Saved in this browser's localStorage under keys "${IMPORTED_LISTS_STORAGE_KEY}" and "${ACTIVE_IMPORTED_LIST_STORAGE_KEY}". Saved lists: ${savedCount}.`;
    }

    function loadImportedListsFromStorage() {
      try {
        if (!browserStorageAvailable()) {
          importedCustomLists = {};
          activeImportedListName = "";
          updateImportedListStorageStatus();
          return;
        }

        const storedLists = window.localStorage.getItem(IMPORTED_LISTS_STORAGE_KEY);
        importedCustomLists = JSON.parse(storedLists || "{}") || {};
        activeImportedListName = window.localStorage.getItem(ACTIVE_IMPORTED_LIST_STORAGE_KEY) || "";
      } catch (error) {
        console.warn("Could not load imported lists from browser storage.", error);
        importedCustomLists = {};
        activeImportedListName = "";
      }

      updateImportedListStorageStatus();
    }

    function saveImportedListsToStorage() {
      try {
        if (!browserStorageAvailable()) {
          alert("This browser blocked localStorage. Imported lists will not persist after refreshing.");
          updateImportedListStorageStatus();
          return;
        }

        window.localStorage.setItem(IMPORTED_LISTS_STORAGE_KEY, JSON.stringify(importedCustomLists));
        window.localStorage.setItem(ACTIVE_IMPORTED_LIST_STORAGE_KEY, activeImportedListName || "");
      } catch (error) {
        console.warn("Could not save imported lists to browser storage.", error);
        alert("This browser blocked saving imported lists. The list is active now, but it may not persist after refreshing.");
      }

      updateImportedListStorageStatus();
    }

    function makeUniqueImportedListName(baseName) {
      const base = (baseName || "Custom Draft List").trim() || "Custom Draft List";
      if (!importedCustomLists[base]) return base;

      let index = 2;
      while (importedCustomLists[`${base} (${index})`]) {
        index += 1;
      }
      return `${base} (${index})`;
    }

    function serializeCustomList(list = customDraftList) {
      if (!list) return null;

      const sortedPokemon = sortPokemonNamesByDexOrder(list.pokemon || []);
      return {
        version: 1,
        kind: "pokemon-draft-custom-list",
        name: list.name || "Custom Draft List",
        createdAt: list.createdAt || new Date().toISOString(),
        settings: {
          includeAlternateForms: list.settings?.includeAlternateForms ?? includeAlternateFormsElement.checked,
          includeAbilityForms: list.settings?.includeAbilityForms ?? includeAbilityFormsElement.checked,
          includeItemForms: list.settings?.includeItemForms ?? includeItemFormsElement.checked
        },
        pokemon: sortedPokemon,
        excludedPokemon: getPokemonNamesForDex("all", "full").filter((pokemon) => !sortedPokemon.includes(pokemon))
      };
    }

    function renderImportedListDropdown() {
      const dropdowns = [importedListSelectElement, listModeImportedListSelectElement].filter(Boolean);

      dropdowns.forEach((dropdown) => {
        const previousValue = activeImportedListName;
        dropdown.innerHTML = "";

        const noneOption = document.createElement("option");
        noneOption.value = "";
        noneOption.textContent = "None";
        dropdown.appendChild(noneOption);

        Object.keys(importedCustomLists)
          .sort((a, b) => a.localeCompare(b))
          .forEach((name) => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
          });

        dropdown.value = importedCustomLists[previousValue] ? previousValue : "";
      });

      const hasActiveList = !!activeImportedListName && !!importedCustomLists[activeImportedListName];
      if (deleteImportedListButton) deleteImportedListButton.hidden = !hasActiveList;
      if (deleteImportedListFromListButton) deleteImportedListFromListButton.hidden = !hasActiveList;
      updateImportedListStorageStatus();
    }

    function applyCustomListObject(list, name = "") {
      const validPokemon = (list.pokemon || []).filter((pokemon) => getPokemonDataByName(pokemon));
      if (!validPokemon.length) {
        throw new Error("This custom list does not contain any Pokémon that exist in the current data file.");
      }

      const settings = {
        includeAlternateForms: list.settings?.includeAlternateForms ?? includeAlternateFormsElement.checked,
        includeAbilityForms: list.settings?.includeAbilityForms ?? includeAbilityFormsElement.checked,
        includeItemForms: list.settings?.includeItemForms ?? includeItemFormsElement.checked
      };

      includeAlternateFormsElement.checked = settings.includeAlternateForms;
      includeAbilityFormsElement.checked = settings.includeAbilityForms;
      includeItemFormsElement.checked = settings.includeItemForms;
      listIncludeAlternateFormsElement.checked = settings.includeAlternateForms;
      listIncludeAbilityFormsElement.checked = settings.includeAbilityForms;
      listIncludeItemFormsElement.checked = settings.includeItemForms;

      activeImportedListName = name;
      if (name) {
        try {
          window.localStorage.setItem(ACTIVE_IMPORTED_LIST_STORAGE_KEY, name);
        } catch {}
      }
      customDraftList = {
        name: list.name || name || "Custom Draft List",
        createdAt: list.createdAt || new Date().toISOString(),
        pokemon: sortPokemonNamesByDexOrder(validPokemon),
        excludedPokemon: list.excludedPokemon || [],
        settings
      };

      updatePokemonList();
      updateListViewerPresetControlsLock();
      updateCustomListSetupStatus();

      if (listViewerAreaElement.style.display === "block") {
        customListEditMode = true;
        customListSelectedPokemon = new Set(customDraftList.pokemon);
        customListEditBackup = {
          pokemon: new Set(customListSelectedPokemon),
          settings: { ...settings }
        };
        updateCustomListEditorControls();
        renderListViewer();
      }
    }

    function selectImportedList(name) {
      if (!name) {
        activeImportedListName = "";
        activeImportedListName = "";
      if (importedListSelectElement) importedListSelectElement.value = "";
      customDraftList = null;
        customListEditMode = false;
        customListSelectedPokemon = new Set();
        customListEditBackup = null;
        updatePokemonList();
        updateListViewerPresetControlsLock();
        updateCustomListEditorControls();
        updateCustomListSetupStatus();
        renderImportedListDropdown();
        if (listViewerAreaElement.style.display === "block") renderListViewer();
        return;
      }

      const list = importedCustomLists[name];
      if (!list) return;
      applyCustomListObject(list, name);
    }

    function persistActiveCustomList() {
      if (!customDraftList) return;

      const serialized = serializeCustomList(customDraftList);
      if (!serialized) return;

      if (!activeImportedListName) {
        activeImportedListName = serialized.name || makeUniqueImportedListName("Custom Draft List");
      }

      serialized.name = activeImportedListName;
      customDraftList.name = activeImportedListName;
      importedCustomLists[activeImportedListName] = serialized;
      saveImportedListsToStorage();
      renderImportedListDropdown();
      importedListSelectElement.value = activeImportedListName;
      if (listModeImportedListSelectElement) listModeImportedListSelectElement.value = activeImportedListName;
      deleteImportedListButton.hidden = false;
      if (deleteImportedListFromListButton) deleteImportedListFromListButton.hidden = false;
    }

    function deleteSelectedImportedList() {
      const name = activeImportedListName || importedListSelectElement.value || listModeImportedListSelectElement?.value;
      if (!name) return;

      const confirmed = confirm(`Delete saved list "${name}"?`);
      if (!confirmed) return;

      delete importedCustomLists[name];
      saveImportedListsToStorage();

      if (activeImportedListName === name) {
        activeImportedListName = "";
        customDraftList = null;
        customListEditMode = false;
        customListSelectedPokemon = new Set();
        customListEditBackup = null;
      }

      saveImportedListsToStorage();
      renderImportedListDropdown();
      updatePokemonList();
      updateListViewerPresetControlsLock();
      updateCustomListEditorControls();
      updateCustomListSetupStatus();
      if (listViewerAreaElement.style.display === "block") renderListViewer();
    }

    function updateCustomListSetupStatus() {
      if (!customListSetupStatusElement) return;

      if (customDraftList) {
        const label = customDraftList.name || "Custom list";
        customListSetupStatusElement.textContent = `${label}: ${customDraftList.pokemon.length} Pokémon selected. This saved list is being used for the draft.`;
      } else {
        customListSetupStatusElement.textContent = "";
      }

      renderImportedListDropdown();
      if (activeImportedListName && importedListSelectElement) {
        importedListSelectElement.value = activeImportedListName;
        deleteImportedListButton.hidden = false;
      }
      updatePremadeListControlsLock();
    }

    function updatePremadeListControlsLock() {
      const locked = !!customDraftList;
      const controls = [
        pokemonGameSelectElement,
        pokemonDexSelectElement,
        ...tagFilterElements
      ];

      controls.forEach((control) => {
        control.disabled = locked;
        const wrapper = control.closest("label") || control.closest("div");
        if (wrapper) {
          wrapper.classList.toggle("custom-list-locked-control", locked);
        }
      });

      pokemonGameSelectElement.title = locked ? "Custom lists define their own Pokémon pool. Clear the custom list to change game selection." : "";
      pokemonDexSelectElement.title = locked ? "Custom lists define their own Pokémon pool. Clear the custom list to change the Pokémon list." : "";

      updateListViewerPresetControlsLock();
    }

    function updateListViewerPresetControlsLock() {
      const locked = !!customDraftList;
      const controls = [
        listGameSelectElement,
        listDexSelectElement,
        ...listTagFilterElements
      ];

      controls.forEach((control) => {
        if (!control) return;
        control.disabled = locked;
        const wrapper = control.closest("label") || control.closest("div");
        if (wrapper) {
          wrapper.classList.toggle("custom-list-locked-control", locked);
        }
        control.title = locked
          ? "This is locked while viewing a custom list. Form toggles and list-view filters can still be used."
          : "";
      });
    }

    function updateCustomListEditorControls() {
      enterCustomListModeButton.hidden = customListEditMode;
      customListBulkControlsElement.hidden = !customListEditMode;
      exportCustomListButton.hidden = !(customListEditMode || customDraftList);
      exitCustomListModeButton.hidden = !customListEditMode;
      discardCustomListChangesButton.hidden = !customListEditMode;

      customListEditorStatusElement.textContent = "";
      updateListViewerInstruction();
    }

    function enterCustomListMode() {
      customListEditMode = true;
      customListSelectedPokemon = customDraftList
        ? new Set(customDraftList.pokemon)
        : new Set(getFilteredListViewerPokemon());
      customListEditBackup = {
        pokemon: new Set(customListSelectedPokemon),
        settings: {
          includeAlternateForms: listIncludeAlternateFormsElement.checked,
          includeAbilityForms: listIncludeAbilityFormsElement.checked,
          includeItemForms: listIncludeItemFormsElement.checked
        }
      };
      updateCustomListEditorControls();
      renderListViewer();
    }

    function exitCustomListMode() {
      const defaultName = customDraftList?.name || activeImportedListName || "Custom Draft List";
      const requestedName = (prompt("Name this custom draft list:", defaultName) || defaultName).trim() || "Custom Draft List";

      const sortedPokemon = sortPokemonNamesByDexOrder([...customListSelectedPokemon]);
      const settings = {
        includeAlternateForms: listIncludeAlternateFormsElement.checked,
        includeAbilityForms: listIncludeAbilityFormsElement.checked,
        includeItemForms: listIncludeItemFormsElement.checked
      };

      if (customDraftList) {
        if (activeImportedListName && requestedName !== activeImportedListName) {
          delete importedCustomLists[activeImportedListName];
          activeImportedListName = requestedName;
        } else if (!activeImportedListName) {
          activeImportedListName = requestedName;
        }

        customDraftList.name = requestedName;
        customDraftList.pokemon = sortedPokemon;
        customDraftList.settings = settings;
      } else {
        activeImportedListName = requestedName;
        customDraftList = {
          name: requestedName,
          pokemon: sortedPokemon,
          excludedPokemon: getPokemonNamesForDex("all", "full").filter((pokemon) => !sortedPokemon.includes(pokemon)),
          settings
        };
      }

      includeAlternateFormsElement.checked = settings.includeAlternateForms;
      includeAbilityFormsElement.checked = settings.includeAbilityForms;
      includeItemFormsElement.checked = settings.includeItemForms;

      persistActiveCustomList();
      updateCustomListSetupStatus();
      updatePokemonList();
      updateListViewerPresetControlsLock();

      customListEditBackup = null;
      customListEditMode = false;
      updateCustomListEditorControls();
      renderListViewer();
    }

    function discardCustomListChanges() {
      if (customListEditBackup) {
        customListSelectedPokemon = new Set(customListEditBackup.pokemon);

        listIncludeAlternateFormsElement.checked = customListEditBackup.settings.includeAlternateForms;
        listIncludeAbilityFormsElement.checked = customListEditBackup.settings.includeAbilityForms;
        listIncludeItemFormsElement.checked = customListEditBackup.settings.includeItemForms;

        includeAlternateFormsElement.checked = customListEditBackup.settings.includeAlternateForms;
        includeAbilityFormsElement.checked = customListEditBackup.settings.includeAbilityForms;
        includeItemFormsElement.checked = customListEditBackup.settings.includeItemForms;
      }

      customListEditBackup = null;
      customListEditMode = false;
      updateCustomListEditorControls();
      updatePokemonList();
      renderListViewer();
    }

    function togglePokemonInCustomList(button, pokemon) {
      if (customListSelectedPokemon.has(pokemon)) {
        customListSelectedPokemon.delete(pokemon);
      } else {
        customListSelectedPokemon.add(pokemon);
      }

      updateCustomListCardState(button, pokemon);
      updateCustomListEditorControls();
      updateListViewerInstruction();
    }

    function updateCustomListCardState(button, pokemon) {
      const selected = customListSelectedPokemon.has(pokemon);
      button.classList.toggle("custom-list-card-selected", selected);
      button.classList.toggle("custom-list-card-disabled", !selected);

      let marker = button.querySelector(".custom-list-card-marker");
      if (!marker) {
        marker = document.createElement("div");
        marker.className = "custom-list-card-marker";
        button.appendChild(marker);
      }
      marker.textContent = selected ? "Included" : "Excluded";
    }

    function selectAllShownCustomListPokemon() {
      getFilteredListViewerPokemon().forEach((pokemon) => customListSelectedPokemon.add(pokemon));
      updateCustomListEditorControls();
      renderListViewer();
    }

    function deselectAllShownCustomListPokemon() {
      getFilteredListViewerPokemon().forEach((pokemon) => customListSelectedPokemon.delete(pokemon));
      updateCustomListEditorControls();
      renderListViewer();
    }

    function buildCustomListSaveData(name = "Custom Draft List") {
      const pokemon = sortPokemonNamesByDexOrder([...customListSelectedPokemon]);

      const allPokemon = getPokemonNamesForDex("all", "full");
      return {
        version: 1,
        kind: "pokemon-draft-custom-list",
        name,
        createdAt: new Date().toISOString(),
        settings: {
          includeAlternateForms: listIncludeAlternateFormsElement.checked,
          includeAbilityForms: listIncludeAbilityFormsElement.checked,
          includeItemForms: listIncludeItemFormsElement.checked
        },
        pokemon,
        excludedPokemon: allPokemon.filter((p) => !pokemon.includes(p))
      };
    }

    function createHumanReadableCustomListExport(saveData) {
      const lines = [];
      lines.push("Pokémon Draft Custom List");
      lines.push("=========================");
      lines.push("");
      lines.push(`Name: ${saveData.name}`);
      lines.push(`Created: ${new Date(saveData.createdAt).toLocaleString()}`);
      lines.push(`Pokémon Count: ${saveData.pokemon.length}`);
      lines.push(`Mechanically Different Forms: ${saveData.settings?.includeAlternateForms ? "On" : "Off"}`);
      lines.push(`Ability-Based Forms: ${saveData.settings?.includeAbilityForms ? "On" : "Off"}`);
      lines.push(`Item-Based Forms: ${saveData.settings?.includeItemForms ? "On" : "Off"}`);
      lines.push("");
      lines.push("Pokémon");
      lines.push("-------");
      saveData.pokemon.forEach((pokemon, index) => {
        const dexLabel = getPokemonDexLabel(getPokemonDataByName(pokemon));
        lines.push(`${String(index + 1).padStart(3, " ")}. ${dexLabel ? dexLabel + " " : ""}${getPokemonDisplayName(pokemon)}`);
      });
      lines.push("");
      lines.push("Import Data");
      lines.push("-----------");
      lines.push("Leave everything below this line unchanged if you want to import this list back into the site.");
      lines.push("===POKEMON_DRAFT_CUSTOM_LIST===");
      lines.push(JSON.stringify(saveData, null, 2));
      lines.push("===END_POKEMON_DRAFT_CUSTOM_LIST===");
      return lines.join("\n");
    }

    function exportCustomList() {
      if (!customListEditMode && !customDraftList) return;

      const defaultName = customDraftList?.name || activeImportedListName || "Custom Draft List";
      const listName = (prompt("Name this custom draft list:", defaultName) || defaultName).trim() || "Custom Draft List";
      const saveData = customListEditMode
        ? buildCustomListSaveData(listName)
        : serializeCustomList({ ...customDraftList, name: listName });

      if (!saveData?.pokemon?.length) {
        alert("Select at least one Pokémon before exporting a custom list.");
        return;
      }

      const safeDate = new Date().toISOString().slice(0, 10);
      const safeName = saveData.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "custom-draft-list";
      downloadTextFile(`pokemon-custom-list-${safeName}-${safeDate}.txt`, createHumanReadableCustomListExport(saveData));
    }

    function extractCustomListSaveData(text) {
      const match = text.match(/===POKEMON_DRAFT_CUSTOM_LIST===\s*([\s\S]*?)\s*===END_POKEMON_DRAFT_CUSTOM_LIST===/);
      const jsonText = match ? match[1] : text;
      return JSON.parse(jsonText);
    }

    function applyImportedCustomList(saveData) {
      if (!saveData || saveData.kind !== "pokemon-draft-custom-list" || !Array.isArray(saveData.pokemon)) {
        throw new Error("This file does not look like a Pokémon Draft Picker custom list.");
      }

      const uniqueName = makeUniqueImportedListName(saveData.name || "Custom Draft List");
      const storedList = {
        ...saveData,
        name: uniqueName,
        pokemon: sortPokemonNamesByDexOrder(saveData.pokemon || [])
      };

      importedCustomLists[uniqueName] = storedList;
      saveImportedListsToStorage();
      renderImportedListDropdown();
      applyCustomListObject(storedList, uniqueName);
    }

    function importCustomListFile(file) {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const saveData = extractCustomListSaveData(String(reader.result || ""));
          applyImportedCustomList(saveData);
        } catch (error) {
          alert(`Could not import custom list: ${error.message}`);
        } finally {
          importCustomListInput.value = "";
        }
      };
      reader.readAsText(file);
    }

    function clearCustomList() {
      if (customListEditMode && customDraftList) {
        const confirmed = confirm("Clear the current custom list and discard all unsaved changes?");
        if (!confirmed) return;
      }

      customDraftList = null;
      customListEditMode = false;
      customListSelectedPokemon = new Set();
      customListEditBackup = null;
      updatePokemonList();
      updateListViewerPresetControlsLock();
      updateCustomListEditorControls();
      updateCustomListSetupStatus();
      if (listViewerAreaElement.style.display === "block") {
        renderListViewer();
      }
    }

    function getPokemonDataByName(name) {
      return PokemonDraftData.pokemon.find((pokemon) => pokemon.name === name);
    }

    function getPokemonSpriteSource(name) {
      return getPokemonDataByName(name)?.spriteSource || "showdown";
    }

    function isRadicalRedSelected() {
      return selectedPokemonGame === "radicalRed";
    }

    function formatNatDexId(id) {
      return `#${String(id).padStart(4, "0")}`;
    }

    function getPokemonDexLabel(pokemonData) {
      if (pokemonData?.customDexId) return pokemonData.customDexId;
      if (pokemonData?.natDexId) return formatNatDexId(pokemonData.natDexId);
      return "";
    }

    function sortPokemonNamesByDexOrder(pokemonNames) {
      return [...new Set(pokemonNames)]
        .filter((name) => getPokemonDataByName(name))
        .sort((a, b) => {
          const dataA = getPokemonDataByName(a);
          const dataB = getPokemonDataByName(b);
          const idA = dataA?.natDexId ?? 999999;
          const idB = dataB?.natDexId ?? 999999;
          const formA = dataA?.formOrder ?? 0;
          const formB = dataB?.formOrder ?? 0;

          if (idA !== idB) return idA - idB;
          if (formA !== formB) return formA - formB;
          return a.localeCompare(b);
        });
    }

    function getPokemonDisplayName(name) {
      if (!includeAlternateFormsElement.checked) {
        if (name === "Oricorio-Baile") return "Oricorio";
        if (name === "Squawkabilly") return "Squawkabilly";
        if (name === "Tatsugiri") return "Tatsugiri";
        if (name === "Tatsugiri-Mega" || name === "Tatsugiri-Curly-Mega") return "Tatsugiri-Mega";
        if (name === "Wormadam") return "Wormadam";
      }

      if (name === "Squawkabilly") return "Squawkabilly-Green/Blue";
      if (name === "Urshifu-Single-Strike") return "Urshifu-Single Strike";
      if (name === "Ogerpon") return "Ogerpon-Teal";
      if (name === "Tatsugiri") return "Tatsugiri-Curly";
      if (name === "Tatsugiri-Mega" || name === "Tatsugiri-Curly-Mega") return "Tatsugiri-Curly-Mega";
      if (name === "Wormadam") return "Wormadam-Plant";
      if (name === "Lycanroc") return "Lycanroc-Midday";

      return name;
    }
