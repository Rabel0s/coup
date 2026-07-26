let cards = {
    1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuECK9a_JcKORVRPel0lA2MvASnYjzJCA3rw&s",
    2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaj9OMI0QreFGusBAwgYD-Yw8FBm4MYYPmBP-JrDeuzA&s",
    3: "images/duque.png",
    4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Q9d7RejtxTiiLxYXtCi8nPyuPTFZyJ8Zudl395_ajQ&s",
    5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS_aQHSyvTcnEBsG-YCPM6H-wHXOUcbWMFIcUPrxYYFg&s"
};

const backCard = "images/carta.png";
const deadCard = "images/cartaMorta.png";

let nplayers = 2;
let playersEl = document.getElementById("Nplayers");
const nome = document.getElementById("nome");
let linhaEl = document.querySelector(".linha");
let action = document.querySelector(".painel-acoes");
let infoDaRodada = document.querySelector(".infoDaRodada");
let header = document.querySelector("header");
let rodadaAtual = 1;
let overLayMaior = document.querySelector(".overLayMaior")

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
function pegarCartaDoBaralho(jogador, indice) {
    if (indice === -1) {
        console.error("Carta para trocar não encontrada.");
        return;
    }
    [jogador.cartas[indice], deck[0]] = [deck[0], jogador.cartas[indice]];
    embaralhar();
}

function startGame() {
    deck = [];
    action.classList.remove("escondido");
    const nomeInputs = document.querySelectorAll("#names");

    switch (nplayers) {
        case 2:
            gameTable.style.gridTemplateColumns = "repeat(2, 1fr)";
            break;

         case 3:
            gameTable.style.gridTemplateColumns = "repeat(3, 1fr)";
            break;

        case 4:
            gameTable.style.gridTemplateColumns = "repeat(2, 1fr)";
            break;

        case 5:
        case 6:
            gameTable.style.gridTemplateColumns = "repeat(3, 1fr)";
            break;
    }

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
    
    infoDaRodada.innerHTML = `
        <p>🎲 RODADA ${rodadaAtual}</p>
        <p>👤VEZ DE ${statusPlayers[0].nome}</p>
        <p>🃏CARTAS RESTANTES ${deck.length}</p>
    `;
    escolhasContainer.classList.add("escondido");
    header.classList.remove("escondido");
    linhaEl.classList.add("escondido");
    gameTable.classList.remove("escondido");
    showCardButton.classList.remove("escondido")
    renderGame();
    const playerIni = statusPlayers[0].nome;
}

let nplayerAtual = 0;


function renderGame() {
    tipoDeDuvida = 1;
    let htmlGerado = "";
    gameTable.innerHTML = "";
    showCardButton.classList.remove("escondido");
    blurCard.classList.add("escondido");
    overLayMaior.classList.add("escondido");

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
            document.querySelector(`[data-player="${i}"]`).classList.remove("outros", "card");
            document.querySelector(`[data-player="${i}"]`).classList.add("morto");
            document.querySelector(`[data-player="${i}"]`).querySelectorAll("h3")[1].innerHTML = "Morto"
        }
    }
    infoDaRodada.innerHTML = `
        <p>🎲 RODADA ${rodadaAtual}</p>
        <p>👤VEZ DE ${statusPlayers[nplayerAtual].nome}</p>
        <p>🃏CARTAS RESTANTES ${deck.length}</p>
    `;
}

