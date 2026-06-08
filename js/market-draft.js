/* Market and reverse-market draft flow. */

// ===== MARKET DRAFT MODE =====

    function startNewRound() {
      if (availablePokemon.length === 0 || allPlayersFull()) {
        choicesElement.innerHTML = "";
        currentPlayerElement.textContent = "Draft complete";
        statusElement.textContent = "";
        updatePlayerLists();
        return;
      }

      currentRoundOrder = buildRoundOrder();
      currentRoundPickIndex = 0;

      const roundChoiceCount = Math.min((currentRoundOrder.length * marketPokemonPerPlayerInPool) + marketBonusCount, availablePokemon.length);
      currentRoundChoices = getRandomChoices(roundChoiceCount).map((pokemon) => ({
        name: pokemon,
        shiny: rollShiny(),
        picked: false,
        pickedBy: ""
      }));

      displayRoundChoices();
    }

    function displayRoundChoices() {
      choicesElement.innerHTML = "";

      if (availablePokemon.length === 0 || allPlayersFull()) {
        currentPlayerElement.textContent = "Draft complete";
        statusElement.textContent = "";
        updatePlayerLists();
        return;
      }

      if (currentRoundPickIndex >= currentRoundOrder.length || currentRoundChoices.every(choice => choice.picked)) {
        roundNumber++;
        startNewRound();
        return;
      }

      currentPlayerIndex = currentRoundOrder[currentRoundPickIndex];
      reverseCurrentTargetIndex = getReverseTargetIndex(currentPlayerIndex, reverseFullRandomElement.checked);
      currentPlayerElement.textContent = getDraftTurnText(currentPlayerIndex, reverseCurrentTargetIndex, `Round ${roundNumber}: `);

      updateChoiceGridColumns(currentRoundChoices.length);

      currentRoundChoices.forEach((choice) => {
        const button = createPokemonChoiceButton(
          choice.name,
          choice.shiny,
          () => pickRoundPokemon(choice),
          choice.picked,
          choice.pickedBy
        );
        choicesElement.appendChild(button);
      });

      const availableInRound = currentRoundChoices.filter(choice => !choice.picked).length;
      statusElement.textContent = `${availablePokemon.length} Pokémon remaining. ${availableInRound} still available this round.`;
      updatePlayerLists();
    }

    function pickRoundPokemon(choice) {
      const targetIndex = isReverseMode() ? reverseCurrentTargetIndex : currentPlayerIndex;

      if (choice.picked || targetIndex === -1 || !playerCanPick(targetIndex)) return;

      const index = availablePokemon.indexOf(choice.name);
      if (index === -1) return;

      availablePokemon.splice(index, 1);
      choice.picked = true;
      choice.pickedBy = isReverseMode()
        ? `${players[currentPlayerIndex].name} for ${players[targetIndex].name}`
        : players[currentPlayerIndex].name;

      players[targetIndex].picks.push({
        name: choice.name,
        shiny: choice.shiny
      });

      currentRoundPickIndex++;

      if (currentRoundPickIndex >= currentRoundOrder.length) {
        roundNumber++;
        startNewRound();
      } else {
        displayRoundChoices();
      }
    }

    
    // ===== PLAYER DISPLAY =====
