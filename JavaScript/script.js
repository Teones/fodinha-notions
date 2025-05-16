// FODINHA - Jogo de cartas

// Elementos principais
const mainMenu = document.querySelector(".main-menu");
const gameScreen = document.querySelector(".game-screen");
let initialButtons = null;
let playerForm = null;
let playerCountInput = null;
let playersContainer = null;

// Constantes do jogo
const MAX_LIVES = 5;

// Variável global para armazenar o estado do jogo, incluindo os botões de pós-vitória
let currentGameState = null;

function menuInitial() {
  mainMenu.style.display = "block";
  gameScreen.style.display = "none";
  currentGameState = null; // Reseta o estado do jogo ao voltar para o menu
  mainMenu.innerHTML = `
    <h1>FODINHA</h1>
    <div class="initial-buttons">
      <button class="menu-btn new-game-btn">Novo Jogo</button>
      <button class="menu-btn continue-btn" disabled>Continuar (Em breve)</button>
      <button class="menu-btn ranking-btn" disabled>Ranking (Em breve)</button>
    </div>
    <form id="player-form" class="menu-form" style="display:none;">
      <div class="form-group">
        <label for="player-count">Quantidade de Jogadores (3-10):</label>
        <input type="number" id="player-count" min="3" max="10" value="" required>
      </div>
      <div id="players-container" class="players-container"></div>
      <div class="instructions">
        <p>🔹 Digite os nomes na <strong>ordem da mesa</strong> (sentido horário).</p>
        <p>🔹 O sistema vai sortear quem começa o primeiro turno.</p>
      </div>
      <button type="submit" class="menu-btn start-btn">Sortear Jogador Inicial!</button>
    </form>
  `;

  initialButtons = mainMenu.querySelector(".initial-buttons");
  playerForm = mainMenu.querySelector("#player-form");
  playerCountInput = mainMenu.querySelector("#player-count");
  playersContainer = mainMenu.querySelector("#players-container");

  addMenuEventListeners();
  if (playerCountInput.value) {
    updatePlayerNameInputs(parseInt(playerCountInput.value));
  }
}

function updatePlayerNameInputs(numPlayers) {
  playersContainer.innerHTML = "";
  if (numPlayers >= 3 && numPlayers <= 10) {
    for (let i = 0; i < numPlayers; i++) {
      const inputGroup = document.createElement("div");
      inputGroup.className = "form-group";
      const label = document.createElement("label");
      label.htmlFor = `player-name-${i}`;
      label.textContent = `Jogador ${i + 1}:`;
      const input = document.createElement("input");
      input.type = "text";
      input.id = `player-name-${i}`;
      input.required = true;
      input.placeholder = `Nome do Jogador ${i + 1}`;
      input.classList.add("player-name-input");
      // input.value = `Jogador ${i + 1}`; // Para teste rápido
      inputGroup.appendChild(label);
      inputGroup.appendChild(input);
      playersContainer.appendChild(inputGroup);
    }
  }
}

function addMenuEventListeners() {
  if (!initialButtons || !playerForm || !playerCountInput) return;
  const newGameBtn = initialButtons.querySelector(".new-game-btn");
  if (newGameBtn) {
    newGameBtn.addEventListener("click", () => {
      initialButtons.style.display = "none";
      playerForm.style.display = "flex";
      playerCountInput.focus();
      updatePlayerNameInputs(parseInt(playerCountInput.value));
    });
  }
  playerCountInput.addEventListener("input", () =>
    updatePlayerNameInputs(parseInt(playerCountInput.value))
  );
  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInputs = playersContainer.querySelectorAll(".player-name-input");
    const players = Array.from(nameInputs)
      .map((input) => input.value.trim())
      .filter((name) => name !== "");
    if (
      players.length < parseInt(playerCountInput.value) ||
      players.length < 3
    ) {
      alert(
        "Todos os jogadores devem ter nomes e deve haver pelo menos 3 jogadores válidos."
      );
      return;
    }
    const uniqueNames = new Set(players.map((name) => name.toLowerCase()));
    if (uniqueNames.size !== players.length) {
      alert("Os nomes dos jogadores devem ser únicos!");
      return;
    }
    playerForm.style.display = "none";
    prizeDraw(players);
  });
}

function resetGame() {
  gameScreen.style.display = "none";
  gameScreen.innerHTML = "";
  menuInitial();
}