let alvo = null;
function clicouPlayer(index) {
    if(!statusPlayers[index].vivo) return;
    console.log(index);



    if(document.querySelector(`[data-player="${index}"]`).classList.contains("marcado")) {
        document.querySelector(`[data-player="${index}"]`).classList.remove("marcado");
        alvo = null;
    }

    else {
        document.querySelectorAll(".outros").forEach(card => {
            card.classList.remove("marcado");
        });
        document.querySelector(`[data-player="${index}"]`).classList.add("marcado");
        alvo = index;
    }
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


let showCardButton = document.querySelector(".showCard");
showCardButton.addEventListener("mousedown", mostrarCartas);
showCardButton.addEventListener("mouseup", esconderCartas);
showCardButton.addEventListener("touchstart", mostrarCartas);
showCardButton.addEventListener("touchend", esconderCartas);

let informacoesPainel = document.querySelector(".informacoes");
function mostrarCartasDeTodos() {
    htmlGerado = `
        <div>
            <h3>${(nplayerAtual + 1) % nplayers === 0? "Finalizar" : `Passe o celular para <strong class="nameStrong">${statusPlayers[nplayerAtual + 1].nome}`}</strong></h3>
            <button onclick="proximoAver()">Passar vez</button>
        </div>
    `;
    areaResolverAcao.classList.remove("escondido");
    divResolverAcao.innerHTML = htmlGerado;
}

function esconderCartas() {
    blurCard.classList.add("escondido");
    let card = document.querySelector(".card");
    card.classList.remove("privateCards");
    
    card.querySelectorAll("img").forEach(carta => {
        carta.src = backCard;
    });
}


function proximoAver() {
    passarRodada();
    if(nplayerAtual === 0) {
        informacoesPainel.classList.add("escondido");
        renderGame();
    }
    mostrarCartasDeTodos();
}


let acaoAtual = {
    tipo: "",
    jogador: null,
    alvo: null,
    bloqueavel: false,
    bloqueadoPor: null
};

const regrasDeBlock = {
    assassinar: [2],
    ajuda_externa: [3],
    roubar: [4, 5]
}

let painelBloqueio = document.querySelector(".bloqueio");

let tipoDeDuvida = 1;
function bloquear() {
    let htmlGerado = "";
    acaoAtual.bloqueadoPor = alvo;

    tipoDeDuvida = 2;
    areaResolverAcao.classList.remove("escondido");
    if(infoAcaoAtual.carta === null) {
        jogadorDecidindo = (nplayerAtual + 1) % nplayers;

        decidirQuemBloqueou()
        return;
    }

    else htmlGerado = `
            <h3><strong>ESCOLHER AÇÃO</strong></h3>

            <p><strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong> bloqueou <strong class="actionStrong">${acaoAtual.tipo.replaceAll("_", " ")}</strong> de <strong class="nameStrong">${statusPlayers[nplayerAtual].nome}</strong></p>
            <p>Alguem deseja <strong>DUVIDAR</strong></p>

            <button class="buttonPassar" onclick="passarRodada()">Passar</button>
            <button class="buttonDuvida" onclick="abrirDuvida()">Duvidar</button>
        `;

    divResolverAcao.innerHTML = htmlGerado;
}

function decidirQuemBloqueou() {
    let htmlGerado = "";

    acaoAtual.bloqueadoPor = jogadorDecidindo;
    htmlGerado = `
        <h3><strong>BLOQUEIO</strong></h3>
        <p><strong class="nameStrong">${statusPlayers[nplayerAtual].nome}</strong> está usando ${acaoAtual.tipo.replaceAll("_", " ")}, <strong class="nameStrong">${statusPlayers[jogadorDecidindo].nome}</strong> deseja bloquear</p>

        <button class="buttonPassar" onclick="passarDecisaoBloqueio()">Passar</button>
        <button onclick="marcarQuemDuvidou()">Bloquear</button>
    `;
    divResolverAcao.innerHTML = htmlGerado;
}
function passarDecisaoBloqueio() {
    jogadorDecidindo = (jogadorDecidindo + 1) % nplayers;
    if(statusPlayers[jogadorDecidindo].vivo === false) passarDecisaoBloqueio();

    if(jogadorDecidindo === nplayerAtual) {
        executarAcao(acaoAtual.tipo);
    }
    else decidirQuemBloqueou();
}

function marcarQuemDuvidou() {
    acaoAtual.bloqueadoPor = jogadorDecidindo;
    infoAcaoAtual.carta = -1;
    escolherRespostaAcao(infoAcaoAtual);
}

function acao(action) {
    switch(action) {
        case "renda":
            if(overCoins()) return;
            renda();
            break;
        
        case "ajuda_externa":
            if(overCoins()) return;
            acaoAtual = {
                tipo: "ajuda_externa",
                jogador: nplayerAtual,
                alvo: null,
                bloqueavel: true,
                bloqueadoPor: null
            };
            escolherRespostaAcao({
                jogador: nplayerAtual,
                jogada: "ajuda_externa",
                carta: null
            })
            break;

        case "golpe":
            if(statusPlayers[nplayerAtual].moedas < 7) return;
            acaoAtual = {
                tipo: "golpe",
                jogador: nplayerAtual,
                alvo: alvo,
                bloqueavel: false,
                bloqueadoPor: null
            };
            statusPlayers[nplayerAtual].moedas -= 7;
            golpeDeEstado();
            break;

        case "taxar":
            if(overCoins()) return;
            acaoAtual = {
                tipo: "taxar",
                jogador: nplayerAtual,
                alvo: null,
                bloqueavel: false,
                bloqueadoPor: null
            };
            escolherRespostaAcao({
                jogador: nplayerAtual,
                jogada: "taxar",
                carta: 3
            });
            break;

        case "roubar":
            if(overCoins()) return;
            if(alvo === null) {
                alert("Escolha uma pessoa para roubar");
                return;
            }  
            acaoAtual = {
                tipo: "roubar",
                jogador: nplayerAtual,
                alvo: alvo,
                bloqueavel: true,
                bloqueadoPor: null
            };
            escolherRespostaAcao({
                jogador: nplayerAtual,
                jogada: "roubar",
                carta: 4
            });
            break;

        case "trocar":
            acaoAtual = {
                tipo: "trocar",
                jogador: nplayerAtual,
                alvo: null,
                bloqueavel: false,
                bloqueadoPor: null
            };
            escolherRespostaAcao({
                jogador: nplayerAtual,
                jogada: "trocar",
                carta: 5
            });
            break;

        case "assassinar":
            if(statusPlayers[nplayerAtual].moedas < 3) return;
            if(alvo === null) {
                alert("Escolha uma pessoa para matar");
                return;
            }
            acaoAtual = {
                tipo: "assassinar",
                jogador: nplayerAtual,
                alvo: alvo,
                bloqueavel: true,
                bloqueadoPor: null
            };
            statusPlayers[nplayerAtual].moedas -= 3;
            escolherRespostaAcao({
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
    areaResolverAcao.classList.add("escondido")
    blurCard.classList.add("escondido");
    overLayMaior.classList.add("escondido");

    let saveAlvo = alvo;
    switch(action) {
        case "ajuda_externa":
            ajudaExterna();
            break;

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
    if(canExecutar) {
        canExecutar = false;
        alvo = saveAlvo;
        colocarCartasNaTela()
    }
}

let areaResolverAcao = document.querySelector(".fundoResolverAcao");
let divResolverAcao = document.querySelector(".resolverAcao");

let infoAcaoAtual = null;
function escolherRespostaAcao(info) {

    infoAcaoAtual = info;
    const Passar = infoAcaoAtual.jogada;
    let htmlGerado = "";

    htmlGerado += `<h3><strong>ESCOLHER AÇÃO</strong></h3>`;
    if(acaoAtual.bloqueadoPor === null) htmlGerado += `<p><strong class="nameStrong">${statusPlayers[nplayerAtual].nome}</strong> usou <strong class="actionStrong">${acaoAtual.tipo.replaceAll("_", " ")}</strong></p>`;
    else htmlGerado += `<p><strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong> bloqueou <strong class="actionStrong">${acaoAtual.tipo.replaceAll("_", " ")}</strong> de <strong class="nameStrong">${statusPlayers[nplayerAtual].nome}</strong></p>`;

    if(infoAcaoAtual.carta === -1 ) {
        htmlGerado += `
            <p>Alguem deseja <strong>DUVIDAR</strong> do <strong>BLOQUEIO</strong> de <strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong></p>
            <button class="buttonPassar" onclick="passarRodada()">Passar</button>
            <button class="buttonDuvida" onclick="abrirDuvida()">Duvidar</button>
        `;
        divResolverAcao.innerHTML = htmlGerado;
        return;
    }

    if(infoAcaoAtual.carta !== null && acaoAtual.bloqueavel) htmlGerado += `<p>Alguem deseja <strong>DUVIDAR</strong> ou <strong>BLOQUEAR</strong></p>`;
    if(infoAcaoAtual.carta !== null && !acaoAtual.bloqueavel) htmlGerado += `<p>Alguem deseja <strong>DUVIDAR</strong></p>`;
    if(infoAcaoAtual.carta === null && acaoAtual.bloqueavel) htmlGerado += `<p>Alguem deseja <strong>BLOQUEAR</strong></p>`;

    htmlGerado += `<button class="buttonPassar" onclick="executarAcao('${Passar}')">Passar</button>`;

    if(infoAcaoAtual.carta !== null) htmlGerado += `<button class="buttonDuvida" onclick="abrirDuvida()">Duvidar</button>`;

    if(acaoAtual.bloqueavel) htmlGerado += `<button onclick="bloquear()">Bloquear</button>`;

    
    divResolverAcao.innerHTML = htmlGerado;
    areaResolverAcao.classList.remove("escondido");
    overLayMaior.classList.remove("escondido")
}


function abrirDuvida() {
    if(infoAcaoAtual === null) {
        return
        alert("infoAcaoAtual está null");
    }

    let info =  infoAcaoAtual;

    areaResolverAcao.classList.add("escondido");
    duvidaAtual = info;
    jogadorDecidindo = (info.jogador + 1) % nplayers;
    jogadorDecidindoBloqueio = (acaoAtual.bloqueadoPor + 1) % nplayers;
    areaDuvida.classList.remove("escondido");

    if(tipoDeDuvida === 1) proximoDecisor();
    else proximoDecisorBloqueio();
}

let areaDuvida = document.querySelector(".fundoDuvida");
function proximoDecisor() {
    if(jogadorDecidindo === nplayerAtual) return;
    
    const duvidaText = document.querySelector(".duvidaText");

    duvidaText.innerHTML = `
        <strong class="nameStrong">${statusPlayers[duvidaAtual.jogador].nome}</strong> usou <strong class="actionStrong">${duvidaAtual.jogada.replaceAll("_", " ")}</strong>
        <br>
        <strong class="nameStrong">${statusPlayers[jogadorDecidindo].nome}</strong>, deseja dúvidar?
    `;
    console.log(duvidaText.innerHTML);
    console.log(duvidaText.textContent);
}

function proximoDecisorBloqueio() {
    if(jogadorDecidindoBloqueio === acaoAtual.bloqueadoPor) return;
    
    const duvidaText = document.querySelector(".duvidaText");

    duvidaText.innerHTML = `
        <strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong> bloqueou <strong class="actionStrong">${duvidaAtual.jogada.replaceAll("_", " ")}</strong>
        <br>
        <strong class="nameStrong">${statusPlayers[jogadorDecidindoBloqueio].nome}</strong>, deseja dúvidar?
    `;
    console.log(duvidaText.innerHTML);
    console.log(duvidaText.textContent);
}


function passarDuvida() {
    jogadorDecidindo = (jogadorDecidindo + 1) % nplayers;
    jogadorDecidindoBloqueio = (jogadorDecidindoBloqueio + 1) % nplayers;
    if((statusPlayers[jogadorDecidindo].vivo === false && tipoDeDuvida === 1) || (statusPlayers[jogadorDecidindoBloqueio].vivo === false && tipoDeDuvida === 2)) passarDuvida();

    if(jogadorDecidindoBloqueio === acaoAtual.bloqueadoPor && tipoDeDuvida === 2) {
        passarRodada();
        areaDuvida.classList.add("escondido");
    }
    else if(jogadorDecidindo === duvidaAtual.jogador && tipoDeDuvida === 1) {
        areaDuvida.classList.add("escondido");
        if(tipoDeDuvida !== 2)executarAcao(duvidaAtual.jogada);
        else passarRodada();
        tipoDeDuvida = 1;
    }
    else {
        if(tipoDeDuvida === 1) proximoDecisor();
        else proximoDecisorBloqueio();
    }
}

let canExecutar = false;

function continuar() {
    overLayMaior.classList.add("escondido");
    blurCard.classList.add("escondido");

    areaResolverAcao.classList.add("escondido");
    colocarCartasNaTela();
}

function duvidar() {
    overLayMaior.classList.add("escondido");
    if(tipoDeDuvida === 2) {
        const cartas = regrasDeBlock[acaoAtual.tipo];

        const possuiCarta = cartas.some(carta =>
            statusPlayers[acaoAtual.bloqueadoPor].cartas.includes(String(carta)),
        );
        if(possuiCarta) {
            alvo = jogadorDecidindoBloqueio;
            areaDuvida.classList.add("escondido");

            overLayMaior.classList.remove("escondido");
            let htmlGerado = `
                <p>
                    <strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong> conseguia bloquear
                </p>
                <p>
                    <strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong> decida a carta que <strong class="nameStrong">${statusPlayers[jogadorDecidindoBloqueio].nome}</strong> deve perder
                </p>
                <p><strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong> ganhou uma nova carta</p>
                <button class="buttonPassar" onclick="continuar()">Continuar</button>
            `;
            divResolverAcao.innerHTML = htmlGerado;
            areaResolverAcao.classList.remove("escondido");

            let indexDaCarta;
            cartas.forEach(carta => {
                if(statusPlayers[acaoAtual.bloqueadoPor].cartas.indexOf(String(carta)) !== -1)
                    indexDaCarta = statusPlayers[acaoAtual.bloqueadoPor].cartas.indexOf(String(carta))
            });
            pegarCartaDoBaralho(statusPlayers[acaoAtual.bloqueadoPor], indexDaCarta);
        }
        else {
            alvo = acaoAtual.bloqueadoPor;
            areaDuvida.classList.add("escondido");
            canExecutar = true;

            overLayMaior.classList.remove("escondido");
            let htmlGerado = `
                <p>
                    <strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong> não conseguia bloquear
                </p>
                <p>
                    <strong class="nameStrong">${statusPlayers[jogadorDecidindoBloqueio].nome}</strong> decida a carta que <strong class="nameStrong">${statusPlayers[acaoAtual.bloqueadoPor].nome}</strong> deve perder
                </p>

                <button class="buttonPassar" onclick="continuar()">Continuar</button>
            `;
            divResolverAcao.innerHTML = htmlGerado;
            areaResolverAcao.classList.remove("escondido");
            return;
        }
    }
    else if(statusPlayers[duvidaAtual.jogador].cartas.indexOf(String(duvidaAtual.carta)) !== -1) {
        alvo = jogadorDecidindo;
        areaDuvida.classList.add("escondido");

        overLayMaior.classList.remove("escondido");
        let htmlGerado = `
                <p>
                    <strong class="nameStrong">${statusPlayers[duvidaAtual.jogador].nome}</strong> realmente tinha a carta
                </p>
                <p>
                    <strong class="nameStrong">${statusPlayers[duvidaAtual.jogador].nome}</strong> decida a carta que <strong class="nameStrong">${statusPlayers[jogadorDecidindo].nome}</strong> deve perder
                </p>

                <button class="buttonPassar" onclick="continuar()">Continuar</button>
            `;
        divResolverAcao.innerHTML = htmlGerado;
        areaResolverAcao.classList.remove("escondido");
    }
    else {
        alvo = nplayerAtual;
        areaDuvida.classList.add("escondido");

        overLayMaior.classList.remove("escondido");
        let htmlGerado = `
                <p>
                    <strong class="nameStrong">${statusPlayers[jogadorDecidindo].nome}</strong> estava <strong>mentindo</strong> e não tinha a carta
                </p>
                <p>
                    <strong class="nameStrong">${statusPlayers[jogadorDecidindo].nome}</strong> decida a carta que <strong class="nameStrong">${statusPlayers[duvidaAtual.jogador].nome}</strong> deve perder
                </p>

                <button class="buttonPassar" onclick="continuar()">Continuar</button>
            `;
        divResolverAcao.innerHTML = htmlGerado;
        areaResolverAcao.classList.remove("escondido");
    }
    tipoDeDuvida = 1;
}

function passarRodada() {
    areaResolverAcao.classList.add("escondido");
    alvo = null;
    while(true) {
        nplayerAtual = (nplayerAtual + 1) % nplayers;
        if(statusPlayers[nplayerAtual].vivo === true) break;
    }
    
    tipoDeDuvida = 1;
    rodadaAtual++;
    renderGame()
}

function overCoins() {
    if(statusPlayers[nplayerAtual].moedas >= 10) {
        alert("Você está com muitas moedas e é obrigado a dar um golpe")
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
    if(tipoDeDuvida !== 2) passarRodada();
    else renderGame();
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