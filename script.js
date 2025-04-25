// ===== CONSTANTES =====
const CONSTANTES = {
  TAMANHO_MAXIMO_ITEM: 50,
  TEMPO_NOTIFICACAO: 3000,
  CHAVE_LOCAL_STORAGE: "listaDeCompras",
  CHAVE_TEMA: "temaListaCompras",
  CHAVE_NOME_USUARIO: "nomeUsuarioListaCompras",
  LIMITE_SCROLL: 300,
  DELAY_ANIMACAO: 100,
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
  modal: document.querySelector("#modal-nome"),
  inputNome: document.querySelector("#input-nome"),
  botaoSalvarNome: document.querySelector("#btn-salvar-nome"),
  nomeUsuario: document.querySelector("#nome-usuario"),
  botaoEditarNome: document.querySelector("#btn-editar-nome"),
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
    elementos.itensComprados.textContent = `${comprados} ${comprados === 1 ? 'comprado' : 'comprados'}`;
  },

  adicionar(texto, quantidade, comprado = false) {
    if (!Validacao.item(texto) || !Validacao.quantidade(quantidade)) return;

    // Verifica se o item já existe na lista (ignorando maiúsculas/minúsculas)
    const itemExistente = Array.from(elementos.lista.querySelectorAll('.lista-itens__texto'))
      .some(item => item.textContent.toLowerCase() === texto.toLowerCase());

    if (itemExistente) {
      Notificacao.mostrar("Este item já está na lista!", "erro");
      return;
    }

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

// ===== GERENCIAMENTO DE NOME DO USUÁRIO =====
const GerenciadorNome = {
  nomeAtual: localStorage.getItem(CONSTANTES.CHAVE_NOME_USUARIO) || "",

  capitalizar(nome) {
    return nome
      .trim()
      .toLowerCase()
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  },

  formatarPreposicao(nome) {
    // Lista de nomes femininos comuns que terminam em 'o' (exceções)
    const excecoesFemininas = ['margo', 'theo'];
    
    // Nomes que devem usar 'de' (começam com artigo)
    const comecaComArtigo = nome.toLowerCase().startsWith('o ') || nome.toLowerCase().startsWith('a ');
    if (comecaComArtigo) {
      return 'de';
    }

    const nomeLower = nome.toLowerCase();
    
    // Verifica exceções femininas
    if (excecoesFemininas.includes(nomeLower)) {
      return 'da';
    }
    
    // Regra geral: nomes terminados em 'a' são femininos (da)
    // Nomes terminados em 'o' são masculinos (do)
    // Outros casos usam 'de'
    const ultimaLetra = nomeLower.charAt(nomeLower.length - 1);
    
    if (ultimaLetra === 'a') {
      return 'da';
    } else if (ultimaLetra === 'o') {
      return 'do';
    }
    
    // Para outros casos, vamos usar uma lista de terminações comuns
    const terminacoesFemininas = ['ice', 'ise', 'ize', 'is', 'id', 'ain', 'een', 'een'];
    const terminacoesMasculinas = ['or', 'eu', 'us', 'un', 'im', 'el'];
    
    for (const terminacao of terminacoesFemininas) {
      if (nomeLower.endsWith(terminacao)) {
        return 'da';
      }
    }
    
    for (const terminacao of terminacoesMasculinas) {
      if (nomeLower.endsWith(terminacao)) {
        return 'do';
      }
    }
    
    // Caso não encontre um padrão claro, usa 'de'
    return 'de';
  },

  salvar(nome) {
    const nomeFormatado = nome.trim();
    if (!nomeFormatado) {
      elementos.inputNome.classList.add('erro');
      setTimeout(() => elementos.inputNome.classList.remove('erro'), 820);
      return false;
    }
    
    const nomeCapitalizado = this.capitalizar(nomeFormatado);
    this.nomeAtual = nomeCapitalizado;
    localStorage.setItem(CONSTANTES.CHAVE_NOME_USUARIO, nomeCapitalizado);
    this.atualizar();
    return true;
  },

  atualizar() {
    if (!this.nomeAtual) {
      elementos.nomeUsuario.textContent = "";
      return;
    }

    const preposicao = this.formatarPreposicao(this.nomeAtual);
    elementos.nomeUsuario.textContent = `${preposicao} ${this.nomeAtual}`;
    
    // Anima o nome ao atualizar
    elementos.nomeUsuario.style.opacity = '0';
    setTimeout(() => {
      elementos.nomeUsuario.style.opacity = '1';
      elementos.nomeUsuario.style.transform = 'translateY(0)';
    }, CONSTANTES.DELAY_ANIMACAO);
  },

  mostrarModal() {
    elementos.modal.classList.add("visivel");
    setTimeout(() => elementos.inputNome.focus(), CONSTANTES.DELAY_ANIMACAO);
  },

  esconderModal() {
    elementos.modal.classList.remove("visivel");
    elementos.inputNome.value = "";
  },

  inicializar() {
    if (!this.nomeAtual) {
      setTimeout(() => this.mostrarModal(), CONSTANTES.DELAY_ANIMACAO);
    } else {
      this.atualizar();
    }

    elementos.botaoSalvarNome.addEventListener("click", () => {
      const novoNome = elementos.inputNome.value;
      if (this.salvar(novoNome)) {
        this.esconderModal();
        Notificacao.mostrar("Nome salvo com sucesso! 👋");
      }
    });

    elementos.inputNome.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        elementos.botaoSalvarNome.click();
      }
    });

    elementos.inputNome.addEventListener("input", () => {
      elementos.inputNome.classList.remove('erro');
    });

    elementos.botaoEditarNome.addEventListener("click", () => {
      elementos.inputNome.value = this.nomeAtual;
      this.mostrarModal();
    });

    // Fecha o modal ao clicar fora
    elementos.modal.addEventListener("click", (evento) => {
      if (evento.target === elementos.modal) {
        this.esconderModal();
      }
    });

    // Fecha o modal com ESC
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && elementos.modal.classList.contains("visivel")) {
        this.esconderModal();
      }
    });
  },
};

// ===== GERENCIAMENTO DE EVENTOS =====
const Eventos = {
  inicializar() {
    elementos.botaoAdicionar.addEventListener("click", () => this.adicionarItem());
    elementos.input.addEventListener("keydown", (evento) => this.teclaEnter(evento));
    elementos.inputQuantidade.addEventListener("keydown", (evento) => this.teclaEnter(evento));
    elementos.botaoLimpar.addEventListener("click", () => GerenciadorItens.limpar());
    elementos.botaoTopo.addEventListener("click", () => this.voltarAoTopo());
    window.addEventListener("scroll", () => this.verificarScroll());
    window.addEventListener("load", () => this.carregarLista());
    GerenciadorTema.inicializar();
    GerenciadorNome.inicializar();
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
