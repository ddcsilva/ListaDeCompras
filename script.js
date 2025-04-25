// ===== CONSTANTES =====
const CONSTANTES = {
  TAMANHO_MAXIMO_ITEM: 50,
  TEMPO_NOTIFICACAO: 3000,
  CHAVE_LOCAL_STORAGE: "listaDeCompras",
  LIMITE_SCROLL: 300, // Distância em pixels para mostrar o botão
  CHAVE_TEMA: "temaListaCompras",
};

// ===== SELEÇÃO DE ELEMENTOS =====
const elementos = {
  input: document.querySelector("#input-item"),
  inputQuantidade: document.querySelector("#input-quantidade"),
  botaoAdicionar: document.querySelector("#btn-adicionar"),
  lista: document.querySelector("#lista-compras"),
  botaoLimpar: document.querySelector("#btn-limpar"),
  totalItens: document.querySelector("#total-itens"),
  itensComprados: document.querySelector("#itens-comprados"),
  botaoTopo: document.querySelector("#btn-topo"),
  botaoTema: document.querySelector("#btn-tema"),
  iconeTema: document.querySelector("#icone-tema"),
};

// ===== GERENCIAMENTO DE NOTIFICAÇÕES =====
const Notificacao = {
  mostrar(mensagem, tipo = "sucesso") {
    const notificacao = document.createElement("div");
    notificacao.className = `notificacao notificacao--${tipo}`;
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);

    setTimeout(() => {
      notificacao.remove();
    }, CONSTANTES.TEMPO_NOTIFICACAO);
  },
};

// ===== VALIDAÇÃO =====
const Validacao = {
  item(texto) {
    if (texto.length > CONSTANTES.TAMANHO_MAXIMO_ITEM) {
      Notificacao.mostrar(`O item não pode ter mais de ${CONSTANTES.TAMANHO_MAXIMO_ITEM} caracteres`, "erro");
      return false;
    }
    return true;
  },

  quantidade(quantidade) {
    const num = parseInt(quantidade);
    if (isNaN(num) || num < 1 || num > 99) {
      Notificacao.mostrar("A quantidade deve ser um número entre 1 e 99", "erro");
      return false;
    }
    return true;
  },
};

// ===== GERENCIAMENTO DE ARMAZENAMENTO =====
const Armazenamento = {
  salvar() {
    try {
      const itens = Array.from(elementos.lista.querySelectorAll(".lista-itens__item")).map((item) => ({
        texto: item.querySelector(".lista-itens__texto").textContent,
        quantidade: item.querySelector(".lista-itens__quantidade").textContent,
        comprado: item.classList.contains("lista-itens__item--comprado"),
      }));
      localStorage.setItem(CONSTANTES.CHAVE_LOCAL_STORAGE, JSON.stringify(itens));
      elementos.botaoLimpar.style.display = elementos.lista.children.length > 0 ? "block" : "none";
    } catch (erro) {
      Notificacao.mostrar("Erro ao salvar a lista", "erro");
      console.error("Erro ao salvar lista:", erro);
    }
  },

  carregar() {
    try {
      const itensSalvos = JSON.parse(localStorage.getItem(CONSTANTES.CHAVE_LOCAL_STORAGE)) || [];
      return itensSalvos;
    } catch (erro) {
      Notificacao.mostrar("Erro ao carregar a lista salva", "erro");
      console.error("Erro ao carregar lista:", erro);
      return [];
    }
  },

  limpar() {
    localStorage.removeItem(CONSTANTES.CHAVE_LOCAL_STORAGE);
  },
};

