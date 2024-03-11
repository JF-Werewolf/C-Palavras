import { PALAVRAS } from "./dados_descubra_palavras.js";
import { PALAVRAS_VALIDAS } from "./dados_descubra_palavras_validas.js";

const numero_de_tentativas = 6;
const numero_de_letras = 5;
const quantMaxDicas = 2;
let linhaAtual = numero_de_tentativas;
let arrayPalavraUsuario = [];
let arrayIndicesPalavraUsuario = [];
let arrayDicas = [];
let quantDicas = 1;
let palavraGabarito = PALAVRAS_VALIDAS[Math.floor(Math.random() * PALAVRAS_VALIDAS.length)];
let arrayAcertosUsuario = [];

console.log(palavraGabarito);


function inicializaJogo() {
  document.getElementById('mensagemTutorial').style.display = "flex";  
}

function inicializaArrayIndices(){
  arrayIndicesPalavraUsuario=[];
  arrayAcertosUsuario=[];
  for(let i=0;i<numero_de_letras;i++){
    arrayIndicesPalavraUsuario.push(i);
    arrayAcertosUsuario.push(0);
  }
}

function inicializaarrayIndicesPalavraUsuario(){
  arrayIndicesPalavraUsuario=[];
  for(let i=0;i<numero_de_letras;i++){
    arrayIndicesPalavraUsuario.push(i);
  }
}

