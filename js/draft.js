/* Classic/reverse draft flow and common draft rendering logic. */

// ===== CLASSIC DRAFT MODE =====

    function displayChoices() {
      choicesElement.innerHTML = "";

      if (availablePokemon.length === 0 || allPlayersFull()) {
        currentPlayerElement.textContent = "Draft complete";
        statusElement.textContent = "";
        updatePlayerLists();
        return;
      }

      while (!actorCanDraft(currentPlayerIndex)) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      }

      reverseCurrentTargetIndex = getReverseTargetIndex(currentPlayerIndex, reverseFullRandomElement.checked);
      currentPlayerElement.textContent = getDraftTurnText(currentPlayerIndex, reverseCurrentTargetIndex);

      const classicChoices = getRandomChoices(classicChoiceCount);
      updateChoiceGridColumns(classicChoices.length);

      classicChoices.forEach((pokemon) => {
        const shiny = rollShiny();

        const button = createPokemonChoiceButton(pokemon, shiny, () => pickPokemon(pokemon, shiny));
        choicesElement.appendChild(button);
      });

      statusElement.textContent = `${availablePokemon.length} Pokémon remaining.`;
      updatePlayerLists();
    }

    function createPokemonChoiceButton(pokemon, shiny, onClick, unavailable = false, pickedBy = "") {
      const button = document.createElement("button");
      button.className = "pokemon-button" + (shiny ? " shiny-choice" : "") + (unavailable ? " unavailable" : "");

      const sprite = createPokemonSprite(pokemon, "choice-sprite", shiny);
      const name = document.createElement("span");
      name.textContent = getPokemonDisplayName(pokemon);

      setupCyclingSprite(sprite, pokemon, () => button.classList.contains("shiny-choice"));
      button.appendChild(sprite);
      button.appendChild(name);

      if (shiny) {
        const badge = document.createElement("div");
        badge.className = "shiny-badge";
        badge.textContent = "✨ SHINY!";
        button.appendChild(badge);
      }

      if (pickedBy) {
        const pickedByLabel = document.createElement("div");
        pickedByLabel.className = "picked-by-label";
        pickedByLabel.textContent = `${pickedBy}`;
        button.appendChild(pickedByLabel);
      }

      if (unavailable) {
        button.disabled = true;
      } else {
        button.addEventListener("click", onClick);
      }

      return button;
    }

    function pickPokemon(pokemon, shiny = false) {
      const index = availablePokemon.indexOf(pokemon);
      const targetIndex = isReverseMode() ? reverseCurrentTargetIndex : currentPlayerIndex;

      if (index === -1 || targetIndex === -1 || !playerCanPick(targetIndex)) return;

      availablePokemon.splice(index, 1);
      players[targetIndex].picks.push({
        name: pokemon,
        shiny: shiny
      });

      if (!allPlayersFull() && players.length > 1) {
        do {
          if (snakeDirection === 1) {
            if (currentPlayerIndex === players.length - 1) {
              snakeDirection = -1;
            } else {
              currentPlayerIndex++;
            }
          } else {
            if (currentPlayerIndex === 0) {
              snakeDirection = 1;
            } else {
              currentPlayerIndex--;
            }
          }
        } while (!actorCanDraft(currentPlayerIndex) && !allPlayersFull());
      }

      displayChoices();
    }

    function buildRoundOrder() {
      const playerCount = players.length;
      const startIndex = (playerCount - ((roundNumber - 1) % playerCount)) % playerCount;
      return players
        .map((_, offset) => (startIndex + offset) % playerCount)
        .filter(index => actorCanDraft(index));
    }