// ===== GERENCIAMENTO DE ITENS =====
const GerenciadorItens = {
  criar(texto, quantidade, comprado = false) {
    const item = document.createElement("li");
    item.className = `lista-itens__item ${comprado ? "lista-itens__item--comprado" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "lista-itens__checkbox";
    checkbox.checked = comprado;
    checkbox.setAttribute("aria-label", `Marcar ${texto} como comprado`);

    const conteudo = document.createElement("div");
    conteudo.className = "lista-itens__conteudo";

    const textoItem = document.createElement("span");
    textoItem.className = "lista-itens__texto";
    textoItem.textContent = texto;

    const quantidadeSpan = document.createElement("span");
    quantidadeSpan.className = "lista-itens__quantidade";
    quantidadeSpan.textContent = quantidade;

    const botaoRemover = document.createElement("button");
    botaoRemover.className = "botao botao-remover";
    botaoRemover.textContent = "✖";
    botaoRemover.setAttribute("aria-label", `Remover ${texto}`);

    conteudo.appendChild(textoItem);
    conteudo.appendChild(quantidadeSpan);

    item.appendChild(checkbox);
    item.appendChild(conteudo);
    item.appendChild(botaoRemover);

    return { elemento: item, checkbox, botaoRemover };
  },

  atualizarContadores() {
    const total = elementos.lista.children.length;
    const comprados = elementos.lista.querySelectorAll(".lista-itens__item--comprado").length;
    
    elementos.totalItens.textContent = `${total} ${total === 1 ? 'item' : 'itens'}`;
    elementos.itensComprados.textContent = `${comprados} comprado${comprados !== 1 ? 's' : ''}`;
  },

  adicionar(texto, quantidade, comprado = false) {
    if (!Validacao.item(texto) || !Validacao.quantidade(quantidade)) return;

    const { elemento, checkbox, botaoRemover } = this.criar(texto, quantidade, comprado);

    checkbox.addEventListener("change", () => {
      elemento.classList.toggle("lista-itens__item--comprado", checkbox.checked);
      Armazenamento.salvar();
      this.atualizarContadores();
    });

    botaoRemover.addEventListener("click", () => {
      elementos.lista.removeChild(elemento);
      Armazenamento.salvar();
      this.atualizarContadores();
      Notificacao.mostrar("Item removido com sucesso");
    });

    elementos.lista.appendChild(elemento);
    Armazenamento.salvar();
    this.atualizarContadores();
    Notificacao.mostrar("Item adicionado com sucesso");
  },

  limpar() {
    if (elementos.lista.children.length > 0) {
      if (confirm("Tem certeza que deseja limpar toda a lista?")) {
        elementos.lista.innerHTML = "";
        Armazenamento.limpar();
        Armazenamento.salvar();
        this.atualizarContadores();
        Notificacao.mostrar("Lista limpa com sucesso");
      }
    }
  },
};

// ===== GERENCIAMENTO DE TEMA =====
const GerenciadorTema = {
  temaAtual: localStorage.getItem(CONSTANTES.CHAVE_TEMA) || "claro",

  alternar() {
    this.temaAtual = this.temaAtual === "claro" ? "escuro" : "claro";
    document.documentElement.setAttribute("data-tema", this.temaAtual);
    localStorage.setItem(CONSTANTES.CHAVE_TEMA, this.temaAtual);
    this.atualizarIcone();
  },

  atualizarIcone() {
    elementos.iconeTema.textContent = this.temaAtual === "claro" ? "🌙" : "☀️";
  },

  inicializar() {
    document.documentElement.setAttribute("data-tema", this.temaAtual);
    this.atualizarIcone();
    elementos.botaoTema.addEventListener("click", () => this.alternar());
  },
};

// ===== GERENCIAMENTO DE EVENTOS =====
const Eventos = {
  inicializar() {
    elementos.botaoAdicionar.addEventListener("click", () => this.adicionarItem());
    elementos.input.addEventListener("keydown", (evento) => this.teclaEnter(evento));
    elementos.inputQuantidade.addEventListener("keydown", (evento) => this.teclaEnter(evento));
    elementos.botaoLimpar.addEventListener("click", GerenciadorItens.limpar);
    elementos.botaoTopo.addEventListener("click", () => this.voltarAoTopo());
    window.addEventListener("scroll", () => this.verificarScroll());
    window.addEventListener("load", () => this.carregarLista());
    GerenciadorTema.inicializar();
  },

  adicionarItem() {
    const texto = elementos.input.value.trim();
    const quantidade = elementos.inputQuantidade.value;

    if (texto !== "") {
      GerenciadorItens.adicionar(texto, quantidade);
      elementos.input.value = "";
      elementos.inputQuantidade.value = "1";
      elementos.input.focus();
    }
  },

  teclaEnter(evento) {
    if (evento.key === "Enter") {
      evento.preventDefault();
      this.adicionarItem();
    }
  },

  voltarAoTopo() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  },

  verificarScroll() {
    if (window.scrollY > CONSTANTES.LIMITE_SCROLL) {
      elementos.botaoTopo.classList.add("visivel");
    } else {
      elementos.botaoTopo.classList.remove("visivel");
    }
  },

  carregarLista() {
    const itensSalvos = Armazenamento.carregar();
    itensSalvos.forEach((item) => {
      GerenciadorItens.adicionar(item.texto, item.quantidade, item.comprado);
    });

    GerenciadorItens.atualizarContadores();
    elementos.input.focus();
  },
};

// ===== INICIALIZAÇÃO =====
Eventos.inicializar();