function startGame(players, firstPlayerIndex) {
  const orderedPlayers = [
    ...players.slice(firstPlayerIndex),
    ...players.slice(0, firstPlayerIndex),
  ];
  mainMenu.style.display = "none";
  const sortitionScreenEl = mainMenu.querySelector(".sortition-screen");
  if (sortitionScreenEl) sortitionScreenEl.remove();

  gameScreen.style.display = "flex";
  gameScreen.innerHTML = `
    <div class="screen">
      <h1 class="game-title">FODINHA</h1>
      <div id="game-area"></div>
      <div id="post-round-options" class="post-round-options" style="display:none; flex-direction: column; gap: 0.8rem; margin-top: 1rem; width: 100%; max-width:350px;">
        <!-- Botões "Continuar Jogo" e "Declarar Vencedor" virão aqui -->
      </div>
      <button class="menu-btn next-round-btn" style="width: 100%; max-width:300px;">Próxima Rodada</button>
      <button class="menu-btn finish-btn" style="background-color: #7f8c8d; width: 100%; max-width:300px;">Encerrar Jogo (Menu)</button>
    </div>
  `;

  const finishBtn = gameScreen.querySelector(".finish-btn");
  finishBtn.addEventListener("click", resetGame);

  currentGameState = {
    players: orderedPlayers.map((name) => ({
      name,
      lives: MAX_LIVES,
      livesLostThisRound: 0,
      isAlive: true,
      trophies: 0,
    })),
    currentTurn: 1,
    currentRoundInTurn: 1,
    turnDealerIndex: 0,
    roundStarterIndex: 0,
  };

  initFodinhaGameInterface();
}

function initFodinhaGameInterface() {
  const nextRoundBtn = gameScreen.querySelector(".next-round-btn");
  const postRoundOptionsDiv = gameScreen.querySelector("#post-round-options");

  if (nextRoundBtn) {
    nextRoundBtn.style.display = "block";
    // Remover listener antigo para evitar múltiplos, caso initFodinhaGameInterface seja chamado mais de uma vez
    const newNextRoundBtn = nextRoundBtn.cloneNode(true); // Clona para remover listeners
    nextRoundBtn.parentNode.replaceChild(newNextRoundBtn, nextRoundBtn);
    newNextRoundBtn.addEventListener("click", nextRound);
  }
  if (postRoundOptionsDiv) {
    postRoundOptionsDiv.style.display = "none";
    postRoundOptionsDiv.innerHTML = ""; // Limpa opções antigas
  }

  renderGame();
}

function getCardsAndRoundsForTurn(turn) {
  if (turn === 1) return 1;
  if (turn >= 2 && turn <= 5) return turn;
  if (turn >= 6 && turn <= 9) return 10 - turn;
  const cycleTurn = turn - 10;
  const cycleSequence = [2, 3, 4, 5, 4, 3, 2, 1];
  return cycleSequence[cycleTurn % cycleSequence.length];
}

