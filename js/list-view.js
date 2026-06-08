/* List-view rendering, filters, and custom-list editing controls. */

// ===== DRAFT INITIALIZATION =====

    function syncListControlsFromSetup() {
      listGameSelectElement.value = pokemonGameSelectElement.value;
      listDexSelectElement.value = pokemonDexSelectElement.value;

      const setupTags = getSelectedTagFilters();
      listTagFilterElements.forEach((checkbox) => {
        checkbox.checked = setupTags[checkbox.value] !== false;
      });

      listIncludeAlternateFormsElement.checked = includeAlternateFormsElement.checked;
      listIncludeAbilityFormsElement.checked = includeAbilityFormsElement.checked;
      listIncludeItemFormsElement.checked = includeItemFormsElement.checked;
    }

    function syncSetupControlsFromList() {
      if (customDraftList) {
        includeAlternateFormsElement.checked = listIncludeAlternateFormsElement.checked;
        includeAbilityFormsElement.checked = listIncludeAbilityFormsElement.checked;
        includeItemFormsElement.checked = listIncludeItemFormsElement.checked;
        customDraftList.settings = {
          includeAlternateForms: listIncludeAlternateFormsElement.checked,
          includeAbilityForms: listIncludeAbilityFormsElement.checked,
          includeItemForms: listIncludeItemFormsElement.checked
        };
        updateListViewerPresetControlsLock();
        updatePokemonList();
        return;
      }

      pokemonGameSelectElement.value = listGameSelectElement.value;
      pokemonDexSelectElement.value = listDexSelectElement.value;

      const listTags = {};
      listTagFilterElements.forEach((checkbox) => {
        listTags[checkbox.value] = checkbox.checked;
      });

      tagFilterElements.forEach((checkbox) => {
        checkbox.checked = listTags[checkbox.value] !== false;
      });

      includeAlternateFormsElement.checked = listIncludeAlternateFormsElement.checked;
      includeAbilityFormsElement.checked = listIncludeAbilityFormsElement.checked;
      includeItemFormsElement.checked = listIncludeItemFormsElement.checked;

      updatePokemonList();
    }

    function getListExtraFilters() {
      return {
        type: listTypeFilterElement.value,
        type2: listTypeFilter2Element.value,
        evolutionStage: listEvolutionStageFilterElement.value,
        canEvolve: listCanEvolveFilterElement.value,
        megaPrimal: listMegaPrimalFilterElement.value
      };
    }

    function pokemonHasTypeData(pokemonData) {
      return Array.isArray(pokemonData?.types) && pokemonData.types.length > 0;
    }

    function getPokemonTypeSetsForFiltering(pokemonName) {
      const pokemonData = getPokemonDataByName(pokemonName);
      const baseTypes = pokemonData?.types || [];
      const spriteEntries = getPokemonSpriteFilenames(pokemonName);

      const typeSets = [];

      if (baseTypes.length) {
        typeSets.push(baseTypes);
      }

      spriteEntries.forEach((spriteEntry) => {
        const spriteTypes = getSpriteEntryTypes(spriteEntry, pokemonName);
        if (spriteTypes.length) {
          typeSets.push(spriteTypes);
        }
      });

      const uniqueKeys = new Set();
      return typeSets.filter((types) => {
        const key = [...types].sort().join("/");
        if (uniqueKeys.has(key)) return false;
        uniqueKeys.add(key);
        return true;
      });
    }

    function typeSetMatchesFilter(types, selectedType, selectedType2 = "") {
      if (!selectedType && !selectedType2) return true;

      if (selectedType && selectedType2 && selectedType === selectedType2) {
        return types.length === 1 && types[0] === selectedType;
      }

      if (selectedType && !types.includes(selectedType)) return false;
      if (selectedType2 && !types.includes(selectedType2)) return false;

      return true;
    }

    function pokemonMatchesTypeFilter(pokemonName, selectedType, selectedType2 = "") {
      if (!selectedType && !selectedType2) return true;

      const typeSets = getPokemonTypeSetsForFiltering(pokemonName);
      if (!typeSets.length) return false;

      return typeSets.some((types) => typeSetMatchesFilter(types, selectedType, selectedType2));
    }

    function isMegaOrPrimalPokemon(name) {
      return name.includes("-Mega") || name.includes("-Primal");
    }

    function pokemonMatchesListExtraFilters(name) {
      const pokemonData = getPokemonDataByName(name);
      const gameInfo = selectedPokemonGame === "all"
        ? Object.values(pokemonData?.games || {})[0]
        : pokemonData?.games?.[selectedPokemonGame];
      const isFullyEvolved = Object.values(pokemonData?.games || {}).some((entry) => entry?.fullyEvolved === true);
      const canStillEvolve = Object.values(pokemonData?.games || {}).some((entry) => entry?.fullyEvolved === false);
      const filters = getListExtraFilters();

      if (!pokemonMatchesTypeFilter(name, filters.type, filters.type2)) {
        return false;
      }

      if (filters.evolutionStage && String(pokemonData?.evolutionStage || "") !== filters.evolutionStage) {
        return false;
      }

      if (filters.canEvolve === "yes" && !canStillEvolve) return false;
      if (filters.canEvolve === "no" && !isFullyEvolved) return false;

      const isMegaPrimal = isMegaOrPrimalPokemon(name);
      if (filters.megaPrimal === "yes" && !isMegaPrimal) return false;
      if (filters.megaPrimal === "no" && isMegaPrimal) return false;

      return true;
    }

    function updateTypeFilterNote() {
      const selectedType = listTypeFilterElement.value;
      const selectedType2 = listTypeFilter2Element.value;
      if (!selectedType && !selectedType2) {
        listTypeFilterNoteElement.textContent = "";
        return;
      }

      const hasAnyTypeData = PokemonDraftData.pokemon.some(pokemonHasTypeData);
      listTypeFilterNoteElement.textContent = hasAnyTypeData
        ? ""
        : "Type filtering is ready, but this data file does not currently include Pokémon type data.";
    }

    function showListViewer() {
      syncListControlsFromSetup();

      if (customDraftList) {
        customListEditMode = true;
        customListSelectedPokemon = new Set(customDraftList.pokemon);
        customListEditBackup = {
          pokemon: new Set(customListSelectedPokemon),
          settings: {
            includeAlternateForms: listIncludeAlternateFormsElement.checked,
            includeAbilityForms: listIncludeAbilityFormsElement.checked,
            includeItemForms: listIncludeItemFormsElement.checked
          }
        };
      } else {
        syncSetupControlsFromList();
      }

      updateListViewerPresetControlsLock();
      renderImportedListDropdown();

      setupElement.style.display = "none";
      draftAreaElement.style.display = "none";
      listViewerAreaElement.style.display = "block";

      listSearchInputElement.value = "";
      updateCustomListEditorControls();
      renderListViewer();
    }

    function getActiveFilterText() {
      const categoryLabels = {
        legendary: "Legendaries",
        mythical: "Mythicals",
        subLegendary: "Sub-legendaries",
        pseudoLegendary: "Pseudo-legendaries",
        paradoxUltraBeast: "Paradox / Ultra Beast"
      };

      const activeCategories = tagFilterElements
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => categoryLabels[checkbox.value] || checkbox.value);

      const categoriesText = activeCategories.length
        ? activeCategories.join(", ")
        : "Standard Pokémon only";

      const formTexts = [
        includeAlternateFormsElement.checked
          ? "Mechanically different forms: on"
          : "Mechanically different forms: off",
        includeAbilityFormsElement.checked
          ? "Ability-based forms: on"
          : "Ability-based forms: off",
        includeItemFormsElement.checked
          ? "Item-based forms: on"
          : "Item-based forms: off"
      ];

      return `<strong>Active Filters:</strong><br>${categoriesText}<br>${formTexts.join("<br>")}`;
    }

    function getTypeClassName(type) {
      return `type-${String(type).toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    }

    function createTypeBadgeRow(pokemonData) {
      const types = pokemonData?.types || [];
      if (!types.length) return null;

      const row = document.createElement("div");
      row.className = "type-badge-row";
      updateTypeBadgeRow(row, types);

      return row;
    }

    function updateListViewerInstruction() {
      const instruction = document.getElementById("listViewerInstruction");
      if (!instruction) return;

      if (customListEditMode) {
        instruction.textContent = `${customListSelectedPokemon.size} Pokémon selected for custom list. Click cards to enable or disable them.`;
      } else {
        instruction.textContent = "Click a Pokémon to toggle it shiny.";
      }
    }

    function renderListViewer() {
      updateListViewerInstruction();
      pokemonListViewerElement.innerHTML = "";

      const pokemonList = getCurrentListViewerPokemonList();
      const filteredPokemonList = getFilteredListViewerPokemon();

      updateTypeFilterNote();
      const searchTerm = listSearchInputElement.value.trim().toLowerCase();
      listViewerStatusElement.textContent = (searchTerm || Object.values(getListExtraFilters()).some(Boolean))
        ? `${filteredPokemonList.length} of ${pokemonList.length} Pokémon shown.`
        : `${pokemonList.length} Pokémon shown.`;

      filteredPokemonList.forEach((pokemon) => {
        const button = createPokemonChoiceButton(
          pokemon,
          false,
          () => {
            if (customListEditMode) {
              togglePokemonInCustomList(button, pokemon);
            } else {
              toggleListViewerShiny(button, pokemon);
            }
          }
        );

        const pokemonData = getPokemonDataByName(pokemon);
        const dexLabelText = getPokemonDexLabel(pokemonData);
        if (dexLabelText) {
          const natDexLabel = document.createElement("div");
          natDexLabel.className = "natdex-label";
          natDexLabel.textContent = dexLabelText;
          button.insertBefore(natDexLabel, button.firstChild);
        }

        const typeBadgeRow = createTypeBadgeRow(pokemonData);
        if (typeBadgeRow) {
          button.appendChild(typeBadgeRow);
        }

        button.classList.add("list-viewer-card");
        if (customListEditMode) {
          updateCustomListCardState(button, pokemon);
        }
        pokemonListViewerElement.appendChild(button);
      });
    }

    function toggleListViewerShiny(button, pokemon) {
      const isShiny = !button.classList.contains("shiny-choice");
      button.classList.toggle("shiny-choice", isShiny);

      const sprite = button.querySelector("img");
      if (sprite) {
        sprite.src = getPokemonSpriteUrl(pokemon, isShiny);
        sprite.alt = isShiny ? "Shiny Pokémon sprite" : "Pokémon sprite";
      }

      const badge = button.querySelector(".shiny-badge");
      if (badge) {
        badge.remove();
      }
    }

    function startDraft() {
      updatePokemonList();
      if (!validateSetup()) return;

      pokemonPerPlayer = getEffectivePokemonPerPlayer();
      classicChoiceCount = getClassicChoiceCount();
      marketBonusCount = getMarketBonusCount();
      marketPokemonPerPlayerInPool = getMarketPokemonPerPlayerInPool();
      const nameInputs = [...document.querySelectorAll(".player-name-input")];
      players = nameInputs.map((input, index) => ({
        name: (input.value.trim() || `Player ${index + 1}`).slice(0, 16),
        picks: []
      }));

      currentPlayerIndex = 0;
      draftMode = draftModeElement.value;
      availablePokemon = [...originalPokemon];
      currentRoundChoices = [];
      currentRoundOrder = [];
      currentRoundPickIndex = 0;
      roundNumber = 1;
      snakeDirection = 1;
      reverseCurrentTargetIndex = -1;
      createReverseTargetMap();

      setupElement.style.display = "none";
      draftAreaElement.style.display = "block";

      updatePlayerLists();

      if (isMarketMode()) {
        startNewRound();
      } else {
        displayChoices();
      }
    }
