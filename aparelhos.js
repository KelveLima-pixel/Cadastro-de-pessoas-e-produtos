// Selecionar elementos
const novoAparelhoBtn = document.getElementById("novoAparelhoBtn");
const aparelhoModal = document.getElementById("aparelhoModal");
const cancelarBtn = document.getElementById("cancelarBtn");
const aparelhoForm = document.getElementById("aparelhoForm");
const aparelhosTable = document.getElementById("aparelhosTable").querySelector("tbody");
const searchInput = document.getElementById("searchInput");

let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || [];
let editIndex = null;

// --------------------------------------------------
// Renderizar tabela
// --------------------------------------------------
function renderizarAparelhos(lista = aparelhos) {

  aparelhosTable.innerHTML = "";

  lista.forEach((aparelho, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${aparelho.marca}</td>
      <td>${aparelho.modelo}</td>
      <td>${aparelho.imei}</td>
      <td>${aparelho.cor}</td>
      <td>${aparelho.defeito}</td>
      <td>${aparelho.estadoFisico}</td>
      <td>
        <button class="acao-btn edit" onclick="editarAparelho(${index})">
            <img src="imagens/pencil.png">
        </button>
        <button class="acao-btn delete" onclick="confirmarExclusao(${index})">
            <img src="imagens/trash-2.png">
        </button>
      </td>
    `;
    aparelhosTable.appendChild(row);
  });
}

// --------------------------------------------------
// Abrir o modal
// --------------------------------------------------
novoAparelhoBtn.addEventListener("click", () => {
  aparelhoForm.reset();
  editIndex = null; 
  aparelhoModal.style.display = "flex";
});

// --------------------------------------------------
// Fechar modal com o botão cancelar
// --------------------------------------------------
cancelarBtn.addEventListener("click", () => {
  aparelhoModal.style.display = "none";
});

// --------------------------------------------------
// Fechar modal clicando fora
// --------------------------------------------------
window.addEventListener("click", (e) => {
  if (e.target === aparelhoModal) aparelhoModal.style.display = "none";
});

// --------------------------------------------------
// Salvar aparelho
// --------------------------------------------------
aparelhoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const novo = {
    marca: document.getElementById("marca").value.trim(),
    modelo: document.getElementById("modelo").value.trim(),
    imei: document.getElementById("imei").value.trim(),
    cor: document.getElementById("cor").value.trim(),
    defeito: document.getElementById("defeito").value.trim(),
    estadoFisico: document.getElementById("estadoFisico").value.trim()
  };

  if (editIndex !== null) {
    aparelhos[editIndex] = novo;
  } else {
    aparelhos.push(novo);
  }

  localStorage.setItem("aparelhos", JSON.stringify(aparelhos));

  aparelhoModal.style.display = "none";
  renderizarAparelhos();
});

// --------------------------------------------------
// Editar aparelho
// --------------------------------------------------
function editarAparelho(index) {
  const a = aparelhos[index];
  editIndex = index;

  document.getElementById("marca").value = a.marca;
  document.getElementById("modelo").value = a.modelo;
  document.getElementById("imei").value = a.imei;
  document.getElementById("cor").value = a.cor;
  document.getElementById("defeito").value = a.defeito;
  document.getElementById("estadoFisico").value = a.estadoFisico;

  aparelhoModal.style.display = "flex";
}

// ---------------------------
// Excluir aparelho com janela de confirmação (lógica unificada)
// ---------------------------
let indexParaExcluir = null;

function garantirModalConfirm() {
  let modal = document.getElementById("modalConfirm");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "modalConfirm";
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Tem certeza que deseja remover?</h3>
      <div class="buttons">
        <button id="btnConfirmar" class="btn salvar">Sim</button>
        <button id="btnCancelar" class="btn cancelar">Não</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // listeners seguros (adicionados uma vez)
  document.getElementById("btnConfirmar").addEventListener("click", () => {
    if (indexParaExcluir === null) return;
    aparelhos.splice(indexParaExcluir, 1);
    localStorage.setItem("aparelhos", JSON.stringify(aparelhos));
    renderizarAparelhos();
    modal.style.display = "none";
    indexParaExcluir = null;
  });

  document.getElementById("btnCancelar").addEventListener("click", () => {
    modal.style.display = "none";
    indexParaExcluir = null;
  });

  // fechar clicando fora do conteúdo
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
  const modal = garantirModalConfirm();
  const aparelho = aparelhos[index] || {};
  const descricao = aparelho.marca ? `${aparelho.marca} ${aparelho.modelo || ''}`.trim() : '';
  const mensagem = descricao ? `Tem certeza que deseja remover: ${descricao}?` : 'Tem certeza que deseja remover?';
  const msgEl = document.getElementById("mensagemConfirmacao");
  if (msgEl) msgEl.innerText = mensagem;
  modal.style.display = "flex";
}

// --------------------------------------------------
// Pesquisa em tempo real
// --------------------------------------------------
searchInput.addEventListener("keyup", () => {
  const termo = searchInput.value.toLowerCase();

  const filtrados = aparelhos.filter(a =>
    a.marca.toLowerCase().includes(termo) ||
    a.modelo.toLowerCase().includes(termo) ||
    a.imei.toLowerCase().includes(termo) ||
    a.cor.toLowerCase().includes(termo) ||
    a.defeito.toLowerCase().includes(termo) ||
    a.estadoFisico.toLowerCase().includes(termo)
  );

  renderizarAparelhos(filtrados);
});


// ===============================
// LÓGICA DO MODAL DE CONFIRMAÇÃO
// ===============================
let aparelhoParaExcluir = null; // Guarda o índice do aparelho que será deletado

function excluirAparelho(index) {
  aparelhoParaExcluir = index; // Guarda o item

  document.getElementById("mensagemConfirmacao").innerText =
    "Tem certeza que vai remover?"; // Mensagem do modal
  
  document.getElementById("modalConfirm").style.display = "flex"; // Abre o modal
}

document.getElementById("btnConfirmar").addEventListener("click", () => {
  aparelhos.splice(aparelhoParaExcluir, 1); // Remove do array
  localStorage.setItem("aparelhos", JSON.stringify(aparelhos)); // Atualiza LocalStorage
  renderizarAparelhos(); // Atualiza tabela
  document.getElementById("modalConfirm").style.display = "none"; // Fecha modal
  aparelhoParaExcluir = null; // Limpa variável
});

document.getElementById("btnCancelar").addEventListener("click", () => {
  document.getElementById("modalConfirm").style.display = "none"; // Fecha modal
  aparelhoParaExcluir = null; // Cancela exclusão
});


// ===============================
// RENDERIZA TUDO AO CARREGAR O SISTEMA
// ===============================
renderizarAparelhos(); // Monta a tabela ao iniciar