function renderGame() {
  if (!currentGameState) return;

  const gameArea = gameScreen.querySelector("#game-area");
  if (!gameArea) return;

  const numCardsOrRounds = getCardsAndRoundsForTurn(
    currentGameState.currentTurn
  );

  gameArea.innerHTML = `
    <div class="game-header">
      <div class="turn-info">
        Turno ${currentGameState.currentTurn} / Rodada ${
    currentGameState.currentRoundInTurn
  } de ${numCardsOrRounds}
      </div>
      <div class="cards-info">
        ${numCardsOrRounds} carta${numCardsOrRounds > 1 ? "s" : ""} por jogador
      </div>
    </div>
    <div class="players-grid"></div>
  `;

  const grid = gameArea.querySelector(".players-grid");
  currentGameState.players.forEach((player, playerIdx) => {
    const playerEl = document.createElement("div");
    playerEl.className = `player ${player.isAlive ? "" : "dead"}`;

    let trophyDisplay = "";
    if (player.trophies > 0) {
      if (player.trophies <= 3) {
        trophyDisplay = "🏆".repeat(player.trophies);
      } else {
        trophyDisplay = `<span style="font-size: 0.9em; vertical-align: middle;">${player.trophies}</span>🏆`;
      }
    }

    let markersHTML = "";
    if (player.isAlive) {
      if (playerIdx === currentGameState.turnDealerIndex)
        markersHTML += `<span>👑 Turno</span> `;
      if (playerIdx === currentGameState.roundStarterIndex)
        markersHTML += `<span>➡️ Rodada</span>`;
    } else {
      markersHTML = "<span>💀 Eliminado</span>";
    }

    let livesHTML = "";
    for (let lifeIdx = 0; lifeIdx < MAX_LIVES; lifeIdx++) {
      let iconName = "heart-outline",
        iconClass = "heart-icon heart-perm-lost",
        isClickable = false;
      if (player.isAlive) {
        if (lifeIdx < player.lives) {
          iconName =
            lifeIdx < player.lives - player.livesLostThisRound
              ? "heart"
              : "heart-outline";
          iconClass =
            lifeIdx < player.lives - player.livesLostThisRound
              ? "heart-icon heart-full"
              : "heart-icon heart-temp-lost";
          isClickable = true;
        }
      }
      if (isClickable) iconClass += " clickable";
      livesHTML += `<ion-icon name="${iconName}" class="${iconClass}" data-player-index="${playerIdx}" data-life-index="${lifeIdx}"></ion-icon>`;
    }

    playerEl.innerHTML = `
      <div class="player-header">
        <h3 class="player-name">${trophyDisplay} ${player.name}</h3>
        <div class="player-markers">${markersHTML.trim() || " "}</div>
      </div>
      <div class="player-lives">${livesHTML}</div>
    `;
    grid.appendChild(playerEl);
  });

  grid.querySelectorAll(".heart-icon.clickable").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const pIndex = parseInt(event.currentTarget.dataset.playerIndex);
      const lIndex = parseInt(event.currentTarget.dataset.lifeIndex);
      handleHeartClick(pIndex, lIndex);
    });
  });

  const nextRoundBtn = gameScreen.querySelector(".next-round-btn");
  const postRoundOptionsActive =
    gameScreen.querySelector("#post-round-options").style.display === "flex";

  if (nextRoundBtn && !postRoundOptionsActive) {
    // Só atualiza se o botão de próxima rodada estiver ativo
    nextRoundBtn.style.display = "block"; // Garante que está visível
    const alivePlayersCount = currentGameState.players.filter(
      (p) => p.isAlive
    ).length;
    nextRoundBtn.disabled = false;
    if (
      alivePlayersCount <= 1 &&
      currentGameState.players.some(
        (p) => p.isAlive && p.livesLostThisRound > 0
      )
    ) {
      nextRoundBtn.textContent = "Confirmar Perdas e Ver Vencedor da Etapa";
    } else if (currentGameState.currentRoundInTurn >= numCardsOrRounds) {
      nextRoundBtn.textContent = `Iniciar Próximo Turno (Turno ${
        currentGameState.currentTurn + 1
      })`;
    } else {
      nextRoundBtn.textContent = `Próxima Rodada (${
        currentGameState.currentRoundInTurn + 1
      } de ${numCardsOrRounds})`;
    }
  } else if (nextRoundBtn && postRoundOptionsActive) {
    nextRoundBtn.style.display = "none"; // Esconde se as opções pós-rodada estão ativas
  }
}

function handleHeartClick(playerIndex, lifeIndexClicked) {
  if (!currentGameState) return;
  const player = currentGameState.players[playerIndex];
  if (!player || !player.isAlive) return;

  if (lifeIndexClicked < player.lives - player.livesLostThisRound) {
    player.livesLostThisRound++;
  } else if (lifeIndexClicked < player.lives) {
    if (player.livesLostThisRound > 0) player.livesLostThisRound--;
  }
  renderGame();
}

function nextRound() {
  if (!currentGameState) return;
  currentGameState.players.forEach((player) => {
    if (player.isAlive) {
      if (player.livesLostThisRound > 0)
        player.lives -= player.livesLostThisRound;
      player.livesLostThisRound = 0;
      if (player.lives <= 0) {
        player.lives = 0;
        player.isAlive = false;
      }
    }
  });

  const etapaOver = checkEtapaOver();
  if (!etapaOver) {
    const totalRoundsInTurn = getCardsAndRoundsForTurn(
      currentGameState.currentTurn
    );
    currentGameState.currentRoundInTurn++;
    if (currentGameState.currentRoundInTurn > totalRoundsInTurn) {
      currentGameState.currentTurn++;
      currentGameState.currentRoundInTurn = 1;
      currentGameState.turnDealerIndex = getNextAlivePlayerIndex(
        currentGameState.turnDealerIndex
      );
      currentGameState.roundStarterIndex = currentGameState.turnDealerIndex;
    } else {
      currentGameState.roundStarterIndex = getNextAlivePlayerIndex(
        currentGameState.roundStarterIndex
      );
    }
    renderGame();
  }
}