export function criaAmbiente(){
  document.getElementById('mensagemTutorial').style.display = "none"; 
  inicializaArrayIndices();
   
  let board = document.getElementById("game-board");

  for (let i = 0; i < numero_de_tentativas; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

export function limpaAmbiente() {
  let board = document.getElementById("game-board");

  // Remove todas as divs filhas do elemento com id "game-board"
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    elem.style.backgroundColor="buttonface";
  }
  document.getElementById("del").style.backgroundColor="rgb(219, 91, 91)";
  document.getElementById("enter").style.backgroundColor="rgb(82, 177, 82)";
}

function corLetraTeclado(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "green") {
        return;
      }

      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

function deletarLetra() {
  let posicaoAtual = arrayIndicesPalavraUsuario[0]-1;
  if(isNaN(posicaoAtual)){
    posicaoAtual=4;
  }
  while(arrayDicas.find(a => a.chave === posicaoAtual)){
    posicaoAtual--;
  }
  if(posicaoAtual>=0){    
    deletaLetraHtml(posicaoAtual);
    arrayPalavraUsuario[posicaoAtual]=null;
    arrayIndicesPalavraUsuario.splice(0, 0, posicaoAtual);
  }
}

function deletaLetraHtml(posicaoAtual){
  let row = document.getElementsByClassName("letter-row")[6 - linhaAtual];
  let box = row.children[posicaoAtual];
  box.textContent = "";
  box.classList.remove("filled-box");
}

function inserirLetraComum(teclaClicada) {
  if(arrayIndicesPalavraUsuario.length>0){
    let posicaoExcluir=0;
    let posicaoLetra = arrayIndicesPalavraUsuario[posicaoExcluir];  
    teclaClicada = teclaClicada.toLowerCase();  
    inserirArrayPalavraUsuario(posicaoLetra, teclaClicada, posicaoExcluir);
    inserirLetraHtml(posicaoLetra, teclaClicada);
  }  
}

function inserirLetraHtml(posicaoLinha, letra){
  let row = document.getElementsByClassName("letter-row")[6 - linhaAtual];  
  let box = row.children[posicaoLinha];
  animateCSS(box, "pulse");
  box.textContent = letra;
  box.classList.add("filled-box");
  return box;
}

function inserirArrayPalavraUsuario(posicao, letra, indiceParaExcluir){
  arrayPalavraUsuario[posicao]=letra;
  arrayIndicesPalavraUsuario.splice(indiceParaExcluir, 1);
}

const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

document.addEventListener("keyup", (e) => {
  if (linhaAtual === 0) {
    return;
  }

  let teclaClicada = String(e.key);
  if (teclaClicada === "Backspace") {
    deletarLetra();
    return;
  }

  if (teclaClicada === "Enter") {
    checarPalavra();
    return;
  }

  let found = teclaClicada.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    inserirLetraComum(teclaClicada);
  }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

function checarPalavra() {
  let linha = document.getElementsByClassName("letter-row")[6 - linhaAtual];
  let palavraUsuario = "";
  let arrayPalavraGabarito = Array.from(palavraGabarito);

  console.log('arrayPalavraUsuario: '+arrayPalavraUsuario);

  palavraUsuario = juntaArrayPalavraUsuario(palavraUsuario);
  let palavraValida = validaPalavra(palavraUsuario);
  if (palavraValida) {
    pintaLetras(arrayPalavraGabarito,linha,palavraUsuario);
    resultadoPalavra(palavraUsuario);
  }
}

function juntaArrayPalavraUsuario(palavraUsuario){
  for (const letra of arrayPalavraUsuario) {
    palavraUsuario += letra;
  }
  return palavraUsuario;
}

function validaPalavra(palavraUsuario) {
  if (palavraUsuario.length != 5) {
    document.getElementById("mensagemLetrasInsuficiente").style.display="flex";
    setTimeout(() => {
      document.getElementById("mensagemLetrasInsuficiente").style.display="none";
    }, 2000);

    return false;
  }

  if (!PALAVRAS.includes(palavraUsuario)) {
    document.getElementById("mensagemPalavrasValidas").style.display="flex";
    setTimeout(() => {
      document.getElementById("mensagemPalavrasValidas").style.display="none";
      arrayPalavraUsuario=[];
      inicializaarrayIndicesPalavraUsuario();
      let row = document.getElementsByClassName("letter-row")[6 - linhaAtual];
      row.innerHTML = '';
      for (let j = 0; j < 5; j++) {
        let box = document.createElement("div");
        box.className = "letter-box";
        row.appendChild(box);
      }
      if(arrayDicas.length>0){
        for(const dica of arrayDicas){
          inserirDicaPosicao(dica.valor,dica.chave);         
        }
      }
    }, 2000);
    return false;
  }
  return true;
}

function pintaLetras(arrayPalavraGabarito,linha,palavraUsuario){
  let arrayCores = ["pink", "pink", "pink", "pink", "pink"];
  arrayCores = pintaLetrasAmarelo(arrayCores, arrayPalavraGabarito);
  pintaLetrasVerde(arrayCores, arrayPalavraGabarito);
  animarResultadoLetra(linha, palavraUsuario, arrayCores);
}

function pintaLetrasAmarelo(arrayCores, arrayPalavraGabarito) {
  let cont = 0;
  for (const letraGabarito of arrayPalavraGabarito) {
    for (const letraUsuario of arrayPalavraUsuario) {
      if (letraGabarito == letraUsuario) {
        arrayCores[cont] = "yellow";
      }
      cont++;
    }
    cont = 0;
  }
  return arrayCores;
}

function pintaLetrasVerde(arrayCores, arrayPalavraGabarito) {
  let cont = 0;
  for (const letra of arrayPalavraUsuario) {
    if (arrayPalavraGabarito[cont] == letra) {
      arrayCores[cont] = "rgb(85, 189, 85)";
      arrayAcertosUsuario[cont] = '#';
    }
    cont++;
  }
  return arrayCores;
}

function animarResultadoLetra(linha, palavraUsuario, arrayCores) {
  for (let i = 0; i < 5; i++) {
    let box = linha.children[i];
    let delay = 250 * i;
    setTimeout(() => {
      //flip box
      animateCSS(box, "flipInX");
      //shade box
      box.style.backgroundColor = arrayCores[i];
      corLetraTeclado(palavraUsuario.charAt(i) + "", arrayCores[i]);
    }, delay);
  }
}

function resultadoPalavra(palavraUsuario){
  if (palavraUsuario === palavraGabarito) {
    campeao();
  } else {
    errouPalavra();
  }
}

function campeao(){
  document.getElementById("mensagemGanhou").style.display="flex";
  linhaAtual = 0;
}

function errouPalavra(){
  linhaAtual -= 1;
  arrayPalavraUsuario = [];
  arrayDicas=[];
  inicializaarrayIndicesPalavraUsuario();
  perdeuJogo();  
}

function perdeuJogo(){
  if (linhaAtual === 0) {
    document.getElementById("mensagemPerdeu").style.display="flex";
    document.getElementById("palavraGabarito").innerHTML=palavraGabarito;
  }
}

function jogarNovamente(){
  document.getElementById("mensagemGanhou").style.display="none";
  document.getElementById("mensagemPerdeu").style.display="none";
  linhaAtual = numero_de_tentativas;
  arrayPalavraUsuario = [];
  inicializaArrayIndices();
  palavraGabarito = PALAVRAS_VALIDAS[Math.floor(Math.random() * PALAVRAS_VALIDAS.length)];
  arrayAcertosUsuario=[];
  limpaAmbiente();
  criaAmbiente();
  arrayDicas=[];
  quantDicas=1;
}

function abrirTutorial(){
  let mensagemTutorial = document.getElementById("mensagemTutorial");
  mensagemTutorial.style.display = "flex";
  let bt_continuar = document.getElementById("bt_continuar");
  bt_continuar.style.display = "block";
  let bt_reiniciar = document.getElementById("bt_reiniciar");
  bt_reiniciar.style.display = "none";
}

function continuarJogo(){
  let mensagemTutorial = document.getElementById("mensagemTutorial");
  mensagemTutorial.style.display = "none";
}

function darDica(){
  let arrayIndices = [];
  if(arrayAcertosUsuario.filter(Boolean).length<4 && quantDicas<=quantMaxDicas){
    carregaArrayIndicesDarDica(arrayIndices);
    let indiceAleatorio = Math.floor(Math.random() * arrayIndices.length);
    let indiceAleatorioArray = arrayIndices[indiceAleatorio];
    let arrayPalavraGabarito = Array.from(palavraGabarito);
    let letra = arrayPalavraGabarito[indiceAleatorioArray];
    inserirDicaPosicao(letra,indiceAleatorioArray);
    setArrayDicas(indiceAleatorioArray,letra);
    quantDicas++;
    console.log(quantDicas);
  }
}

function carregaArrayIndicesDarDica(arrayIndices){
  let posicao = 0;
  for (const letra of arrayAcertosUsuario){
    if(letra === 0){
      arrayIndices.push(posicao);
    }
    posicao++;
  }
}

function inserirDicaPosicao(letra,indiceAleatorioArray){
  let box = inserirLetraHtml(indiceAleatorioArray,letra);
  inserirArrayPalavraUsuario(indiceAleatorioArray,letra,arrayIndicesPalavraUsuario.indexOf(indiceAleatorioArray));
  box.style.backgroundColor = 'black';
  box.style.color = 'white';
  arrayAcertosUsuario[indiceAleatorioArray]='#'; 
}

function setArrayDicas(posicao,letra){
  arrayDicas.push({'chave':posicao,'valor':letra});
}

inicializaJogo()
window.criaAmbiente = criaAmbiente;
window.jogarNovamente = jogarNovamente;
window.abrirTutorial = abrirTutorial;
window.continuarJogo = continuarJogo;
window.darDica = darDica;