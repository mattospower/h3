"use strict";

/* =====================================================================
   DADOS: 4 perguntas técnicas, uma para cada área de estudo
   ===================================================================== */
const perguntas = [
  {
    area: "Redes",
    texto: "Qual protocolo da camada de transporte é orientado à conexão e garante a entrega ordenada dos dados?",
    alternativas: ["TCP", "UDP", "IP", "ICMP"],
    correta: 0,
    explicacao: "O TCP faz o handshake de três vias e usa numeração e confirmações para entregar os dados em ordem. O UDP não oferece essas garantias."
  },
  {
    area: "Linguagem C",
    texto: "Em C, dado o código  int x = 10; int *p = &x;  qual é o valor da expressão *p?",
    alternativas: [
      "O endereço da variável x",
      "O endereço do ponteiro p",
      "10",
      "0"
    ],
    correta: 2,
    explicacao: "O ponteiro p guarda o endereço de x. O operador * (desreferência) acessa o valor armazenado nesse endereço, ou seja, 10."
  },
  {
    area: "Sistemas Operacionais",
    texto: "Qual algoritmo de escalonamento de CPU dá a cada processo uma fatia de tempo (quantum) e o devolve ao fim da fila se ele não terminar?",
    alternativas: [
      "FCFS (First Come, First Served)",
      "Round Robin",
      "SJF (Shortest Job First)",
      "Prioridade estática"
    ],
    correta: 1,
    explicacao: "No Round Robin cada processo executa por um quantum. Se não terminar, volta ao fim da fila, e isso divide a CPU de forma justa."
  },
  {
    area: "Banco de Dados",
    texto: "Em SQL, qual cláusula filtra os grupos gerados pelo GROUP BY?",
    alternativas: ["WHERE", "ORDER BY", "DISTINCT", "HAVING"],
    correta: 3,
    explicacao: "WHERE filtra linhas antes do agrupamento. HAVING filtra os grupos já formados, normalmente com funções como COUNT ou SUM."
  }
];

/* =====================================================================
   SELEÇÃO DE ELEMENTOS (os quatro métodos pedidos)
   ===================================================================== */

// getElementById: botões, campo de nome e container do placar final
const btnIniciar   = document.getElementById("btn-iniciar");
const btnProxima   = document.getElementById("btn-proxima");
const btnReiniciar = document.getElementById("btn-reiniciar");
const campoNome    = document.getElementById("nome");
const avisoNome    = document.getElementById("aviso-nome");
const placar       = document.getElementById("placar");
const elPergunta   = document.getElementById("pergunta");
const elFeedback   = document.getElementById("feedback");
const elContador   = document.getElementById("contador");
const elArea       = document.getElementById("area");
const barra        = document.getElementById("barra-preenchida");

// getElementsByTagName: título <h1> e blocos estruturais (<section>) das telas
const titulo = document.getElementsByTagName("h1")[0];
const telas  = document.getElementsByTagName("section");

// getElementsByClassName: agrupa todas as alternativas pela classe visual
const alternativasPorClasse = document.getElementsByClassName("alternativa");

// querySelectorAll: seleciona todas as opções de resposta para iterar
const opcoes = document.querySelectorAll("#alternativas li");

/* =====================================================================
   ESTADO DA APLICAÇÃO
   ===================================================================== */
const TITULO_PADRAO = "Quiz de Informática";

let nome = "";
let telaAtual = "tela-inicial";
let indiceAtual = 0;
let pontos = 0;
let respondida = false;
let resultados = []; // { area, acertou } de cada pergunta

/* =====================================================================
   FUNÇÕES AUXILIARES
   ===================================================================== */

// Mostra uma tela e esconde as demais (percorre o HTMLCollection de <section>)
function mostrarTela(id) {
  for (let i = 0; i < telas.length; i++) {
    telas[i].classList.toggle("oculta", telas[i].id !== id);
  }
  telaAtual = id;
}

// Remove os estados visuais de todas as alternativas (usa getElementsByClassName)
function limparAlternativas() {
  for (let i = 0; i < alternativasPorClasse.length; i++) {
    alternativasPorClasse[i].classList.remove("destaque", "correta", "incorreta", "bloqueada");
  }
}

// Carrega a pergunta de índice i na tela
function carregarPergunta(i) {
  const p = perguntas[i];
  respondida = false;

  elContador.textContent = `Pergunta ${i + 1} de ${perguntas.length}`;
  elArea.textContent = p.area;
  barra.style.width = `${((i + 1) / perguntas.length) * 100}%`;
  elPergunta.textContent = p.texto;
  elPergunta.classList.remove("pergunta-vermelha");

  // querySelectorAll devolve uma NodeList: dá para usar forEach
  opcoes.forEach((li, posicao) => {
    li.textContent = p.alternativas[posicao];
  });
  limparAlternativas();

  elFeedback.textContent = "";
  btnProxima.disabled = true;
  btnProxima.textContent = i === perguntas.length - 1 ? "Ver resultado" : "Próxima pergunta";
}