function getNextAlivePlayerIndex(currentIndex) {
  if (!currentGameState) return currentIndex;
  const alivePlayerIndexes = currentGameState.players
    .map((p, i) => ({ p, i }))
    .filter((item) => item.p.isAlive)
    .map((item) => item.i);
  if (alivePlayerIndexes.length === 0) return currentIndex;
  if (alivePlayerIndexes.length === 1) return alivePlayerIndexes[0];
  let currentPositionInAlive = alivePlayerIndexes.indexOf(currentIndex);
  if (currentPositionInAlive === -1) {
    // Se o índice atual é de um jogador morto ou inválido
    // Tenta encontrar o próximo jogador vivo depois do índice morto.
    // Se não encontrar, pega o primeiro da lista de vivos.
    let nextAliveIdx = alivePlayerIndexes.find((idx) => idx > currentIndex);
    return nextAliveIdx !== undefined ? nextAliveIdx : alivePlayerIndexes[0];
  }
  const nextPositionInAlive =
    (currentPositionInAlive + 1) % alivePlayerIndexes.length;
  return alivePlayerIndexes[nextPositionInAlive];
}

function checkEtapaOver() {
  if (!currentGameState) return false;
  const alivePlayers = currentGameState.players.filter((p) => p.isAlive);
  const nextRoundBtn = gameScreen.querySelector(".next-round-btn");
  const postRoundOptionsDiv = gameScreen.querySelector("#post-round-options");

  let etapaConcluida = false;
  let mensagemEtapa = "";

  if (alivePlayers.length === 1) {
    const winnerOfEtapa = alivePlayers[0];
    winnerOfEtapa.trophies++;
    etapaConcluida = true;
    mensagemEtapa = `🎉 <strong>${winnerOfEtapa.name}</strong> venceu esta etapa e ganhou 1 troféu! 🎉`;
  } else if (alivePlayers.length === 0) {
    etapaConcluida = true;
    mensagemEtapa = `😱 Todos foram eliminados nesta etapa! Ninguém ganhou troféu.`;
  }

  if (etapaConcluida) {
    renderGame(); // Renderiza para mostrar o troféu ganho ou estado final da etapa
    if (nextRoundBtn) nextRoundBtn.style.display = "none";

    postRoundOptionsDiv.style.display = "flex";
    postRoundOptionsDiv.innerHTML = `
        <p style="text-align: center; font-size: 1.2em; margin-bottom: 0.5em;">
            ${mensagemEtapa}
        </p>
        <button id="continue-full-game" class="menu-btn new-game-btn">Continuar Jogo (Nova Etapa)</button>
        <button id="declare-final-winner" class="menu-btn start-btn">Declarar Vencedor Final</button>
    `;

    document
      .getElementById("continue-full-game")
      .addEventListener("click", continueFullGame);
    document
      .getElementById("declare-final-winner")
      .addEventListener("click", declareFinalWinner);

    return true;
  }
  return false;
}

function continueFullGame() {
  if (!currentGameState) return;

  let dealerForNewEtapa = currentGameState.turnDealerIndex; // Mantém o dealer atual por padrão
  const alivePlayersFromLastEtapa = currentGameState.players.filter(
    (p) => p.isAlive
  );

  // Se houve um vencedor claro na etapa anterior, ele se torna o dealer
  if (alivePlayersFromLastEtapa.length === 1) {
    dealerForNewEtapa = currentGameState.players.indexOf(
      alivePlayersFromLastEtapa[0]
    );
  } else {
    // Se todos foram eliminados, o próximo jogador vivo (após o reset, todos estarão vivos)
    // em relação ao dealer anterior se torna o novo dealer.
    // A lógica de getNextAlivePlayerIndex com todos vivos vai funcionar para pegar o próximo na ordem.
    // Como todos estarão vivos, precisamos simular isso antes de chamar getNextAlivePlayerIndex
    // ou simplesmente incrementar o índice e aplicar módulo.
    dealerForNewEtapa =
      (currentGameState.turnDealerIndex + 1) % currentGameState.players.length;
  }

  currentGameState.players.forEach((player) => {
    player.lives = MAX_LIVES;
    player.livesLostThisRound = 0;
    player.isAlive = true;
  });
  currentGameState.currentTurn = 1;
  currentGameState.currentRoundInTurn = 1;
  currentGameState.turnDealerIndex = dealerForNewEtapa;
  currentGameState.roundStarterIndex = dealerForNewEtapa;

  initFodinhaGameInterface();
}

