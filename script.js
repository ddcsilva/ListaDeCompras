const input = document.querySelector("#input-item");
const botao = document.querySelector("#btn-adicionar");
const lista = document.querySelector("#lista-compras");
const botaoLimpar = document.querySelector("#btn-limpar");

function salvarLista() {
  const itens = [];
  const itensDOM = document.querySelectorAll("#lista-compras li span");

  itensDOM.forEach((span) => {
    itens.push(span.textContent);
  });

  localStorage.setItem("listaDeCompras", JSON.stringify(itens));

  botaoLimpar.style.display = lista.children.length > 0 ? "block" : "none";
}

function adicionarItem(texto) {
  const novoItem = document.createElement("li");
  const spanTexto = document.createElement("span");
  spanTexto.textContent = texto;

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "✖";
  btnRemover.classList.add("btn-remover");

  btnRemover.addEventListener("click", () => {
    lista.removeChild(novoItem);
    salvarLista();
  });

  novoItem.appendChild(spanTexto);
  novoItem.appendChild(btnRemover);
  lista.appendChild(novoItem);
  salvarLista();
}

botao.addEventListener("click", () => {
  const texto = input.value.trim();
  if (texto !== "") {
    adicionarItem(texto);
    input.value = "";
    input.focus();
  }
});

input.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    botao.click();
  }
});

botaoLimpar.addEventListener("click", () => {
  lista.innerHTML = "";
  localStorage.removeItem("listaDeCompras");
  salvarLista();
});

window.addEventListener("load", () => {
  const itensSalvos = JSON.parse(localStorage.getItem("listaDeCompras")) || [];

  itensSalvos.forEach((texto) => {
    adicionarItem(texto);
  });
});
