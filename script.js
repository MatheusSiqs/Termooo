//Site baseado no jogo term.ooo desenvolvido por Matheus Siqueira Fernandes
var teclado = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M","Backspace","Enter"]
var curResp = ["","","","",""]
var pos = 0;
var linha = 0;
var acerto = false;
var erro = false;
var db, atual;


if(!localStorage.getItem("db")){
	novoJogador();
}else{
	carregarTabela();
}

function novoJogador(){
	var db = {Totaljogos:0,sVitoria:0,mSequencia:0,tentativas:[0,0,0,0,0,0,0]}
	var atual = {chave:["F","O","R","T","E"],aTentativas:[
			[],
			[],
			[],
			[],
			[],
			[],
		]
	}
	localStorage.setItem("db",JSON.stringify(db));
	localStorage.setItem("atual",JSON.stringify(atual));
	
	carregarTabela();
}

function carregarTabela(){
	let aux,soma = 0;
	let maiorTenta = 0;
	let nJogos = document.getElementById("nJogos")
	
	db = localStorage.getItem("db");
	atual = localStorage.getItem("atual");
	
	db = JSON.parse(db);
	atual = JSON.parse(atual);
	
	document.getElementById("nJogos").innerHTML = db.Totaljogos;
	document.getElementById("sVitoria").innerHTML = db.sVitoria;
	document.getElementById("melhorSequencia").innerHTML = db.mSequencia;
	
	for(aux = 0; aux<db.tentativas.length;aux++){
		if(maiorTenta < db.tentativas[aux]){
			maiorTenta = db.tentativas[aux];
		}
		soma +=db.tentativas[aux];
	}
	
	soma -=db.tentativas[db.tentativas.length-1];

	for(aux = 0; aux<db.tentativas.length; aux++){
		let barra = document.getElementById("s"+aux);
		let temp = (db.tentativas[aux]*100)/maiorTenta;
		barra.innerHTML = db.tentativas[aux];
		barra.style.width = temp.toString()+"%"
	}
	if(db.Totaljogos == 0){
		document.getElementById("nVitoria").innerHTML = "0%"
	}else{
		document.getElementById("nVitoria").innerHTML = ((soma*100)/db.Totaljogos).toFixed(2).toString()+"%";
	}
}

// adiciona o evento para ler as teclas do teclado
window.addEventListener("keydown",escrita,true)
window.addEventListener("click", () => {
		if(event.target == modal){
			modal.style.display = "none";
		}
	}, true)
teclado.forEach( item => {
	document.getElementById("Tecla"+item).addEventListener('click', () => {
		let letra = KeyboardEvent;
		
		switch(item){
			case "Backspace":
				letra.keyCode = 8;
				escrita(letra);
				break
			case "Enter":
				letra.keyCode = 13;
				escrita(letra);
				break
			default:
				letra.keyCode = item.charCodeAt();
				letra.key = item;
				escrita(letra);	
				break;
		}

	}, true)
})
geraPalavra()

//Gera uma palavra aleatoria
function geraPalavra(){
	let api = new XMLHttpRequest();
	let senha;
	let chave;
	let aux;
	
	api.open("get","https://api.dicionario-aberto.net/random", true);
	api.send();
	api.onload = () => {
		senha = JSON.parse(api.responseText);
		senha.word.toUpperCase();
		chave = senha.word.split("")
		console.log(chave);
		
		for(aux=0;aux<5;aux++){
			atual.chave[aux] = chave[aux].toUpperCase();
		}
		
		
		console.log(api.responseText)
	}
	
}

function salvaDB(){
	localStorage.setItem("db",JSON.stringify(db));
	localStorage.setItem("atual",JSON.stringify(atual));
	
	carregarTabela();
}


