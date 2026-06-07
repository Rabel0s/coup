let cards = {
    1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuECK9a_JcKORVRPel0lA2MvASnYjzJCA3rw&s",
    2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaj9OMI0QreFGusBAwgYD-Yw8FBm4MYYPmBP-JrDeuzA&s",
    3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2Wjn1AFf2VIqQGA8DDxhmLh32tTB67qe64jrzObCzow&s",
    4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Q9d7RejtxTiiLxYXtCi8nPyuPTFZyJ8Zudl395_ajQ&s",
    5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS_aQHSyvTcnEBsG-YCPM6H-wHXOUcbWMFIcUPrxYYFg&s"
};

const backCard = "ChatGPT Image 6 de jun. de 2026, 21_38_21.png";

let nplayers = 2;
let playersEl = document.getElementById("Nplayers");
const nome = document.getElementById("nome");
let linhaEl = document.querySelector(".linha");
let action = document.querySelector(".painel-acoes");


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
    action.classList.remove("escondido");
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
    }
    
    escolhasContainer.classList.add("escondido");
    linhaEl.classList.add("escondido");
    gameTable.classList.remove("escondido");
    renderGame();
    const playerIni = statusPlayers[0].nome;
}

let nplayerAtual = 0;



function renderGame() {
    let htmlGerado = "";
    gameTable.innerHTML = "";
    showCardButton.classList.remove("escondido");

    statusPlayers.forEach((player, index) => {
        let imgs = "";
        player.cartas.forEach(carta => {
            imgs += `<img src='${backCard}'></img>`;
        }) 
        htmlGerado += `
        <div class='${index === nplayerAtual? "card" : "outros"}' ${index !== nplayerAtual ? `onclick="clicouPlayer(${index})"` : ""}
        data-player="${index}">

            <h3 class='nick'>${player.nome}</h3>

            <div class='imgCard'>
                ${imgs}
            </div>

            <h3><span class="coin">🪙 ${player.moedas}</span></h3>

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


let duvidaAtual = {};
let jogadorDecidindo = 0;


let blurCard = document.querySelector(".overLay");
function mostrarCartas() {
    blurCard.classList.remove("escondido");
    let card = document.querySelector(".card");
    card.classList.add("privateCards");

    let i = 0;
    card.querySelectorAll("img").forEach(carta => {
        carta.src = cards[statusPlayers[nplayerAtual].cartas[i]]
        i++;
    });
}

function esconderCartas() {
    blurCard.classList.add("escondido");
    let card = document.querySelector(".card");
    card.classList.remove("privateCards");
    
    card.querySelectorAll("img").forEach(carta => {
        carta.src = backCard;
    });
}

let showCardButton = document.querySelector(".showCard");
showCardButton.addEventListener("mousedown", mostrarCartas);
showCardButton.addEventListener("mouseup", esconderCartas);
showCardButton.addEventListener("touchstart", mostrarCartas);
showCardButton.addEventListener("touchend", esconderCartas);

let informacoesPainel = document.querySelector(".informacoes");
function mostrarCartasDeTodos() {
    tipoAcao.forEach(acao => {
        acao.classList.add("escondido");
    });

    htmlGerado = `
        <div>
            <h3>${(nplayerAtual + 1) % nplayers === 0? "Finalizar" : `Passe o celular para ${statusPlayers[nplayerAtual + 1].nome}`}</h3>
            <button onclick="proximoAver()">Passar vez</button>
        </div>
    `;
    informacoesPainel.classList.remove("escondido")
    informacoesPainel.innerHTML = htmlGerado;
}

function proximoAver() {
    passarRodada();
    if(nplayerAtual === 0) {
        informacoesPainel.classList.add("escondido");
        tipoAcao.forEach(acao => {
            acao.classList.remove("escondido");
        });
        return;
    }
    mostrarCartasDeTodos();
}


let acaoAtual = {
    tipo: "",
    jogador: null,
    alvo: null,
    bloqueavel: false,
    bloqueadoPor: null,
};

const regrasDeBlock = {
    assassinar: 2,
    ajuda_externa: 3,
    roubar: [4, 5]
}

let painelBloqueio = document.querySelector("bloqueio");
function resolverAcao() {
    if(acaoAtual.bloqueavel) {

    }
    else {

    }
}

function acao(action) {
    switch(action) {
        case "renda":
            renda();
            break;
        
        case "ajuda_externa":
            acaoAtual = {
                tipo: "ajuda_externa",
                jogador: nplayerAtual,
                alvo: null,
                bloqueavel: true,
                bloqueadoPor: 3
            };
            resolverAcao()
            break;

        case "golpe":
            golpeDeEstado();
            break;

        case "taxar":
            abrirDuvida({
                jogador: nplayerAtual,
                jogada: "taxar",
                carta: 3
            });
            break;

        case "roubar":
            abrirDuvida({
                jogador: nplayerAtual,
                jogada: "roubar",
                carta: 4
            });
            break;

        case "trocar":
            abrirDuvida({
                jogador: nplayerAtual,
                jogada: "trocar",
                carta: 5
            });
            break;

        case "assassinar":
            if(alvo === null) {
                alert("Escolha uma pessoa para matar");
                return;
            }   
            abrirDuvida({
                jogador: nplayerAtual,
                jogada: "assassinar",
                carta: 1
            });
            break;

        default:
            break;
    }
}

function executarAcao(action) {
    switch(action) {
        case "taxar":
            duque();
            break;

        case "roubar":
            capitao();
            break;

        case "trocar":
            sapeca();
            break;

        case "assassinar":    
            assasino();
            break;

        default:
            break;
    }
}

function abrirDuvida(info) {
    duvidaAtual = info;
    jogadorDecidindo = (info.jogador + 1) % nplayers;
    areaDuvida.classList.remove("escondido");
    proximoDecisor();
}

let areaDuvida = document.querySelector(".fundoDuvida");
function proximoDecisor() {
    if(jogadorDecidindo === nplayerAtual) return;
    
    const duvidaText = document.querySelector(".duvidaText");

    duvidaText.innerHTML = `
        <strong class="nameStrong">${statusPlayers[duvidaAtual.jogador].nome}</strong> usou <strong class="actionStrong">${duvidaAtual.jogada}</strong>
        <br>
        <strong class="nameStrong">${statusPlayers[jogadorDecidindo].nome}</strong>, deseja dúvidar?
    `;
    console.log(duvidaText.innerHTML);
    console.log(duvidaText.textContent);
}

function passarDuvida() {
    jogadorDecidindo = (jogadorDecidindo + 1) % nplayers;

    if(jogadorDecidindo === duvidaAtual.jogador) {
        areaDuvida.classList.add("escondido");
        executarAcao(duvidaAtual.jogada);
    }
    else {
        proximoDecisor();
    }
}

function duvidar() {
    if(statusPlayers[duvidaAtual.jogador].cartas.indexOf(String(duvidaAtual.carta)) !== -1) {
        alvo = jogadorDecidindo;
        areaDuvida.classList.add("escondido");
        colocarCartasNaTela();
    }
    else {
        alvo = nplayerAtual;
        areaDuvida.classList.add("escondido");
        colocarCartasNaTela();
    }
}

function passarRodada() {
    alvo = null;
    while(true) {
        nplayerAtual = (nplayerAtual + 1) % nplayers;
        if(statusPlayers[nplayerAtual].vivo === true) break;
    }
    
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
    if(overCoins()) return;
    statusPlayers[nplayerAtual].moedas++;
    passarRodada();
}

function ajudaExterna() {
    if(overCoins()) return;
    statusPlayers[nplayerAtual].moedas += 2;
    passarRodada();
}


function colocarCartasNaTela() {
    toggleViewCard();
    let htmlGerado = "";
    let i = 0;
    showCardButton.classList.add("escondido");
    statusPlayers[alvo].cartas.forEach(carta => {
        htmlGerado += `
            <img class="grande" src='${backCard}' onclick="matar(${i})">
        `;
        i++;
    });
    escolherCartas.innerHTML = htmlGerado;
}

let selecionados = [];
let tipoAcao = document.querySelectorAll(".tipoAcao");

function toggleViewCard() {
    tipoAcao.forEach(acao => {
        acao.classList.toggle("escondido");
        console.log(acao)
    });
    escolherCartas.classList.toggle("escondido");
}


function sapeca() {
    toggleViewCard();
    selecionados = [];
    showCardButton.classList.add("escondido");
    let cartaAtual = statusPlayers[nplayerAtual];
    let htmlGerado = "";
    escolherCartas.innerHTML = "";
    let i = 1;

    cartaAtual.cartas.forEach(carta => {
        htmlGerado += `
            <img class="sapecaCards" data-carta="${carta}" src='${cards[carta]}'>
        `;
        i++;
    });

    for(let i = 1; i <= 2; i++) {
        htmlGerado += `
            <img class="sapecaCards" data-carta="${deck[i-1]}" src='${cards[deck[i-1]]}'>
        `;
    }

    htmlGerado += `
        <button class="buttonSapeca" onclick="trocarCartas()">Trocar</button>
    `
    escolherCartas.innerHTML = htmlGerado;
    let cartas = document.querySelectorAll(".sapecaCards");
    

    

    cartas.forEach(carta => {
        carta.addEventListener("click", () => {
            if(carta.classList.contains("choose")) {
                carta.classList.remove("choose");

                selecionados = selecionados.filter(c => c !== carta);

                return;
            }

            if(selecionados.length >= statusPlayers[nplayerAtual].cartas.length) {
                return;
            }

            carta.classList.add("choose");
            console.log(`${carta} adicionada`);
            selecionados.push(carta);
        })
    })
}

function trocarCartas() {
    if(selecionados.length !== statusPlayers[nplayerAtual].cartas.length) return;

    let novasCartas = selecionados.map(carta => 
        Number(carta.dataset.carta)
    );

    statusPlayers[nplayerAtual].cartas.forEach(carta => {
        deck.push(carta);
    });

    novasCartas.forEach(carta => {
        let index = deck.indexOf(carta);

        if(index !== -1) {
            deck.splice(index, 1);
        }
    });
    
    statusPlayers[nplayerAtual].cartas = novasCartas;
    selecionados = [];
    escolherCartas.innerHTML = "";
    embaralhar();
    toggleViewCard();
    passarRodada();
}


function assasino() {
    if(statusPlayers[nplayerAtual].moedas < 3) {
        alert("Sem moedas suficientes");
        return;
    }

    statusPlayers[nplayerAtual].moedas -= 3;
    colocarCartasNaTela();
}

function capitao() {
    if(alvo === null) {
        alert("Escolha um pessoa para roubar");
        return;
    }
    if(overCoins()) return;
    if(statusPlayers[alvo].moedas <= 0) {
        alert("Sem moedas para roubar");
        return;
    }

    let qtdCoins = statusPlayers[alvo].moedas >= 2? 2 : 1;
    statusPlayers[alvo].moedas -= qtdCoins;
    statusPlayers[nplayerAtual].moedas += qtdCoins;

    alvo = null;

    passarRodada();
}

function duque() {
    if(overCoins()) return;
    statusPlayers[nplayerAtual].moedas += 3;
    passarRodada();

    console.log(statusPlayers[nplayerAtual].moedas);
}


function golpeDeEstado() {
    if(statusPlayers[nplayerAtual].moedas < 7) {
        alert("Moedas insuficientes, faça outra ação");
        return;
    }

    if(!statusPlayers[alvo].vivo) {
        alert("jogador já morto");
        return;
    }

    if(alvo === null) {
        alert("Escolha um alvo");
        return;
    }

    statusPlayers[nplayerAtual].moedas -= 7;

    colocarCartasNaTela();
}


function matar(indiceCarta) {
    statusPlayers[alvo].cartas.splice(indiceCarta, 1);

    if(statusPlayers[alvo].cartas.length <= 0) {
        statusPlayers[alvo].vivo = false;
    }

    escolherCartas.innerHTML = "";

    alvo = null;

    toggleViewCard();
    passarRodada();
}

function rodada() {
    alvo = null;
    const playerAtual = document.querySelectorAll(".card")[nplayerAtual];

    renderGame(statusPlayers[nplayerAtual]);
    console.log(playerAtual);
}

let configs = document.getElementById("config");
function toggleConfig() {
    configs.classList.toggle("escondido");
}