// Registra a escolha do usuário e mostra correta (verde) e incorreta (vermelho)
function selecionar(posicao) {
  if (respondida) return;
  respondida = true;

  const p = perguntas[indiceAtual];
  const acertou = posicao === p.correta;

  opcoes.forEach((li) => {
    li.classList.remove("destaque");
    li.classList.add("bloqueada");
  });

  if (acertou) {
    pontos++;
    opcoes[posicao].classList.add("correta");
    elFeedback.textContent = `Correto! ${p.explicacao}`;
  } else {
    opcoes[posicao].classList.add("incorreta");
    opcoes[p.correta].classList.add("correta");
    elFeedback.textContent = `Não foi dessa vez. ${p.explicacao}`;
  }

  resultados.push({ area: p.area, acertou });
  btnProxima.disabled = false;
}

// Vai para a próxima pergunta ou para o resultado
function avancar() {
  if (!respondida) return;
  indiceAtual++;

  if (indiceAtual < perguntas.length) {
    carregarPergunta(indiceAtual);
  } else {
    mostrarResultado();
  }
}

// Monta o placar final dentro do container #placar
function mostrarResultado() {
  titulo.textContent = `Resultado de ${nome}`;
  placar.textContent = "";

  const pontuacao = document.createElement("p");
  pontuacao.className = "pontuacao";
  pontuacao.textContent = `${pontos} de ${perguntas.length}`;

  const mensagem = document.createElement("p");
  mensagem.className = "mensagem-final";
  if (pontos === perguntas.length) {
    mensagem.textContent = "Gabaritou! Você domina as quatro áreas.";
  } else if (pontos >= 2) {
    mensagem.textContent = "Bom resultado. Revise as áreas marcadas em vermelho.";
  } else {
    mensagem.textContent = "Vale estudar mais um pouco. Leia as explicações e tente de novo.";
  }

  const lista = document.createElement("ul");
  lista.className = "resumo";
  resultados.forEach((r) => {
    const item = document.createElement("li");
    item.className = r.acertou ? "acertou" : "errou";
    item.textContent = `${r.area}: ${r.acertou ? "acertou" : "errou"}`;
    lista.appendChild(item);
  });

  placar.append(pontuacao, mensagem, lista);
  mostrarTela("tela-resultado");
}

// Começa (ou reinicia) o quiz
function iniciarQuiz() {
  indiceAtual = 0;
  pontos = 0;
  resultados = [];
  titulo.textContent = `Boa sorte, ${nome}!`; // Desafio 1: o texto do <h1> muda
  mostrarTela("tela-quiz");
  carregarPergunta(0);
}

/* =====================================================================
   EVENTOS
   ===================================================================== */

// input: valida o campo de nome em tempo real e atualiza o título (Desafio 4)
campoNome.addEventListener("input", () => {
  nome = campoNome.value.trim();
  const preenchido = nome.length > 0;

  btnIniciar.disabled = !preenchido;
  campoNome.classList.toggle("valido", preenchido);
  avisoNome.classList.toggle("valido", preenchido);
  avisoNome.textContent = preenchido
    ? "Tudo certo! Clique em Iniciar Quiz."
    : "Digite seu nome para liberar o quiz.";

  titulo.textContent = preenchido ? `Olá, ${nome}! Pronto para o quiz?` : TITULO_PADRAO;
});

// click: botão "Iniciar Quiz" (Desafio 1)
btnIniciar.addEventListener("click", iniciarQuiz);

// click: botão para avançar de pergunta
btnProxima.addEventListener("click", avancar);

// click: refazer o quiz
btnReiniciar.addEventListener("click", iniciarQuiz);

// Eventos em cada alternativa (iteração sobre a NodeList do querySelectorAll)
opcoes.forEach((li, posicao) => {
  // click: escolher a alternativa
  li.addEventListener("click", () => selecionar(posicao));

  // mouseover: destaque ao passar o cursor
  li.addEventListener("mouseover", () => {
    if (!respondida) li.classList.add("destaque");
  });

  // mouseout: remove o destaque ao sair
  li.addEventListener("mouseout", () => {
    li.classList.remove("destaque");
  });
});

// mouseover / mouseout: pergunta fica vermelha com o mouse por cima (Desafio 2)
elPergunta.addEventListener("mouseover", () => {
  elPergunta.classList.add("pergunta-vermelha");
});
elPergunta.addEventListener("mouseout", () => {
  elPergunta.classList.remove("pergunta-vermelha");
});

// keydown: mostra a tecla no console (Desafio 5) e permite usar o teclado
const atalhos = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };

document.addEventListener("keydown", (evento) => {
  console.log(`Tecla pressionada: "${evento.key}" (code: ${evento.code})`);

  const alvo = evento.target;
  const tecla = evento.key.toLowerCase();

  // Tela inicial: Enter no campo de nome começa o quiz (se o nome estiver preenchido)
  if (telaAtual === "tela-inicial") {
    if (evento.key === "Enter" && alvo === campoNome && !btnIniciar.disabled) {
      evento.preventDefault();
      iniciarQuiz();
    }
    return;
  }

  // Tela do quiz
  if (telaAtual === "tela-quiz") {
    // 1-4 ou A-D escolhem a alternativa
    if (tecla in atalhos && !respondida) {
      selecionar(atalhos[tecla]);
      return;
    }

    if (evento.key === "Enter") {
      // Enter em uma alternativa focada (Tab) escolhe essa alternativa
      if (alvo.classList.contains("alternativa") && !respondida) {
        evento.preventDefault();
        selecionar(Array.from(opcoes).indexOf(alvo));
      // Depois de responder, Enter avança (botões já avançam pelo click nativo)
      } else if (respondida && alvo.tagName !== "BUTTON") {
        evento.preventDefault();
        avancar();
      }
    }
  }
});