function declareFinalWinner() {
  if (!currentGameState) return;
  let maxTrophies = 0; // Começa em 0, pois é possível ninguém ter troféus
  currentGameState.players.forEach((player) => {
    if (player.trophies > maxTrophies) {
      maxTrophies = player.trophies;
    }
  });

  let finalWinners = [];
  if (maxTrophies > 0) {
    finalWinners = currentGameState.players.filter(
      (player) => player.trophies === maxTrophies
    );
  }

  let message;
  if (finalWinners.length > 1) {
    message = `🏆 Empate! Os Grandes Campeões com ${maxTrophies} troféus são: ${finalWinners
      .map((p) => p.name)
      .join(" e ")}! 🏆`;
  } else if (finalWinners.length === 1) {
    message = `👑 ${finalWinners[0].name} é o Grande Campeão com ${finalWinners[0].trophies} troféus! 👑`;
  } else {
    message = "🏁 Jogo encerrado. Ninguém acumulou troféus! 🏁";
  }

  const postRoundOptionsDiv = gameScreen.querySelector("#post-round-options");
  if (postRoundOptionsDiv) {
    postRoundOptionsDiv.style.display = "flex"; // Garante que está visível
    postRoundOptionsDiv.innerHTML = `<p style="text-align:center; font-size: 1.3em; padding:1em; background-color: #1e1e1e; border-radius: 5px; color: #f1c40f;">${message}</p>`;
  }

  const nextRoundBtn = gameScreen.querySelector(".next-round-btn");
  if (nextRoundBtn) nextRoundBtn.style.display = "none";
}

function prizeDraw(players) {
  mainMenu.style.display = "block"; // Garante que o mainMenu está visível para o sorteio
  const sortitionScreen = document.createElement("div");
  sortitionScreen.className = "sortition-screen";
  // Limpa o mainMenu antes de adicionar a tela de sorteio, caso haja algo do formulário
  mainMenu.innerHTML = ""; // Limpa qualquer conteúdo anterior do mainMenu
  mainMenu.appendChild(sortitionScreen);

  sortitionScreen.innerHTML = `
      <h1 style="color: #e74c3c; margin-bottom: 1rem;">FODINHA</h1>
      <h2>Sorteando quem começa o 1º Turno...</h2>
      <div class="players-list" style="margin: 1rem 0;"></div>
      <button class="menu-btn sort-btn" style="background-color: #9b59b6; color:white;">Sortear!</button>
  `;

  const playersListEl = sortitionScreen.querySelector(".players-list");
  players.forEach((player, index) => {
    const playerElement = document.createElement("div");
    playerElement.className = "player-to-sort";
    playerElement.textContent = player;
    playerElement.dataset.index = index;
    playersListEl.appendChild(playerElement);
  });

  const sortBtn = sortitionScreen.querySelector(".sort-btn");
  sortBtn.addEventListener("click", function () {
    this.disabled = true;
    let highlightCounter = 0;
    const baseShuffleTime = 110;
    const numPlayers = players.length;
    const finalPlayerIndex = Math.floor(Math.random() * numPlayers);
    let sortInterval;

    function highlightPlayer(idx) {
      playersListEl
        .querySelectorAll(".player-to-sort")
        .forEach((el) => el.classList.remove("highlight-player"));
      const playerToHighlight = playersListEl.querySelector(
        `.player-to-sort[data-index="${idx}"]`
      );
      if (playerToHighlight) {
        playerToHighlight.classList.add("highlight-player");
        // Scroll to player if list is long
        // playerToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    const totalHighlights = numPlayers * 2 + finalPlayerIndex + 1;

    sortInterval = setInterval(() => {
      highlightPlayer(highlightCounter % numPlayers);
      highlightCounter++;

      if (highlightCounter >= totalHighlights) {
        clearInterval(sortInterval);
        highlightPlayer(finalPlayerIndex);

        setTimeout(() => {
          startGame(players, finalPlayerIndex);
        }, 1800);
      }
    }, baseShuffleTime);
  });
}

// Iniciar
menuInitial();
