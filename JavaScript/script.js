players()

function players() {
    let numPlayers = prompt("Quantos jogadores serão? (OBS: Digite um valor entre 2 e 10");
    let playersName = [];
    
    for (let i = 0; i < numPlayers; i++) {
        playersName.push(prompt(`Digite o nome do ${i + 1}º jogador`))
    }

    createTable(playersName);
}

function createTable(playersName) {
    let game = document.querySelector(".game");
    game.innerHTML = "";

    for (let i = 0; i < playersName.length; i++) {
        game.innerHTML += `
        <div class="player">
            <div class="player-title">
            <span class="player-name">${playersName[i]}</span>
            <div class="player-wins" data-wins="0">
                <!-- Troféus serão adicionados aqui -->
            </div>
            </div>
            <div class="lifes">
                <div class="life" onclick="toogleLife(this)"> 
                    <ion-icon name="heart"></ion-icon>
                    <ion-icon name="heart-empty" class="hide"></ion-icon>
                </div>
                <div class="life" onclick="toogleLife(this)"> 
                    <ion-icon name="heart"></ion-icon>
                    <ion-icon name="heart-empty" class="hide"></ion-icon>
                </div>
                <div class="life" onclick="toogleLife(this)"> 
                    <ion-icon name="heart"></ion-icon>
                    <ion-icon name="heart-empty" class="hide"></ion-icon>
                </div>
                <div class="life" onclick="toogleLife(this)"> 
                    <ion-icon name="heart"></ion-icon>
                    <ion-icon name="heart-empty" class="hide"></ion-icon>
                </div>
                <div class="life" onclick="toogleLife(this)"> 
                    <ion-icon name="heart"></ion-icon>
                    <ion-icon name="heart-empty" class="hide"></ion-icon>
                </div>
            </div>
        </div>
        `;
    }
}


function toogleLife(life) {
    let heartFull = life.children[0];
    let heartEmpty = life.children[1];
    
    if (heartFull.classList.contains("hide")) {
        heartFull.classList.remove("hide");
        heartEmpty.classList.add("hide");
    } else {
        heartFull.classList.add("hide");
        heartEmpty.classList.remove("hide");
    }

    // Verifica se todas as vidas foram perdidas
    checkPlayerLives(life.parentElement);

    // Verifica se há um vencedor
    checkWinner();
}

function checkPlayerLives(playerLifes) {
    const player = playerLifes.parentElement;
    const hearts = playerLifes.querySelectorAll('.life');
    let allLost = true;

    // Verifica se todas as vidas estão escondidas
    hearts.forEach(heart => {
        if (!heart.children[0].classList.contains('hide')) {
            allLost = false;
        }
    });

    // Aplica ou remove a classe 'player-lost' dependendo das vidas
    if (allLost) {
        player.classList.add('player-lost');
    } else {
        player.classList.remove('player-lost');
    }
}

function checkWinner() {
    const players = document.querySelectorAll('.player');
    let playersWithLives = [];

    // Encontra jogadores que ainda têm vidas
    players.forEach(player => {
        const hearts = player.querySelectorAll('.life ion-icon[name="heart"]');
        const activeHearts = Array.from(hearts).filter(heart => !heart.classList.contains('hide'));

        if (activeHearts.length > 0) {
            playersWithLives.push(player);
        }
    });

    // Se restar apenas um jogador, declarar como vencedor
    if (playersWithLives.length === 1) {
        const winner = playersWithLives[0];
        winner.classList.add('player-winner');

        // Atualiza os troféus de vitória
        updateWins(winner);

        document.querySelector('.restart-btn').style.display = 'block';

    }
}

function updateWins(winner) {
    const winsContainer = winner.querySelector('.player-wins');
    let wins = parseInt(winsContainer.getAttribute('data-wins')) + 1;
    winsContainer.setAttribute('data-wins', wins);

    // Atualiza a exibição dos troféus
    if (wins <= 3) {
        winsContainer.innerHTML = '🏆'.repeat(wins); // Exibe os ícones de troféu
    } else {
        winsContainer.innerHTML = `${wins}x 🏆`; // Exibe a contagem escrita quando passa de 5
    }
}

function resetGame() {
    const players = document.querySelectorAll('.player');
    
    // Recoloca todas as vidas dos jogadores
    players.forEach(player => {
        player.classList.remove('player-lost', 'player-winner');
        const hearts = player.querySelectorAll('.life ion-icon');
        const winsContainer = player.querySelector('.player-wins');

        hearts.forEach((heart, index) => {
            if (index % 2 === 0) { // Ícones de corações cheios (mesmo índice)
                heart.classList.remove('hide');
            } else { // Ícones de corações vazios (índices ímpares)
                heart.classList.add('hide');
            }
        });

        // Mantém os troféus (não reiniciamos as vitórias)
        winsContainer.innerHTML = winsContainer.getAttribute('data-wins') <= 3 
            ? '🏆'.repeat(winsContainer.getAttribute('data-wins'))
            : `${winsContainer.getAttribute('data-wins')}x 🏆`;
    });

    // Esconde o botão de reiniciar
    document.querySelector('.restart-btn').style.display = 'none';
}

