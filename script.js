let cards = {
    1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuECK9a_JcKORVRPel0lA2MvASnYjzJCA3rw&s",
    2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaj9OMI0QreFGusBAwgYD-Yw8FBm4MYYPmBP-JrDeuzA&s",
    3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2Wjn1AFf2VIqQGA8DDxhmLh32tTB67qe64jrzObCzow&s",
    4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Q9d7RejtxTiiLxYXtCi8nPyuPTFZyJ8Zudl395_ajQ&s",
    5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS_aQHSyvTcnEBsG-YCPM6H-wHXOUcbWMFIcUPrxYYFg&s"
};

let nplayers = 2;
let playersEl = document.getElementById("Nplayers");
const nome = document.getElementById("nome");
let linhaEl = document.querySelector(".linha");
let buttonRodada = document.querySelector(".rodada");

playersEl.addEventListener("input", () => {
    nome.innerHTML = "";
    nplayers = Number(playersEl.value);
    for(let i = 1; i <= nplayers; i++) {
        nome.innerHTML += `
            <input id="names" type='text' placeholder="Nome ${i}:">
        `;
    }
});

let escolhasContainer = document.querySelector(".escolhas");
let gameTable = document.querySelector(".container");
let deck = [];

let statusPlayers = [];

function embaralhar() {
    for(let k = deck.length - 1; k > 0; k--) {
        let j = Math.floor(Math.random() * (k + 1));

        [deck[k], deck[j]] = [deck[j], deck[k]];
    }
}

function startGame() {
    deck = [];
    const nomeInputs = document.querySelectorAll("#names");

    for(let card in cards) {
        for(let i = 1; i <= 5; i++) {
            deck.push(card);
        }
    }

    let htmlGerado = "";
    for(let i = 0; i < nplayers; i++) {
        embaralhar();
        let carta1 = deck.pop();
        embaralhar();
        let carta2 = deck.pop();

        let nick = nomeInputs[i].value !== ""? nomeInputs[i].value : `Player ${i + 1}`;

        statusPlayers.push({
            nome: nick,
            moedas: 2,
            cartas: [carta1, carta2],
            vivo: true
        });

        htmlGerado += `
            <div class='card'>
                <h3 class='nick'>${nick}</h3>
                <div class='imgCard'>
                    <img src='${cards[carta1]}'>
                    <img src='${cards[carta2]}'>
                </div>
                <h3>R$ 2</h3>
            </div>
        `;
    }
    
    escolhasContainer.classList.add("escondido");
    linhaEl.classList.add("escondido");
    gameTable.classList.remove("escondido");
    buttonRodada.classList.remove("escondido");
    gameTable.innerHTML = htmlGerado;
    const playerIni = document.querySelectorAll(".card .nick")[0].textContent;
    buttonRodada.innerHTML = `Vez de ${playerIni}`;
}

let nplayerAtual = 0;
let action = document.querySelector(".action");


function renderGame() {

    let htmlGerado = "";
    gameTable.innerHTML = "";

    statusPlayers.forEach((player, index) => {
        let imgs = "";
        player.cartas.forEach(carta => {
            imgs += `<img src='${cards[carta]}'></img>`;
        }) 
        htmlGerado += `
        <div class='${index === nplayerAtual? "card" : "outros"}' ${index !== nplayerAtual ? `onclick="clicouPlayer(${index})"` : ""}
        data-player="${index}">

            <h3 class='nick'>${player.nome}</h3>

            <div class='imgCard'>
                ${imgs}
            </div>

            <h3>R$ ${player.moedas}</h3>

        </div>
        `
    });

    gameTable.innerHTML = htmlGerado;

    for(let i = 0; i < nplayers; i++) {
        if(!statusPlayers[i].vivo) {
            document.querySelector(`[data-player="${i}"]`).classList.add("morto");
            document.querySelector(`[data-player="${i}"]`).querySelectorAll("h3")[1].innerHTML = "Morto"
        }
    }
}

let alvo = null;
function clicouPlayer(index) {
    console.log(index);
    document.querySelectorAll(".outros").forEach(card => {
        card.classList.remove("marcado");
    });

    alvo = index;

    document.querySelector(`[data-player="${index}"]`).classList.add("marcado");
}

//Controlar ações de personagens
let escolherCartas = document.querySelector(".chooseCard");
const painelAcoesEl = document.querySelector(".painel-acoes");

function acao(action) {
    switch(action) {
        case "renda":
            renda();
            break;
        
        case "ajuda_externa":
            ajudaExterna();
            break;

        case "taxar":
            duque();
            break;

        case "golpe":
            golpeDeEstado();
            break;

        case "roubar":
            capitao();
            break;

        case "trocar":
            sapeca();
            break;

        default:
            break;
    }
}

