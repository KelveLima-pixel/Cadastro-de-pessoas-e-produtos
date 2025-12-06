// Selecionar elementos
const novoClienteBtn = document.getElementById("novoClienteBtn");
const clienteModal = document.getElementById("clienteModal");
const cancelarBtn = document.getElementById("cancelarBtn");
const clienteForm = document.getElementById("clienteForm");
const clientesTable = document.getElementById("clientesTable").querySelector("tbody");
const searchInput = document.getElementById("searchInput");

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let editIndex = null;   // null = cadastro novo / número = edição

// ---------------------------
// Renderizar tabela
// ---------------------------
function renderizarClientes(lista = clientes) {

  clientesTable.innerHTML = "";

  lista.forEach((cliente, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td>${cliente.email}</td>
      <td>${cliente.documento}</td>
      <td>
        <button class="acao-btn edit" onclick="editarCliente(${index})">
            <img src="imagens/pencil.png">
        </button>
        <button class="acao-btn delete" onclick="confirmarExclusao(${index})">
            <img src="imagens/trash-2.png">
        </button>
      </td>
    `;
    clientesTable.appendChild(row);
  });
}

// ---------------------------
// Abrir o modal
// ---------------------------
novoClienteBtn.addEventListener("click", () => {
  clienteForm.reset();
  editIndex = null;    // modo cadastro
  clienteModal.style.display = "flex";
});

// ---------------------------
// Fechar modal com o botão cancelar
// ---------------------------
cancelarBtn.addEventListener("click", () => {
  clienteModal.style.display = "none";
});

// ---------------------------
// Fechar modal clicando fora
// ---------------------------
window.addEventListener("click", (e) => {
  if (e.target === clienteModal) clienteModal.style.display = "none";
});

// ---------------------------
// Salvar cliente
// ---------------------------
clienteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const novo = {
    nome: document.getElementById("nome").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    email: document.getElementById("email").value.trim(),
    documento: document.getElementById("documento").value.trim(),
    observacoes: document.getElementById("observacoes").value.trim()
  };

  if (editIndex !== null) {
    clientes[editIndex] = novo;
  } else {
    clientes.push(novo);
  }

  localStorage.setItem("clientes", JSON.stringify(clientes));

  clienteModal.style.display = "none";
  renderizarClientes();
});

// ---------------------------
// Editar cliente
// ---------------------------
function editarCliente(index) {
  const c = clientes[index];
  editIndex = index;

  document.getElementById("nome").value = c.nome;
  document.getElementById("telefone").value = c.telefone;
  document.getElementById("email").value = c.email;
  document.getElementById("documento").value = c.documento;
  document.getElementById("observacoes").value = c.observacoes || "";

  clienteModal.style.display = "flex";
}

// ---------------------------
// Excluir cliente com janela de confirmação
// ---------------------------
let indexParaExcluir = null;
function garantirModalConfirmClientes() {
  let modal = document.getElementById("modalConfirmClientes");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "modalConfirmClientes";
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h3 id="mensagemConfirmacaoClientes">Tem certeza que deseja remover?</h3>
      <div class="buttons">
        <button id="btnConfirmarClientes" class="btn salvar">Sim</button>
        <button id="btnCancelarClientes" class="btn cancelar">Não</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btnConfirmarClientes").addEventListener("click", () => {
    if (indexParaExcluir === null) return;
    clientes.splice(indexParaExcluir, 1);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    renderizarClientes();
    modal.style.display = "none";
    indexParaExcluir = null;
  });

  document.getElementById("btnCancelarClientes").addEventListener("click", () => {
    modal.style.display = "none";
    indexParaExcluir = null;
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      indexParaExcluir = null;
    }
  });

  return modal;
}

function confirmarExclusao(index) {
  indexParaExcluir = index;
  const modal = garantirModalConfirmClientes();
  const cliente = clientes[index] || {};
  const descricao = cliente.nome ? `${cliente.nome}` : '';
  const mensagem = descricao ? `Tem certeza que deseja remover: ${descricao}?` : 'Tem certeza que deseja remover?';
  const msgEl = document.getElementById("mensagemConfirmacaoClientes");
  if (msgEl) msgEl.innerText = mensagem;
  modal.style.display = "flex";
}

// ---------------------------
// Pesquisa em tempo real
// ---------------------------
searchInput.addEventListener("keyup", () => {
  const termo = searchInput.value.toLowerCase();

  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(termo) ||
    c.telefone.toLowerCase().includes(termo) ||
    (c.email || "").toLowerCase().includes(termo) ||
    (c.documento || "").toLowerCase().includes(termo)
  );

  renderizarClientes(filtrados);
});

// Inicialização
renderizarClientes();
