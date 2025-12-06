const form = document.getElementById("formNovoAparelho");
const cancelarBtn = document.getElementById("cancelarBtn");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const novoAparelho = {
        marca: document.getElementById("marca").value.trim(),
        modelo: document.getElementById("modelo").value.trim(),
        imei: document.getElementById("imei").value.trim(),
        cor: document.getElementById("cor").value.trim(),
        defeito: document.getElementById("defeito").value.trim(),
        estadoFisico: document.getElementById("estadoFisico").value.trim()
    };

    // pegar lista existente
    let lista = JSON.parse(localStorage.getItem("aparelhos")) || [];

    // adicionar novo
    lista.push(novoAparelho);

    // salvar
    localStorage.setItem("aparelhos", JSON.stringify(lista));

    // retornar para listagem
    window.location.href = "aparelhos.html";
});

// cancelar = voltar
cancelarBtn.addEventListener("click", () => {
    window.location.href = "aparelhos.html";
});


// Opção de editar 
let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || [];
const indexEditando = localStorage.getItem("editandoAparelho");

// Carregar dados se estiver editando
if (indexEditando !== null) {
    const aparelho = aparelhos[indexEditando];

    document.getElementById("marca").value = aparelho.marca;
    document.getElementById("modelo").value = aparelho.modelo;
    document.getElementById("imei").value = aparelho.imei;
    document.getElementById("cor").value = aparelho.cor;
    document.getElementById("defeito").value = aparelho.defeito;
    document.getElementById("estadoFisico").value = aparelho.estadoFisico;
}

// Salvar
function salvarAparelho() {
    const novo = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        imei: document.getElementById("imei").value,
        cor: document.getElementById("cor").value,
        defeito: document.getElementById("defeito").value,
        estadoFisico: document.getElementById("estadoFisico").value,
    };

    if (indexEditando !== null) {
        // Atualizando existente
        aparelhos[indexEditando] = novo;
        localStorage.removeItem("editandoAparelho");
    } else {
        // Novo
        aparelhos.push(novo);
    }

    localStorage.setItem("aparelhos", JSON.stringify(aparelhos));
    window.location.href = "aparelhos.html";
}
