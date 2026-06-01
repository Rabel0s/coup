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

let alvo = null;

function renderGame(playerAtual) {

    let htmlGerado = "";
    gameTable.innerHTML = "";

    statusPlayers.forEach((player, index) => {

        htmlGerado += `
        <div class='${player !== playerAtual? "card" : "outros"}' onclick="clicouPlayer(${index})">

            <h3 class='nick'>${player.nome}</h3>

            <div class='imgCard'>
                <img src='${cards[player.cartas[0]]}'>
                <img src='${cards[player.cartas[1]]}'>
            </div>

            <h3>R$ ${player.moedas}</h3>

        </div>
        `
    });

    gameTable.innerHTML = htmlGerado;
}

function duque() {
    if(statusPlayers[nplayerAtual].moedas >= 10) {
        renderGame(statusPlayers[nplayerAtual])
        golpeDeEstado();
        return;
    }
    statusPlayers[nplayerAtual].moedas += 3;
    console.log(statusPlayers[nplayerAtual].moedas);
}

let escolherCartas = document.querySelector(".chooseCard");
function golpeDeEstado() {
    gameTable.innerHTML = ""
    let htmlGerado =  "";
    player.cartas.forEach(carta => {
        htmlGerado = `<img src='${carta}'></img>`
    });
    escolherCartas.innerHTML = htmlGerado;
}

function rodada() {
    const playerAtual = document.querySelectorAll(".card")[nplayerAtual];
    action.classList.remove("escondido")

    nplayerAtual = nplayerAtual + 1 >= nplayers? 0 : nplayerAtual + 1;
    console.log(playerAtual);
}

let configs = document.getElementById("config");
function toggleConfig() {
    configs.classList.toggle("escondido");
}

function acao(action) {
    switch(action) {
        case action:
            duque();
            break;
    
        default:
            break;
    }
}