function passarRodada() {
    while(true) {
        nplayerAtual = (nplayerAtual + 1) % nplayers;
        if(statusPlayers[nplayerAtual].vivo === true) break;
    }
    
    action.classList.add("escondido");
    buttonRodada.innerHTML = `Vez de ${statusPlayers[nplayerAtual].nome}`;
    renderGame()
}

function overCoins() {
    if(statusPlayers[nplayerAtual].moedas >= 10) {
        alert("Você está com muitas moedas")
        return true;
    }
    return false;
}

function renda() {
    statusPlayers[nplayerAtual].moedas++;
    passarRodada();
}

function ajudaExterna() {
    statusPlayers[nplayerAtual].moedas += 2;
    passarRodada();
}



function colocarCartasNaTela() {
    let htmlGerado = "";
    let i = 0;
    statusPlayers[alvo].cartas.forEach(carta => {
        htmlGerado += `
            <img class="grande" src='${cards[carta]}' onclick="matar(${i})">
        `;
        i++;
    });
    escolherCartas.innerHTML = htmlGerado;
}

let escolha = [];
function sapeca() {
    let cartaAtual = statusPlayers[nplayerAtual];
    let htmlGerado = "";
    escolherCartas.innerHTML = "";
    let i = 1;

    cartaAtual.cartas.forEach(carta => {
        htmlGerado += `
            <img class="sapecaCards" src='${cards[carta]}' onclick="trocarCartas(${i})">
        `;
        i++;
    });

    for(let i = 1; i < 2; i++) {
        htmlGerado += `
            <img class="sapecaCards" src='${cards[deck[i-1]]}' onclick="trocarCartas(${i+2})">
        `;
    }

    htmlGerado += `
        <button onclick="trocarCartas()">Trocar</button>
    `

    let cartas = document.querySelectorAll(".sapecaCards");
    escolherCartas.innerHTML = htmlGerado;
    let selecionados = [];

    cartas.forEach(carta => {
        carta.addEventListener("click", () => {
            if(carta.classList.contains("choose")) {
                carta.classList.remove("choose");

                selecionados = selecionados.filter(c => c !== carta);

                return;
            }

            if(selecionados.length >= 2) {
                return;
            }

            carta.classList.add("choose");
            console.log(`${carta} adicionada`);
            selecionados.push(carta);
        })
    })

    
}

function trocarCartas(troca = [], tam) {
    if(troca.length !== tam) {
        alert("Número de cartas errado");
        return;
    }

    statusPlayers[nplayerAtual].cartas.forEach(carta => {
        deck.push(carta);
    });
    embaralhar();

    statusPlayers[nplayerAtual].cartas = troca;
    
}


function capitao() {
    if(alvo === null) {
        alert("Escolha um pessoa para roubar");
        return;
    }
    if(statusPlayers[alvo].moedas <= 0) {
        alert("Sem moedas para roubar");
        return;
    }

    let qtdCoins = statusPlayers[alvo].moedas >= 2? 2 : 1;
    statusPlayers[alvo].moedas -= qtdCoins;
    statusPlayers[nplayerAtual].moedas += qtdCoins;

    alvo = null;
    renderGame();
    passarRodada();
}

function duque() {
    if(overCoins()) return;
    statusPlayers[nplayerAtual].moedas += 3;
    passarRodada();

    console.log(statusPlayers[nplayerAtual].moedas);
}

function matar(indiceCarta) {
    statusPlayers[alvo].cartas.splice(indiceCarta, 1);

    if(statusPlayers[alvo].cartas.length <= 0) {
        statusPlayers[alvo].vivo = false;
    }

    escolherCartas.innerHTML = "";

    alvo = null;

    passarRodada();
}

function golpeDeEstado() {
    if(statusPlayers[nplayerAtual].moedas < 7) {
        alert("Moedas insuficientes, faça outra ação");
        return;
    }

    if(alvo === null) {
        alert("Escolha um alvo");
        return;
    }

    statusPlayers[nplayerAtual].moedas -= 7;
    renderGame();
    colocarCartasNaTela();
}

function rodada() {
    const playerAtual = document.querySelectorAll(".card")[nplayerAtual];
    action.classList.remove("escondido");

    renderGame(statusPlayers[nplayerAtual]);
    console.log(playerAtual);
}

let configs = document.getElementById("config");
function toggleConfig() {
    configs.classList.toggle("escondido");
}