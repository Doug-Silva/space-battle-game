//VARIÁVEIS GLOBAIS
let jog, dirxJ, diryJ, velJ, pjx, pjy;
let velT;
let tamanhoTelaW, tamanhoTelaH;
let jogo;
let frames;
let contBombas, painelContBombas, velB, tmpCriaBomba;
let bombasTotal;
let vidaPlaneta, barraPlaneta;
let indiceExplosao, indiceSom;
let telaMsg;

//LOOP PRINCIPAL DO GAME
function gameLoop() {

	if (jogo) {
		//FUNÇÕES DE CONTROLE
		controlaJogador();
		controleTiros();
		controlaBomba();
	}
	gerenciaGame();

	//CONTROLE DE FRAMES DO GAME
	frames = requestAnimationFrame(gameLoop);
}

//INICIO DE TODOS OS COMPONENTES DO GAME
function inicia() {

	//INICIO DO GAME
	jogo = false;

	//INICIAR TELA DE JOGO
	tamanhoTelaW = window.innerWidth;
	tamanhoTelaH = window.innerHeight;

	//INICIAR JOGADOR
	dirxJ = diryJ = 0;
	pjx = tamanhoTelaW / 2;
	pjy = tamanhoTelaH / 2;
	velJ = velT = 7;
	jog = document.getElementById("naveJog");
	jog.style.top = pjy + "px";
	jog.style.left = pjx + "px";

	//CONTROLES DAS BOMBAS
	contBombas = 100;
	velB = 3;

	//CONTROLES DO PLANETA
	vidaPlaneta = 300;
	barraPlaneta = document.getElementById("barraPlaneta");
	barraPlaneta.style.width = vidaPlaneta + "px";

	//CONTROLES DE EXPLOSÃO
	indiceExplosao = indiceSom = 0;

	//CONTROLE DAS TELAS E BOTÃO PLAY
	telaMsg = document.getElementById("telaMsg");
	telaMsg.style.backgroundImage = "url('./assets/css/media/intro.jpg')";
	telaMsg.style.display = "block";
	document.getElementById("btnJogar").addEventListener("click", reinicia);
}

//REINICIA COMPONENTES DO GAME (NOVO JOGO)
function reinicia() {
	bombasTotal = document.getElementsByClassName("bomba");
	let tam = bombasTotal.length;

	for (let i = 0; i < tam; i++) {
		if (bombasTotal[i]) {
			bombasTotal[i].remove();
		}
	}
	telaMsg.style.display = "none";
	clearInterval(tmpCriaBomba);
	cancelAnimationFrame(frames);

	//REDEFINE A VIDA DO PLANETA (NOVO JOGO)
	vidaPlaneta = 300;
	pjx = tamanhoTelaW / 2;
	pjy = tamanhoTelaH / 2;
	jog.style.top = pjy + "px";
	jog.style.left = pjx + "px";

	//REDEFINE A QUANTIDADE DE BOMBAS (NOVO JOGO)
	contBombas = 150;
	jogo = true;
	tmpCriaBomba = setInterval(criaBomba, 1700);
	gameLoop();
}

//EVENTOS
window.addEventListener("load", inicia);
document.addEventListener("keydown", teclaDw);
document.addEventListener("keyup", teclaUp);

//FUNÇÃO DE GERENCIAMENTO DO GAME
function gerenciaGame() {
	barraPlaneta.style.width = vidaPlaneta + "px";
	if (contBombas <= 0) {
		jogo = false;
		clearInterval(tmpCriaBomba);
		telaMsg.style.backgroundImage = "url('./assets/css/media/vitoria.jpg')";
		telaMsg.style.display = "block";
	}

	if (vidaPlaneta <= 0) {
		jogo = false;
		clearInterval(tmpCriaBomba);
		telaMsg.style.backgroundImage = "url('./assets/css/media/derrota.jpg')";
		telaMsg.style.display = "block";
	}
}

//FUNÇÃO DE CONTROLE DO JOGADOR
function controlaJogador() {
	pjy += diryJ * velJ;
	pjx += dirxJ * velJ;
	jog.style.top = pjy + "px";
	jog.style.left = pjx + "px";
}

//FUNÇÃO QUANDO A TECLA ESTÁ PRESSIONADA 
function teclaDw() {

	let tecla = event.keyCode;

	//TECLA PARA CIMA
	if (tecla == 38) {
		diryJ = -1;

		//TECLA PARA BAIXO
	} else if (tecla == 40) {
		diryJ = 1;
	}

	//TECLA PARA DIREITA
	if (tecla == 39) {
		dirxJ = 1;

		//TECLA PARA ESQUERDA
	} else if (tecla == 37) {
		dirxJ = -1;
	}

	//TECLA ESPAÇO - PARA ATIRAR
	if (tecla == 32) {

		//ATIRAR
		atira(pjx + 27, pjy);
	}
}

//FUNÇÃO QUANDO A TECLA NÃO ESTÁ PRESSIONADA
function teclaUp() {

	let tecla = event.keyCode;

	//TECLA CIMA, BAIXO
	if ((tecla == 38) || (tecla == 40)) {
		diryJ = 0;
	}

	//TECLA DIREITA, ESQUERDA
	if ((tecla == 39) || (tecla == 37)) {
		dirxJ = 0;
	}
}

//FUNÇÃO PARA CRIAR BOMBA
function criaBomba() {
	if (jogo) {
		let y = 0;
		let x = Math.random() * tamanhoTelaW;
		let bomba = document.createElement("div");
		let att1 = document.createAttribute("class");
		let att2 = document.createAttribute("style");
		att1.value = "bomba";
		att2.value = "top:" + y + "px;left:" + x + "px;";
		bomba.setAttributeNode(att1);
		bomba.setAttributeNode(att2);
		document.body.appendChild(bomba);
		contBombas--;
	}
}

