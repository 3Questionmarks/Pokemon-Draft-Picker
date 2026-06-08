/* Draft save/load and export/import helpers. */

// ===== IMPORT / EXPORT =====

    function getDraftModeLabel(mode = draftMode) {
      const option = [...draftModeElement.options].find((item) => item.value === mode);
      return option ? option.textContent : mode;
    }

    function getDexLabel() {
      return pokemonDexSelectElement.options[pokemonDexSelectElement.selectedIndex]?.textContent || selectedPokemonDex;
    }

    function getGameLabel() {
      return PokemonDraftData.games[selectedPokemonGame] || selectedPokemonGame;
    }

    function getDraftSaveData() {
      return {
        version: 1,
        exportedAt: new Date().toISOString(),
        settings: {
          selectedPokemonGame,
          selectedPokemonDex,
          draftMode,
          pokemonPerPlayer,
          classicChoiceCount,
          marketBonusCount,
          marketPokemonPerPlayerInPool,
          draftAllPossible: draftAllPossibleElement.checked,
          includeAlternateForms: includeAlternateFormsElement.checked,
          includeAbilityForms: includeAbilityFormsElement.checked,
          includeItemForms: includeItemFormsElement.checked,
          tagFilters: getSelectedTagFilters(),
          reverseFullRandom: reverseFullRandomElement.checked
        },
        state: {
          players,
          availablePokemon,
          currentPlayerIndex,
          currentRoundChoices,
          currentRoundOrder,
          currentRoundPickIndex,
          roundNumber,
          snakeDirection,
          reverseTargetMap,
          reverseCurrentTargetIndex,
          completed: allPlayersFull() || availablePokemon.length === 0
        }
      };
    }

    function formatPickForExport(pick, index) {
      const shinyText = pick.shiny ? " (Shiny)" : "";
      return `  ${index + 1}. ${getPokemonDisplayName(pick.name)}${shinyText}`;
    }

    function createHumanReadableDraftExport(saveData) {
      const lines = [];
      const totalDrafted = saveData.state.players.reduce((total, player) => total + player.picks.length, 0);

      lines.push("Pokémon Draft Export");
      lines.push("====================");
      lines.push("");
      lines.push(`Exported: ${new Date(saveData.exportedAt).toLocaleString()}`);
      lines.push(`Game: ${getGameLabel()}`);
      lines.push(`Dex: ${getDexLabel()}`);
      lines.push(`Draft Mode: ${getDraftModeLabel()}`);
      lines.push(`Pokémon per Player: ${saveData.settings.pokemonPerPlayer}`);
      lines.push(`Total Drafted: ${totalDrafted}`);
      lines.push(`Remaining Pokémon: ${saveData.state.availablePokemon.length}`);
      lines.push("");
      lines.push("Teams");
      lines.push("-----");

      saveData.state.players.forEach((player) => {
        lines.push("");
        lines.push(`${player.name} (${player.picks.length})`);
        lines.push("-".repeat(`${player.name} (${player.picks.length})`.length));

        if (player.picks.length === 0) {
          lines.push("  No Pokémon drafted.");
        } else {
          player.picks.forEach((pick, index) => {
            lines.push(formatPickForExport(pick, index));
          });
        }
      });

      lines.push("");
      lines.push("Import Data");
      lines.push("-----------");
      lines.push("Leave everything below this line unchanged if you want to import this draft back into the site.");
      lines.push("===POKEMON_DRAFT_SAVE_DATA===");
      lines.push(JSON.stringify(saveData, null, 2));
      lines.push("===END_POKEMON_DRAFT_SAVE_DATA===");

      return lines.join("\n");
    }

    function downloadTextFile(filename, contents) {
      const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    function exportDraft() {
      if (!players.length) {
        alert("Start or import a draft before exporting.");
        return;
      }

      const saveData = getDraftSaveData();
      const safeGame = selectedPokemonGame.replace(/[^a-z0-9]/gi, "-").toLowerCase();
      const safeDate = new Date().toISOString().slice(0, 10);
      const filename = `pokemon-draft-${safeGame}-${safeDate}.txt`;

      downloadTextFile(filename, createHumanReadableDraftExport(saveData));
    }

    function extractDraftSaveData(text) {
      const match = text.match(/===POKEMON_DRAFT_SAVE_DATA===\s*([\s\S]*?)\s*===END_POKEMON_DRAFT_SAVE_DATA===/);
      const jsonText = match ? match[1] : text;
      return JSON.parse(jsonText);
    }

    function applyImportedDraft(saveData) {
      if (!saveData || !saveData.settings || !saveData.state || !Array.isArray(saveData.state.players)) {
        throw new Error("This file does not look like a Pokémon Draft Picker export.");
      }

      selectedPokemonGame = saveData.settings.selectedPokemonGame || "natDex";
      selectedPokemonDex = saveData.settings.selectedPokemonDex || "stage1";
      draftMode = saveData.settings.draftMode || "classic";

      pokemonGameSelectElement.value = selectedPokemonGame;
      pokemonDexSelectElement.value = selectedPokemonDex;
      draftModeElement.value = draftMode;

      includeAlternateFormsElement.checked = saveData.settings.includeAlternateForms !== false;
      includeAbilityFormsElement.checked = !!saveData.settings.includeAbilityForms;
      includeItemFormsElement.checked = !!saveData.settings.includeItemForms;
      draftAllPossibleElement.checked = !!saveData.settings.draftAllPossible;
      reverseFullRandomElement.checked = !!saveData.settings.reverseFullRandom;

      const tagFilters = saveData.settings.tagFilters || {};
      tagFilterElements.forEach((checkbox) => {
        checkbox.checked = tagFilters[checkbox.value] !== false;
      });

      pokemonPerPlayer = Number(saveData.settings.pokemonPerPlayer) || 10;
      classicChoiceCount = Number(saveData.settings.classicChoiceCount) || 3;
      marketBonusCount = Number(saveData.settings.marketBonusCount) || 2;
      marketPokemonPerPlayerInPool = Number(saveData.settings.marketPokemonPerPlayerInPool) || 1;

      pokemonPerPlayerElement.value = pokemonPerPlayer;
      classicChoiceCountElement.value = classicChoiceCount;
      marketBonusCountElement.value = marketBonusCount;
      marketPokemonPerPlayerInPoolElement.value = marketPokemonPerPlayerInPool;

      players = saveData.state.players;
      playerCountElement.value = players.length;
      loadImportedListsFromStorage();
    renderImportedListDropdown();
    if (activeImportedListName && importedCustomLists[activeImportedListName]) {
      applyCustomListObject(importedCustomLists[activeImportedListName], activeImportedListName);
    }
    createPlayerInputs();

      [...document.querySelectorAll(".player-name-input")].forEach((input, index) => {
        input.value = players[index]?.name || `Player ${index + 1}`;
      });

      updatePokemonList();

      availablePokemon = Array.isArray(saveData.state.availablePokemon)
        ? saveData.state.availablePokemon
        : [...originalPokemon];

      currentPlayerIndex = Number(saveData.state.currentPlayerIndex) || 0;
      currentRoundChoices = Array.isArray(saveData.state.currentRoundChoices) ? saveData.state.currentRoundChoices : [];
      currentRoundOrder = Array.isArray(saveData.state.currentRoundOrder) ? saveData.state.currentRoundOrder : [];
      currentRoundPickIndex = Number(saveData.state.currentRoundPickIndex) || 0;
      roundNumber = Number(saveData.state.roundNumber) || 1;
      snakeDirection = Number(saveData.state.snakeDirection) || 1;
      reverseTargetMap = Array.isArray(saveData.state.reverseTargetMap) ? saveData.state.reverseTargetMap : [];
      reverseCurrentTargetIndex = Number(saveData.state.reverseCurrentTargetIndex);
      if (Number.isNaN(reverseCurrentTargetIndex)) reverseCurrentTargetIndex = -1;

      pokemonPerPlayerElement.disabled = draftAllPossibleElement.checked;
      setupElement.style.display = "none";
      listViewerAreaElement.style.display = "none";
      draftAreaElement.style.display = "block";
      updateModeSettings();
      updatePlayerLists();

      if (saveData.state.completed || allPlayersFull() || availablePokemon.length === 0) {
        currentPlayerElement.textContent = "Draft complete";
        choicesElement.innerHTML = "";
        statusElement.textContent = "";
        return;
      }

      if (isMarketMode() && currentRoundChoices.length > 0) {
        displayRoundChoices();
      } else {
        displayChoices();
      }
    }

    function importDraftFile(file) {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const saveData = extractDraftSaveData(String(reader.result || ""));
          applyImportedDraft(saveData);
        } catch (error) {
          alert(`Could not import draft: ${error.message}`);
        } finally {
          importDraftInput.value = "";
        }
      };
      reader.readAsText(file);
    }

    function updatePlayerLists() {
      playerListsElement.innerHTML = "";

      players.forEach((player, index) => {
        const card = document.createElement("div");
        card.className = "player-card" + (index === currentPlayerIndex ? " active" : "");

        const heading = document.createElement("h2");
        heading.textContent = `${player.name} (${player.picks.length})`;

        const list = document.createElement("ol");
        player.picks.forEach((pick) => {
          const item = document.createElement("li");
          item.className = "picked-pokemon";

          const sprite = createPokemonSprite(pick.name, "picked-sprite", pick.shiny);
          const name = document.createElement("span");
          name.textContent = getPokemonDisplayName(pick.name);
          if (pick.shiny) {
            name.className = "shiny-pick";
          }

          item.appendChild(sprite);
          item.appendChild(name);
          list.appendChild(item);
        });

        card.appendChild(heading);
        card.appendChild(list);
        playerListsElement.appendChild(card);
      });
    }

    playerCountElement.addEventListener("input", () => {
      resizeNumberInput(playerCountElement);
      createPlayerInputs();
      validateSetup();
    });
    draftAllPossibleElement.addEventListener("change", () => {
      pokemonPerPlayerElement.disabled = draftAllPossibleElement.checked;
      validateSetup();
    });

    pokemonPerPlayerElement.addEventListener("input", () => {
      resizeNumberInput(pokemonPerPlayerElement);
      validateSetup();
    });
    draftModeElement.addEventListener("change", updateModeSettings);
    reverseFullRandomElement.addEventListener("change", validateSetup);
    classicChoiceCountElement.addEventListener("input", () => {
      resizeNumberInput(classicChoiceCountElement);
      validateSetup();
    });
    marketBonusCountElement.addEventListener("input", () => {
      resizeNumberInput(marketBonusCountElement);
      validateSetup();
    });
    marketPokemonPerPlayerInPoolElement.addEventListener("input", () => {
      resizeNumberInput(marketPokemonPerPlayerInPoolElement);
      validateSetup();
    });
    pokemonGameSelectElement.addEventListener("change", updatePokemonList);
    pokemonDexSelectElement.addEventListener("change", updatePokemonList);
    tagFilterElements.forEach((checkbox) => {
      checkbox.addEventListener("change", updatePokemonList);
    });
    includeAlternateFormsElement.addEventListener("change", updatePokemonList);
    includeAbilityFormsElement.addEventListener("change", updatePokemonList);
    includeItemFormsElement.addEventListener("change", updatePokemonList);
    startDraftButton.addEventListener("click", startDraft);
    viewListButton.addEventListener("click", showListViewer);
    listSearchInputElement.addEventListener("input", renderListViewer);

    [
      listGameSelectElement,
      listDexSelectElement,
      listIncludeAlternateFormsElement,
      listIncludeAbilityFormsElement,
      listIncludeItemFormsElement,
      listTypeFilterElement,
      listTypeFilter2Element,
      listEvolutionStageFilterElement,
      listCanEvolveFilterElement,
      listMegaPrimalFilterElement,
      ...listTagFilterElements
    ].forEach((control) => {
      control.addEventListener("change", () => {
        if (!customDraftList) {
          syncSetupControlsFromList();
        } else {
          updateListViewerPresetControlsLock();
        }
        renderListViewer();
      });
    });
    importCustomListButton.addEventListener("click", () => importCustomListInput.click());
    importCustomListFromListButton.addEventListener("click", () => importCustomListInput.click());
    importCustomListInput.addEventListener("change", () => importCustomListFile(importCustomListInput.files[0]));
    importedListSelectElement.addEventListener("change", () => selectImportedList(importedListSelectElement.value));
    listModeImportedListSelectElement.addEventListener("change", () => selectImportedList(listModeImportedListSelectElement.value));
    deleteImportedListButton.addEventListener("click", deleteSelectedImportedList);
    deleteImportedListFromListButton.addEventListener("click", deleteSelectedImportedList);

    enterCustomListModeButton.addEventListener("click", enterCustomListMode);
    selectAllCustomListButton.addEventListener("click", selectAllShownCustomListPokemon);
    deselectAllCustomListButton.addEventListener("click", deselectAllShownCustomListPokemon);
    exportCustomListButton.addEventListener("click", exportCustomList);
    exitCustomListModeButton.addEventListener("click", exitCustomListMode);
    discardCustomListChangesButton.addEventListener("click", discardCustomListChanges);

    importDraftButton.addEventListener("click", () => importDraftInput.click());
    importDraftInput.addEventListener("change", () => importDraftFile(importDraftInput.files[0]));
    exportDraftButton.addEventListener("click", exportDraft);
    backToSetupButton.addEventListener("click", returnToSetup);
    backFromListButton.addEventListener("click", returnToSetup);
