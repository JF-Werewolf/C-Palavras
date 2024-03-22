//import { PALAVRAS_VALIDAS } from "./dados_descubra_palavras_validas.js";

const PALAVRAS_VALIDAS = [
"chico",
"maria",
"jesus",
"mente",
"corpo",
"livro",
"morte",
"saber",
"carma",
"prova",
"papai",
"falar",
"penso",
"farol",
"maria",
"mamae",
"parto",
"passe",
"mundo",
"honra",
"ideia",
"moral",
"orfao",
"homem",
"poder",
"ajuda",
"prece",
"graca",
"nasce",
"ordem",
"cegos",
"dogma",
"regra",
"valor",
"tempo",
"sabio",
"sinal",
"lares",
"santo",
"sonho",
"poema",
"licao",
];



let boardX = 11;
let boardY = 11;
let gameBoard =[];
let pressionado = [];
let solto = [];
let sobre = [];
let posicaoCorrigida=[];
let target = [];

let start = [];
let end = [];

let corrigir = true;

let quantidadePalavras = 6;
let palavras = [];
let dificuldade = 2;

let palavrasDescobertas = [];
let acertos = 0;

jogandoAtualmente = false;

class Palavra{
    constructor(text, start, end){
        this.text = text;
        this.start = start;
        this.end = end;
    }

}

const { abs, sign} = Math; 
const radsToDegrees = rad => (rad * 180.0) / Math.PI;
//const degreesToRads = degrees => (degrees * (Math.PI/180));
const getAngle = (anchor, point) => Math.atan2(anchor.y - point.y, anchor.x - point.x) * 180 / Math.PI + 180;

// --------------------**********************----------------------
// Funções iniciais

function inicializa_jogo() {

    gerarTabuleiro();
    menu();
}

function gerarTabuleiro(){
    acertos = 0;
    generateGameBoard();
    pickWords();
    spawnWords();
    fillWithRandom();
    generateHTMLBoard();
}

function generateGameBoard(){
    gameBoard.length = 0;
    for(let y=0; y<boardY; y++){
        let row = [];
        for(let x=0; x<boardX; x++){
            row.push(String.fromCharCode(96));
        }
        gameBoard.push(row);
    }
}

function pickWords(){
    let indices = [];
    for(let x = 0; x<quantidadePalavras; x++){
        let valor = getRandomInt(PALAVRAS_VALIDAS.length);
        while(indices.includes(valor)){
            valor = getRandomInt(PALAVRAS_VALIDAS.length);
        }
        indices.push(valor);
    }
    //console.log("INDICES: " + indices);

    palavras.length = 0;
    for(let x =0; x<quantidadePalavras; x++){
        let p = new  Palavra(PALAVRAS_VALIDAS[indices[x]], [0,0], [0,0]);
        palavras.push(p);
    }
    //palavras[0].start = [1,3];
    //console.log("PALAVRAS: " + palavras[0].start);
}

function spawnWords(){
    let angulos;
    switch(dificuldade){
        case 0:
            angulos = 2;
            break;
        case 1:
            angulos = 4;
            break;
        case 2:
            angulos = 8;
            break;
        default:
            break;
    }

    let angulo;
    let vertical, horizontal;
    let wordStar = [];
    let letraPosicao = [];
    let palavra;

    let success = false;

    for(let x =0; x<quantidadePalavras ; x++){
        palavra = palavras[x];
        success = false;
        //console.log("-----------Palavra: "+ palavra.text + "---------------------");

        while(true){
            //console.log("DERECTIONS: " + vertical + horizontal);
            wordStar.length = 0;
            wordStar.push(getRandomInt(boardX));
            wordStar.push(getRandomInt(boardY));

            angulo = getRandomInt(angulos);
            switch (angulo){
                case 0: horizontal = 1, vertical = 0; break;
                case 1: horizontal = 0, vertical = 1; break;
                case 2: horizontal = -1, vertical = 0; break;
                case 3: horizontal = 0, vertical = -1; break;
                case 4: horizontal = 1, vertical = 1; break;
                case 5: horizontal = -1, vertical = 1; break;
                case 6: horizontal = -1, vertical = -1; break;
                case 7: horizontal = 1, vertical = -1; break;
                default: break;
            }
            
            letraPosicao = [0,0];
            for(let l = 0; l<palavra.text.length; l++){
                letraPosicao[0] = wordStar[0] + (l * horizontal);
                letraPosicao[1] = wordStar[1] + (l * vertical);

                if(letraPosicao[0] >= boardX || letraPosicao[0] < 0){
                    break;
                }

                if(letraPosicao[1] >= boardY || letraPosicao[1] < 0){
                    break;
                } 

                if(gameBoard[letraPosicao[1]][letraPosicao[0]] != String.fromCharCode(96)){
                    if(gameBoard[letraPosicao[1]][letraPosicao[0]] != palavra.text[l]){
                        break;
                    }
                }

                if(l == palavra.text.length-1){
                    success = true;
                }
            }

            if(success){
                for(let l = 0; l<palavra.text.length; l++){
                    letraPosicao[0] = wordStar[0] + (l * horizontal);
                    letraPosicao[1] = wordStar[1] + (l * vertical);

                    gameBoard[letraPosicao[1]][letraPosicao[0]] = palavra.text[l];
                }
                palavra.start = wordStar.slice();
                palavra.end = letraPosicao.slice();
                break;
            }
        }
    }
}