//função com o script para ler as entradas e executar os comandos vindos do teclado;
function escrita(key){
	if(key.keyCode == 8){
		if(pos >= 0){
			curResp[pos-1] = "";
			if(pos > 0)
				pos--
		}
	}
	
	if(pos<=4){
		if(key.keyCode >=65 && key.keyCode <= 90){
			curResp[pos] = key.key.toUpperCase();
			pos++
		}
	}
	
	if(key.keyCode == 13){
		let label = document.getElementById("label")
		if(pos == 5){
			comparacao()
		}else{
			label.innerHTML = "Somente palavras com 5 letras"
			label.style.visibility = "visible";
			setTimeout( () => {label.style.opacity = 0;},1*1000);
			setTimeout( () => {label.style.visibility = "Hidden";label.style.opacity = 1;},3*1000)		
		}
		
	}
	

	imprimeResp()
}

//função para a impressao na tela do vetor contendo a escolha do jogador
function imprimeResp(){
	let aux = 0;
	
	if(linha>5)
		return;
	
	for(aux = 0; aux<=4;aux++){
		document.getElementById(linha+"l"+aux).innerHTML = curResp[aux];
	}
}

//função com o script de verificação das letras se estão certas, se pertencem a chave ou se não possuem na chave;
function comparacao(){
	let aux = 0;
	let sub = 0;
	let count = 0;
	
	for(aux = 0;aux <= 4; aux++){
		let cell = document.getElementById(linha+"l"+aux);
		//console.log("sucess:\nKey: "+curResp[aux]+"\nChave: "+chave[aux]+"\nteste: "+(curResp[aux]==chave[aux]));
		//verificação se a letra possue na palavra e esta no lugar certo
		atual.aTentativas[linha]+=curResp[aux]
		if(curResp[aux] == atual.chave[aux]){
			cell.parentNode.animate([
			//keyframe
				{transform: 'rotateY(0deg)'},
				{transform: 'rotateY(90deg)'},
				{transform: 'rotateY(0deg)'}
			],{
			//parametro
				duration: 748
			});
			cell.parentNode.style.backgroundColor = "var(--sucesso)"
			document.getElementById("Tecla"+curResp[aux]).style.backgroundColor = "var(--sucesso)"
			count++;
			
		}else{
			//verificação se a letra se repete pelo menos uma vez na chave
			for(sub = 0; sub<= 4; sub++){
				if(curResp[aux]==atual.chave[sub]){
					cell.parentNode.animate([
					//keyframe
						{transform: 'rotateY(0deg)'},
						{transform: 'rotateY(90deg)'},
						{transform: 'rotateY(0deg)'}
					],{
					//parametro
						duration: 748
					});
					cell.parentNode.style.backgroundColor = "var(--warning)"
					document.getElementById("Tecla"+curResp[aux]).style.backgroundColor = "var(--warning)"
					break;
				}else{
					//execução para quando a letra não existe na chave;
					cell.parentNode.animate([
					//keyframe
						{transform: 'rotateY(0deg)'},
						{transform: 'rotateY(90deg)'},
						{transform: 'rotateY(0deg)'}
					],{
					//parametro
						duration: 748
					});
					cell.parentNode.style.backgroundColor = "var(--gray)"
					document.getElementById("Tecla"+curResp[aux]).style.backgroundColor = "var(--gray)"
				}
			}
			
			
		}	
	}
	if(count==5){
		acerto = true;
	}
	encerraPartida();
	curResp.fill("")
	pos = 0;
	linha++;
}

function encerraPartida(){
	if(linha+1 == 6){
		erro = true;
		linha++
	}
	
	if(acerto != true && erro != true){
		return;
	}
	
	var modal = document.getElementById("modal");
	var close = document.getElementsByClassName("close");
	
	if(acerto){
		document.getElementById("label").innerHTML = "Sucesso";
		document.getElementById("label").style.visibility = "visible";
		db.sVitoria++
		if(db.sVitoria > db.mSequencia){
			db.mSequencia++;
		}
	}else{
		document.getElementById("label").innerHTML = "Resposta: "+atual.chave;
		document.getElementById("label").style.visibility = "visible";
		db.sVitoria = 0;
	}
	window.removeEventListener("keydown",escrita,true)
	
	db.tentativas[linha]++
	db.Totaljogos++;
	
	salvaDB()
	
	modal.style.display = "block";		
}

function mostraPlacar(){
	let modal = document.getElementById("modal")
	
	modal.style.display = "block";
}
