//FUNÇÃO PARA CONTROLAR AS BOMBAS
function controlaBomba() {
	bombasTotal = document.getElementsByClassName("bomba");
	let tam = bombasTotal.length;
	for (let i = 0; i < tam; i++) {
		if (bombasTotal[i]) {
			let pi = bombasTotal[i].offsetTop;
			pi += velB;
			bombasTotal[i].style.top = pi + "px";
			if (pi > tamanhoTelaH) {
				vidaPlaneta -= 10;
				//CHAMA FUNÇÃO CRIA EXPLOSÃO DO TIPO 2=TERRA
				criaExplosao(2, bombasTotal[i].offsetLeft, null);
				bombasTotal[i].remove();
			}
		}
	}
}

//FUNÇÃO DE CONTROLE DE COLISÃO DAS BOMBAS
function colisaoTiroBomba(tiro) {
	let tam = bombasTotal.length;
	for (let i = 0; i < tam; i++) {
		if (bombasTotal[i]) {
			if (
				(
					//PARTE DE CIMA DO TIRO COM A PARTE DE BAIXO DA BOMBA
					(tiro.offsetTop <= (bombasTotal[i].offsetTop + 40)) &&
					//PARTE DE BAIXO DO TIRO COM A BOMBA
					((tiro.offsetTop + 6) >= (bombasTotal[i].offsetTop))
				)
				&&
				(
					//PARTE ESQUERDA DO TIRO COM A PARTE DIREITA DA BOMBA
					(tiro.offsetLeft <= (bombasTotal[i].offsetLeft + 24)) &&
					//PARTE DIREITA DO TIRO COM A PARTE ESQUERDA DA BOMBA
					((tiro.offsetLeft + 6) >= (bombasTotal[i].offsetLeft))
				)
			) {
				//CHAMA FUNÇÃO CRIA EXPLOSÃO DO TIPO 1=AR
				criaExplosao(1, bombasTotal[i].offsetLeft - 25, bombasTotal[i].offsetTop);
				bombasTotal[i].remove();
				tiro.remove();
			}
		}
	}
}

//FUNÇÃO PARA CRIAR EXPLOSÃO DAS BOMBAS
function criaExplosao(tipo, x, y) {

	//ROTINA DE CONTROLE PARA REMOVER EXPLOSÃO
	if (document.getElementById("explosao" + (indiceExplosao - 4))) {
		document.getElementById("explosao" + (indiceExplosao - 4)).remove();
	}

	let explosao = document.createElement("div");
	let img = document.createElement("img");
	let som = document.createElement("audio");

	//ATRIBUTOS PARA DIV
	let att1 = document.createAttribute("class");
	let att2 = document.createAttribute("style");
	let att3 = document.createAttribute("id");

	//ATRIBUTOS PARA IMAGEM
	let att4 = document.createAttribute("src");

	//ATRIBUTOS PARA ÁUDIO
	let att5 = document.createAttribute("src");
	let att6 = document.createAttribute("id");

	att3.value = "explosao" + indiceExplosao;
	//VERIFICA O TIPO DA EXPLOSÃO
	//SE O TIPO DE EXPLOSAO FOR 1=AR, 2=TERRA
	if (tipo == 1) {
		att1.value = "explosaoAr";
		att2.value = "top:" + y + "px;left:" + x + "px;";
		att4.value = "./assets/css/media/explosao-ar.gif?" + new Date();
	} else {
		att1.value = "explosaoTerra";
		att2.value = "top:" + (tamanhoTelaH - 57) + "px;left:" + (x - 17) + "px;";
		att4.value = "./assets/css/media/explosao-terra.gif?" + new Date();
	}
	att5.value = "./assets/css/media/explosao-audio.mp3?" + new Date();
	att6.value = "som" + indiceSom;
	explosao.setAttributeNode(att1);
	explosao.setAttributeNode(att2);
	explosao.setAttributeNode(att3);
	img.setAttributeNode(att4);
	som.setAttributeNode(att5);
	som.setAttributeNode(att6);
	explosao.appendChild(img);
	explosao.appendChild(som);
	document.body.appendChild(explosao);
	document.getElementById("som" + indiceSom).play();
	indiceExplosao++;
	indiceSom++;
}

//FUNÇÃO PARA ATIRAR
function atira(x, y) {
	let t = document.createElement("div");
	let som = document.createElement("audio");
	let att1 = document.createAttribute("class");
	let att2 = document.createAttribute("style");
	let att3 = document.createAttribute("src");
	let att4 = document.createAttribute("id");
	att1.value = "tiroJog";
	att2.value = "top:" + y + "px;left:" + x + "px;";
	att3.value = "./assets/css/media/tiro.wav?" + new Date();
	att4.value = "som" + indiceSom;
	t.setAttributeNode(att1);
	t.setAttributeNode(att2);
	som.setAttributeNode(att3);
	som.setAttributeNode(att4);
	t.appendChild(som);
	document.body.appendChild(t);
	document.getElementById("som" + indiceSom).play();
	indiceSom++;
}

//FUNÇÃO PARA CONTROLAR OS TIROS
function controleTiros() {
	let tiros = document.getElementsByClassName("tiroJog");
	let tam = tiros.length;
	for (let i = 0; i < tam; i++) {
		if (tiros[i]) {
			let pt = tiros[i].offsetTop;
			pt -= velT;
			tiros[i].style.top = pt + "px";
			colisaoTiroBomba(tiros[i]);
			if (pt < 0) {
				tiros[i].remove();
			}
		}
	}

}