function fillWithRandom(){
    for(let y=0; y<boardY; y++){
        let row = [];
        for(let x=0; x<boardX; x++){
            if(gameBoard[y][x] == String.fromCharCode(96)){
                gameBoard[y][x] = String.fromCharCode(97 + getRandomInt(26));
            }
        }
        gameBoard.push(row);
    }
}

function generateHTMLBoard(){

    let board = document.getElementById("board");

    board.innerHTML = "";

    for(let y = 0; y < boardY; y++){
        let row = document.createElement("div");
        //row.className = "primeira-linha";

        for(let x = 0; x < boardX; x++){
            let cell = document.createElement("button");
            cell.className = "board-button";
            cell.textContent = gameBoard[y][x];
            cell.id = "" + x + '/' + y;
            cell.onmousedown = function(){pressionadoSobre(x,y)};
            cell.onmouseover = function(){cursorSobre(x,y)};
            cell.onmouseup = function(){soltoSobre(x,y)};

            row.appendChild(cell);
        }
    
        board.appendChild(row);
    }


    let words = document.getElementById("words");
    words.innerHTML = "";
    words.className = "word-board-line"

    let row = document.createElement("div");
    row.className = "word-board-line";

    for(let p=0; p<palavras.length; p++){

        let word = document.createElement("div");
        word.className = "word-board";
        word.id = "word"+p;
        word.textContent = palavras[p].text;

        words.appendChild(word);
    }
    //words.appendChild(row);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function configurarDificuldade(x){
    dificuldade = x;
    if(x==0){
        boardX = 9;
        boardY = 9;
        quantidadePalavras = 6;
    }
    if(x==1){
        boardX = 11;
        boardY = 11;
        quantidadePalavras = 8;
    }

    if(x==2){
        boardX = 13;
        boardY = 13;
        quantidadePalavras = 10;
    }

    let menu = document.getElementById("menu");
    menu.style.display = "none";
    jogandoAtualmente = true;
    gerarTabuleiro();

}

function menu(){
    let menu = document.getElementById("menu");
    menu.style.display = "flex";
    if(jogandoAtualmente){
        document.getElementById("botaoContinuar").style.display = "block";
    }
    else{
        document.getElementById("botaoContinuar").style.display = "none";
    }

    console.log("" + document.getElementById("botaoFacil").style.display)
}

function fecharMenu(){
    let menu = document.getElementById("menu");
    menu.style.display = "none";
}

//--------------------------------------------------------------------------

function mudarCor(posicao, classe){
    let cell = document.getElementById(""+posicao[0]+"/"+posicao[1]);
    //cell.style.backgroundColor = "green"; 
    cell.className = classe;
}

function line(start, end, classe) {
    //console.log("LOL: " + start + end + classe);
    const dx = abs(end[0] - start[0]);
    const dy = abs(end[1] - start[1]);
    const sx = sign(end[0] - start[0]);
    const sy = sign(end[1] - start[1]);
    let err = dx - dy;
    let position = start.slice();
  
    while (true) {
      mudarCor(position, classe); // Do what you need to for this
  
      if (position[0] === end[0] && position[1] === end[1]) break;
  
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; position[0] += sx; }
      if (e2 <  dx) { err += dx; position[1] += sy; }
    }
  }


function corrigirPosicao(s, e, cull){
    posicaoCorrigida = target.slice();
    //console.log("Start: " + s);

    let angleR = Math.atan2(e[1] - s[1], e[0] - s[0]);
    if(angleR < 0){
        angleR = Math.PI + (Math.PI - abs(angleR));
    }

    let distance = Math.sqrt((e[0]-s[0])* (e[0]-s[0]) + (e[1]-s[1]) * (e[1]-s[1]));

    let temp = angleR % 0.785398;
    angleR = angleR-temp;
    if(temp > (0.785398/2)){
        angleR+=0.785398;
        let z;
    }

    posicaoCorrigida[0] = s[0] + Math.round(Math.cos(angleR)*distance);
    posicaoCorrigida[1] = s[1] + Math.round(Math.sin(angleR)*distance);

    if(cull){
        while(posicaoCorrigida[0] < 0 || posicaoCorrigida[0]>boardX-1 || posicaoCorrigida[1] < 0 || posicaoCorrigida[1]>boardY-1 ){
            distance = distance - 0.5;
            posicaoCorrigida[0] = s[0] + Math.round(Math.cos(angleR)*distance);
            posicaoCorrigida[1] = s[1] + Math.round(Math.sin(angleR)*distance);
        }
    }
    return posicaoCorrigida;
}

