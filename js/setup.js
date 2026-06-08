/* Setup-screen validation, player setup, draft settings, and navigation into drafts/list view. */

// ===== DEX SELECTION =====

    function updatePokemonList() {
      selectedPokemonGame = pokemonGameSelectElement.value;
      selectedPokemonDex = pokemonDexSelectElement.value;

      originalPokemon = customDraftList ? [...customDraftList.pokemon] : getSelectedPokemonList();

      updateCustomListSetupStatus();
      validateSetup();
    }

    function resizeNumberInput(input) {
      const length = Math.max(1, input.value.length);
      input.style.width = `${Math.min(Math.max(length + 4, 8), 12)}ch`;
    }

    function resizeAllNumberInputs() {
      document.querySelectorAll(".number-input").forEach(resizeNumberInput);
    }

    function getPlayerCount() {
      return Math.max(1, Math.min(20, Number(playerCountElement.value) || 1));
    }

    function getPokemonPerPlayer() {
      return Math.max(1, Math.min(100, Number(pokemonPerPlayerElement.value) || 1));
    }

    function getEffectivePokemonPerPlayer() {
      const playerCount = getPlayerCount();

      if (draftAllPossibleElement.checked) {
        return Math.floor(originalPokemon.length / playerCount);
      }

      return getPokemonPerPlayer();
    }

    function getClassicChoiceCount() {
      return Math.max(1, Math.min(10, Number(classicChoiceCountElement.value) || 1));
    }

    function getMarketBonusCount() {
      return Math.max(0, Math.min(10, Number(marketBonusCountElement.value) || 0));
    }

    function getMarketPokemonPerPlayerInPool() {
      return Math.max(1, Math.min(5, Number(marketPokemonPerPlayerInPoolElement.value) || 1));
    }

    function getMarketPoolSize() {
      return (getPlayerCount() * getMarketPokemonPerPlayerInPool()) + getMarketBonusCount();
    }

    function updateMarketPoolStatus() {
      const poolSize = getMarketPoolSize();
      const playerCount = getPlayerCount();
      const perPlayer = getMarketPokemonPerPlayerInPool();
      const bonus = getMarketBonusCount();
      marketPoolStatusElement.textContent = `Market pool size: ${poolSize} Pokémon (${playerCount} players × ${perPlayer}, plus ${bonus} bonus).`;
    }

    function isMarketMode() {
      return draftMode === "rounds" || draftMode === "reverseRounds";
    }

    function isReverseMode(mode = draftMode) {
      return mode === "reverseClassic" || mode === "reverseRounds";
    }

    function getModeFamily(mode = draftModeElement.value) {
      return mode === "classic" || mode === "reverseClassic" ? "classic" : "rounds";
    }

    function shuffleIndexes(count) {
      return [...Array(count).keys()].sort(() => Math.random() - 0.5);
    }

    function createReverseTargetMap() {
      const playerCount = players.length;
      reverseTargetMap = [];

      if (playerCount < 2) return;

      let targets = shuffleIndexes(playerCount);
      let attempts = 0;

      while (targets.some((target, index) => target === index) && attempts < 100) {
        targets = shuffleIndexes(playerCount);
        attempts++;
      }

      if (targets.some((target, index) => target === index)) {
        targets = targets.map((_, index) => (index + 1) % playerCount);
      }

      reverseTargetMap = targets;
    }

    function getRandomReverseTargetIndex(actorIndex) {
      const possibleTargets = players
        .map((_, index) => index)
        .filter((index) => index !== actorIndex && playerCanPick(index));

      if (possibleTargets.length === 0) return -1;

      return possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
    }

    function getReverseTargetIndex(actorIndex, reroll = false) {
      if (!isReverseMode()) return actorIndex;

      if (reverseFullRandomElement.checked || reroll) {
        return getRandomReverseTargetIndex(actorIndex);
      }

      const assignedTarget = reverseTargetMap[actorIndex];

      if (assignedTarget === undefined || !playerCanPick(assignedTarget)) {
        return -1;
      }

      return assignedTarget;
    }

    function actorCanDraft(actorIndex) {
      if (!isReverseMode()) {
        return playerCanPick(actorIndex);
      }

      return getReverseTargetIndex(actorIndex) !== -1;
    }

    function getDraftTurnText(actorIndex, targetIndex, prefix = "") {
      const actor = players[actorIndex];
      const target = players[targetIndex];

      if (!isReverseMode()) {
        return `${prefix}${actor.name}'s pick`;
      }

      return `${prefix}${actor.name}'s pick for ${target.name}`;
    }

    function updateModeSettings() {
      const selectedMode = draftModeElement.value;
      const modeFamily = getModeFamily(selectedMode);

      classicSettingsElement.style.display = modeFamily === "classic" ? "block" : "none";
      marketSettingsElement.style.display = modeFamily === "rounds" ? "block" : "none";
      reverseSettingsElement.style.display = isReverseMode(selectedMode) ? "block" : "none";

      updateMarketPoolStatus();
      validateSetup();
    }

    function getTotalRequiredPokemon() {
      return getPlayerCount() * getEffectivePokemonPerPlayer();
    }

    function validateSetup() {
      const playerCount = getPlayerCount();
      const picksEach = getEffectivePokemonPerPlayer();
      const requiredPokemon = playerCount * picksEach;
      const classicChoices = getClassicChoiceCount();
      const marketBonus = getMarketBonusCount();
      const marketPoolPerPlayer = getMarketPokemonPerPlayerInPool();

      playerCountElement.value = playerCount;
      if (!draftAllPossibleElement.checked) {
        pokemonPerPlayerElement.value = picksEach;
      }
      classicChoiceCountElement.value = classicChoices;
      marketBonusCountElement.value = marketBonus;
      marketPokemonPerPlayerInPoolElement.value = marketPoolPerPlayer;
      updateMarketPoolStatus();

      if (isReverseMode(draftModeElement.value) && playerCount < 2) {
        setupStatusElement.textContent = "Reverse draft modes need at least 2 players.";
        setupStatusElement.className = "error";
        startDraftButton.disabled = true;
        return false;
      }

      if (draftAllPossibleElement.checked && picksEach < 1) {
        setupStatusElement.textContent = `Not enough Pokémon for each player to draft equally. You need at least ${playerCount}, but only ${originalPokemon.length} are available.`;
        setupStatusElement.className = "error";
        startDraftButton.disabled = true;
        return false;
      }

      if (requiredPokemon > originalPokemon.length) {
        setupStatusElement.textContent = `Not enough Pokémon. ${playerCount} players × ${picksEach} picks = ${requiredPokemon}, but only ${originalPokemon.length} are available.`;
        setupStatusElement.className = "error";
        startDraftButton.disabled = true;
        return false;
      }

      setupStatusElement.textContent = `${requiredPokemon} Pokémon will be drafted total. ${originalPokemon.length - requiredPokemon} will remain unused.`;
      setupStatusElement.className = "";
      startDraftButton.disabled = false;
      return true;
    }

    function allPlayersFull() {
      return players.length > 0 && players.every(player => player.picks.length >= pokemonPerPlayer);
    }

    function playerCanPick(index) {
      return players[index].picks.length < pokemonPerPlayer;
    }

    function createPlayerInputs() {
      const existingNames = [...document.querySelectorAll(".player-name-input")].map(input => input.value);
      const playerCount = getPlayerCount();
      playerCountElement.value = playerCount;
      playerNameInputsElement.innerHTML = "";

      for (let i = 0; i < playerCount; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Player ${i + 1} name`;
        input.maxLength = 16;
        input.value = (existingNames[i] || `Player ${i + 1}`).slice(0, 16);
        input.className = "player-name-input";
        playerNameInputsElement.appendChild(input);
      }

      validateSetup();
    }

    function returnToSetup() {
      draftAreaElement.style.display = "none";
      listViewerAreaElement.style.display = "none";
      setupElement.style.display = "block";
    }
