// ===== CONSTANTES =====
const CONSTANTES = {
  TAMANHO_MAXIMO_ITEM: 50,
  TEMPO_NOTIFICACAO: 3000,
  CHAVE_LOCAL_STORAGE: "listaDeCompras"
};

// ===== SELEÇÃO DE ELEMENTOS =====
const elementos = {
  input: document.querySelector("#input-item"),
  botaoAdicionar: document.querySelector("#btn-adicionar"),
  lista: document.querySelector("#lista-compras"),
  botaoLimpar: document.querySelector("#btn-limpar")
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
  }
};

// ===== VALIDAÇÃO =====
const Validacao = {
  item(texto) {
    if (texto.length > CONSTANTES.TAMANHO_MAXIMO_ITEM) {
      Notificacao.mostrar(
        `O item não pode ter mais de ${CONSTANTES.TAMANHO_MAXIMO_ITEM} caracteres`,
        "erro"
      );
      return false;
    }
    return true;
  }
};

// ===== GERENCIAMENTO DE ARMAZENAMENTO =====
const Armazenamento = {
  salvar() {
    try {
      const itens = Array.from(elementos.lista.querySelectorAll("li span")).map(
        (span) => span.textContent
      );
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
  }
};

// ===== GERENCIAMENTO DE ITENS =====
const GerenciadorItens = {
  criar(texto) {
    const item = document.createElement("li");
    item.className = "lista-itens__item item-adicionado";

    const textoItem = document.createElement("span");
    textoItem.className = "lista-itens__texto";
    textoItem.textContent = texto;

    const botaoRemover = document.createElement("button");
    botaoRemover.className = "botao botao-remover";
    botaoRemover.textContent = "✖";
    botaoRemover.setAttribute("aria-label", `Remover ${texto}`);

    item.appendChild(textoItem);
    item.appendChild(botaoRemover);

    return { elemento: item, botaoRemover };
  },

  adicionar(texto) {
    if (!Validacao.item(texto)) return;

    const { elemento, botaoRemover } = this.criar(texto);

    botaoRemover.addEventListener("click", () => {
      elementos.lista.removeChild(elemento);
      Armazenamento.salvar();
      Notificacao.mostrar("Item removido com sucesso");
    });

    elementos.lista.appendChild(elemento);
    Armazenamento.salvar();
    Notificacao.mostrar("Item adicionado com sucesso");
  },

  limpar() {
    if (elementos.lista.children.length > 0) {
      if (confirm("Tem certeza que deseja limpar toda a lista?")) {
        elementos.lista.innerHTML = "";
        Armazenamento.limpar();
        Armazenamento.salvar();
        Notificacao.mostrar("Lista limpa com sucesso");
      }
    }
  }
};

// ===== GERENCIAMENTO DE EVENTOS =====
const Eventos = {
  inicializar() {
    elementos.botaoAdicionar.addEventListener("click", this.adicionarItem);
    elementos.input.addEventListener("keydown", this.teclaEnter);
    elementos.botaoLimpar.addEventListener("click", GerenciadorItens.limpar);
    window.addEventListener("load", this.carregarLista);
  },

  adicionarItem() {
    const texto = elementos.input.value.trim();
    if (texto !== "") {
      GerenciadorItens.adicionar(texto);
      elementos.input.value = "";
      elementos.input.focus();
    }
  },

  teclaEnter(evento) {
    if (evento.key === "Enter") {
      this.adicionarItem();
    }
  },

  carregarLista() {
    const itensSalvos = Armazenamento.carregar();
    itensSalvos.forEach((texto) => {
      GerenciadorItens.adicionar(texto);
    });
  }
};

// ===== INICIALIZAÇÃO =====
Eventos.inicializar();