function remarcarAchados(){
    let palavra;
    for(let p =0; p< palavrasDescobertas.length; p++){
        palavra = palavrasDescobertas[p];
        console.log("REMARCANDO: " + palavra.text)
        line(palavra.start, palavra.end, "board-button-found");
    }
}
///////////////////////////////////////////////

function pressionadoSobre(x,y){
    //pressionado = [x,y];
    if(start.length == 0){
        start = [x,y];
        mudarCor([x,y], "board-button-line");
    }
    //console.log("START: " + start);
}

function cursorSobre(x,y){
    if(start.length > 0){
        line(start, target, "board-button")
        remarcarAchados();
    }

    target = [x,y]
    if(start.length > 0){
        //console.log("PRELINE:" + target);
        if(corrigir){
            target = corrigirPosicao(start, target, true);
        }
        //console.log("LINE: " + start + "/" + target);
        line(start, target, "board-button-line");
    }
}

function soltoSobre(x,y){
    if(start.length > 0){
        if([x,y].toString() !== start.toString()){
            end = target.slice();
            line(start, target, "board-button-line");
            checkSelection(start, end);
            start.length=0;
            end.length = 0;
        }
    }
}

function checkSelection(start,end){
    let palavra;
    let success = false;
    for(let p = 0; p<palavras.length; p++){
        palavra = palavras[p];

        if(start.toString() === palavra.start.toString() && end.toString() === palavra.end.toString()){
            success = true;
        }

        if(end.toString() === palavra.start.toString() && start.toString() === palavra.end.toString()){
            success = true;
        }

        if(success){
            line(start, end, "board-button-found");
            palavrasDescobertas.push(palavra);
            //palavras.splice(p,1);
            document.getElementById("word"+p).style.backgroundColor = "rgb(106, 129, 230)";
            success = true;
            acertos ++;
            break;
        }
    }
    if(!success){
        line(start, end, "board-button");
        remarcarAchados();
    }

    if(acertos == quantidadePalavras){
        console.log("GANHOU!!!");
    }
}

/*
function pressionadoSobre(x,y){
    if(start.length == 0)pressionado = [x,y];
    if(start.length ==0) mudarCor(pressionado,"board-button-click" );
}

function cursorSobre(x,y){
    if(posicaoCursor.length == 0 || pressionado.length == 0){
        posicaoCursor=[x,y];
    }

    if(pressionado.length>0){
        
        if(corrigir){
            corrigirPosicao(pressionado, [x,y]);
            target = posicaoCorrigida.slice();
        }
        else{
            target = [x,y];
        }

        if(posicaoCursor.toString() !== target.toString()){
            line(pressionado, posicaoCursor, "board-button");
            line(pressionado, target, "board-button-line");

            mudarCor(target, "board-button-over");
            mudarCor(pressionado, "board-button-click");
        }
        posicaoCursor = target.slice();
    }
}

function soltoSobre(x,y){
    //mudarCor(x, y);
    if(pressionado.length > 0){
        solto = [x,y];
        
        if(pressionado.toString() === solto.toString()){
            if(start.length==0){
                start = solto.slice();
            }
            else{
                end = target.slice();
                line(start, end, "board-button-line");
                start.length=0;
                end.length=0;
                pressionado.length=0;
            }
        }
        else{
            start = pressionado.slice();
            end = target.slice();
            line(start, end,"board-button-line");
            start.length=0;
            end.length=0;
            pressionado.length=0;
        }
    }
}
*/


// --------------------**********************----------------------
// Funções do jogo

function fim_jogo() {
    acertos = 0;
    setTimeout(function () {
        document.getElementById("fim_jogo").style.display = "flex";
    }, 1000);
}

function reseta_jogo() {
    for (let i = 0; i < 24; i++) {
        let elemento = document.getElementById("img" + i);
        elemento.src = "img/virada.png";
        elemento.onclick = function onclick(event) {
            clicaCarta(i);
        };
    }
    document.getElementById("fim_jogo").style.display = "none";
    inicializa_jogo();
}

//  inicializa o jogo
inicializa_jogo();