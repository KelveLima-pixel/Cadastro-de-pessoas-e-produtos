// Função para salvar os dados no localStorage
function salvarNoLocalStorage(dados) {
    // Obtém os dados armazenados no localStorage (caso existam)
    let cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    // Adiciona os novos dados à lista
    cadastros.push(dados);

    // Salva novamente os dados no localStorage
    localStorage.setItem("cadastros", JSON.stringify(cadastros));
}

// Função para exibir os dados armazenados no localStorage
function exibirCadastro() {
    // Obtém os dados armazenados no localStorage
    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    // Limpa a lista de exibição antes de adicionar os novos itens
    listaCadastro.innerHTML = "";

    // Cria um item de lista para cada cadastro e exibe
    cadastros.forEach((cadastro, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
           <strong>Cliente:</strong> ${cadastro.nome} <br>
           <strong>Contato:</strong> ${cadastro.contato} <br>
           <strong>Endereço:</strong> ${cadastro.endereco} <br>
           <strong>Marca do Produto:</strong> ${cadastro.marca} <br>
           <strong>Série do Produto:</strong> ${cadastro.serie} <br>
           <strong>Valor do Serviço:</strong> ${cadastro.valordoserviço} <br>
           <button onclick="editarCadastro(${index})">Editar</button>
           <button onclick="apagarCadastro(${index})">Apagar</button>
           `;
        listaCadastro.appendChild(li);
    });
}

// Função para editar um cadastro
function editarCadastro(index) {
    // Obtém os dados do localStorage
    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    // Preenche o formulário com os dados do cadastro selecionado
    document.getElementById("nomeCliente").value = cadastros[index].nome;
    document.getElementById("contatoCliente").value = cadastros[index].contato;
    document.getElementById("enderecoCliente").value = cadastros[index].endereco;
    document.getElementById("marcaProduto").value = cadastros[index].marca;
    document.getElementById("serieProduto").value = cadastros[index].serie;
    document.getElementById("valordoserviço").value = cadastros[index].valordoserviço;

    // Altera o evento do formulário para atualizar o cadastro
    cadastroForm.removeEventListener("submit", adicionarCadastro);
    cadastroForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        // Atualiza os dados do cadastro
        cadastros[index].nome = document.getElementById("nomeCliente").value;
        cadastros[index].contato = document.getElementById("contatoCliente").value;
        cadastros[index].endereco = document.getElementById("enderecoCliente").value;
        cadastros[index].marca = document.getElementById("marcaProduto").value;
        cadastros[index].serie = document.getElementById("serieProduto").value;
        cadastros[index].valordoserviço = document.getElementById("valordoserviço").value;

        // Salva os dados atualizados no localStorage
        localStorage.setItem("cadastros", JSON.stringify(cadastros));

        // Exibe os dados atualizados na lista
        exibirCadastro();

        // Limpa o formulário após a edição
        cadastroForm.reset();

        // Restaura o evento original de adicionar
        cadastroForm.removeEventListener("submit", arguments.callee);
        cadastroForm.addEventListener("submit", adicionarCadastro);
    });
}

// Função para apagar um cadastro
function apagarCadastro(index) {
    // Obtém os dados do localStorage
    const cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

    // Remove o cadastro selecionado
    cadastros.splice(index, 1);

    // Salva novamente os dados no localStorage
    localStorage.setItem("cadastros", JSON.stringify(cadastros));

    // Exibe os dados atualizados na lista
    exibirCadastro();
}

// Função para adicionar um novo cadastro
function adicionarCadastro(event) {
    event.preventDefault(); // Evita o recarregamento da página

    // Captura os dados do formulário
    const nomeCliente = document.getElementById("nomeCliente").value;
    const contatoCliente = document.getElementById("contatoCliente").value;
    const enderecoCliente = document.getElementById("enderecoCliente").value;
    const marcaProduto = document.getElementById("marcaProduto").value;
    const serieProduto = document.getElementById("serieProduto").value;
    const valordoserviçoProduto = document.getElementById("valordoserviço").value;

    // Criação do objeto de dados
    const dados = {
        nome: nomeCliente,
        contato: contatoCliente,
        endereco: enderecoCliente,
        marca: marcaProduto,
        serie: serieProduto,
        valordoserviço: valordoserviçoProduto
    };

    // Salva os dados no localStorage
    salvarNoLocalStorage(dados);

    // Exibe os dados na lista
    exibirCadastro();

    // Limpa o formulário após o envio
    cadastroForm.reset();
}

// Adaptação do código
// ----------- Gestão Financeira -----------

// Salvar transação no LocalStorage
function salvarTransacao(transacao) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    transacoes.push(transacao);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Exibir transações
function exibirTransacoes() {
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    const tabelaBody = document.querySelector("#tabelaFinanceira tbody");
    let saldo = 0;

    tabelaBody.innerHTML = "";

    transacoes.forEach(t => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${t.descricao}</td>
            <td>${t.tipo}</td>
            <td>R$ ${parseFloat(t.valor).toFixed(2)}</td>
        `;
        tabelaBody.appendChild(row);

        // Calcula saldo
        if (t.tipo === "receita") {
            saldo += parseFloat(t.valor);
        } else {
            saldo -= parseFloat(t.valor);
        }
    });

    document.getElementById("saldo").textContent = `Saldo: R$ ${saldo.toFixed(2)}`;
}

// Adicionar nova transação
function adicionarTransacao(event) {
    event.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const tipo = document.getElementById("tipo").value;
    const valor = document.getElementById("valor").value;

    const transacao = { descricao, tipo, valor };

    salvarTransacao(transacao);
    exibirTransacoes();

    document.getElementById("financeForm").reset();
}

// ----------- Gestão Financeira -----------

// Salvar transação no LocalStorage
function salvarTransacao(transacao) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    transacoes.push(transacao);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Exibir transações
function exibirTransacoes() {
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    const tabelaBody = document.querySelector("#tabelaFinanceira tbody");
    let saldo = 0;

    tabelaBody.innerHTML = "";

    transacoes.forEach((t, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${t.descricao}</td>
            <td class="${t.tipo}">${t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}</td>
            <td class="${t.tipo}">R$ ${parseFloat(t.valor).toFixed(2)}</td>
            <td><button onclick="apagarTransacao(${index})">❌</button></td>
        `;
        tabelaBody.appendChild(row);

        // Calcula saldo
        if (t.tipo === "receita") {
            saldo += parseFloat(t.valor);
        } else {
            saldo -= parseFloat(t.valor);
        }
    });

    // Atualiza saldo com cor
    const saldoElement = document.getElementById("saldo");
    saldoElement.textContent = `Saldo: R$ ${saldo.toFixed(2)}`;
    saldoElement.style.color = saldo >= 0 ? "limegreen" : "red";
}

// Adicionar nova transação
function adicionarTransacao(event) {
    event.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const tipo = document.getElementById("tipo").value;
    const valor = document.getElementById("valor").value;

    const transacao = { descricao, tipo, valor };

    salvarTransacao(transacao);
    exibirTransacoes();

    document.getElementById("financeForm").reset();
}

// Apagar transação
function apagarTransacao(index) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    transacoes.splice(index, 1);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
    exibirTransacoes();
}

// ----------- Gestão Financeira com Impostos -----------

// Salvar transação no LocalStorage
function salvarTransacao(transacao) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    transacoes.push(transacao);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Exibir transações
function exibirTransacoes() {
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    const tabelaBody = document.querySelector("#tabelaFinanceira tbody");
    let saldo = 0;

    tabelaBody.innerHTML = "";

    transacoes.forEach((t, index) => {
        let valorBruto = parseFloat(t.valor);
        let imposto = 0;
        let valorLiquido = valorBruto;

        if (t.tipo === "receita") {
            imposto = (valorBruto * t.imposto) / 100;
            valorLiquido = valorBruto - imposto;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${t.descricao}</td>
            <td class="${t.tipo}">${t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}</td>
            <td>R$ ${valorBruto.toFixed(2)}</td>
            <td>R$ ${imposto.toFixed(2)}</td>
            <td class="liquido">R$ ${valorLiquido.toFixed(2)}</td>
            <td><button onclick="apagarTransacao(${index})">❌</button></td>
        `;
        tabelaBody.appendChild(row);

        // Calcula saldo usando o valor líquido
        if (t.tipo === "receita") {
            saldo += valorLiquido;
        } else {
            saldo -= valorBruto;
        }
    });

    // Atualiza saldo com cor
    const saldoElement = document.getElementById("saldo");
    saldoElement.textContent = `Saldo: R$ ${saldo.toFixed(2)}`;
    saldoElement.style.color = saldo >= 0 ? "limegreen" : "red";
}

// Adicionar nova transação
function adicionarTransacao(event) {
    event.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const tipo = document.getElementById("tipo").value;
    const valor = document.getElementById("valor").value;
    const imposto = parseFloat(document.getElementById("imposto").value);

    const transacao = { descricao, tipo, valor, imposto };

    salvarTransacao(transacao);
    exibirTransacoes();

    document.getElementById("financeForm").reset();
}

// Apagar transação
function apagarTransacao(index) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    transacoes.splice(index, 1);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
    exibirTransacoes();
}

// Complemento
// Função para alternar abas
function abrirAba(abaId) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

    document.getElementById(abaId).classList.add("active");
    document.querySelector(`.tab-btn[onclick="abrirAba('${abaId}')"]`).classList.add("active");

    if (abaId === "historico") {
        exibirHistorico();
    }
}

// Exibir histórico financeiro
function exibirHistorico() {
    const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    const tabelaBody = document.querySelector("#tabelaHistorico tbody");

    tabelaBody.innerHTML = "";

    transacoes.forEach(t => {
        const data = new Date(t.data).toLocaleString("pt-BR"); // converte a data
        let valorBruto = parseFloat(t.valor);
        let imposto = t.tipo === "receita" ? (valorBruto * t.imposto)/100 : 0;
        let valorLiquido = t.tipo === "receita" ? valorBruto - imposto : valorBruto;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data}</td>
            <td>${t.descricao}</td>
            <td>${t.tipo}</td>
            <td>R$ ${valorBruto.toFixed(2)}</td>
            <td>R$ ${imposto.toFixed(2)}</td>
            <td>R$ ${valorLiquido.toFixed(2)}</td>
        `;
        tabelaBody.appendChild(row);
    });
}

// Modificar função adicionarTransacao para salvar a data
function adicionarTransacao(event) {
    event.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const tipo = document.getElementById("tipo").value;
    const valor = document.getElementById("valor").value;
    const imposto = parseFloat(document.getElementById("imposto").value);
    const data = new Date();

    const transacao = { descricao, tipo, valor, imposto, data };

    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    transacoes.push(transacao);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));

    exibirTransacoes();
    document.getElementById("financeForm").reset();
}

// Excluir transação
function apagarTransacao(index) {
    let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
    transacoes.splice(index, 1);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
    exibirTransacoes();
}

// Eventos
document.getElementById("financeForm").addEventListener("submit", adicionarTransacao);
document.addEventListener("DOMContentLoaded", exibirTransacoes);


// Eventos
document.getElementById("financeForm").addEventListener("submit", adicionarTransacao);
document.addEventListener("DOMContentLoaded", exibirTransacoes);


// Eventos
document.getElementById("financeForm").addEventListener("submit", adicionarTransacao);
document.addEventListener("DOMContentLoaded", exibirTransacoes);


// Eventos
document.getElementById("financeForm").addEventListener("submit", adicionarTransacao);
document.addEventListener("DOMContentLoaded", exibirTransacoes);


// Event Listener para capturar os dados do formulário
const cadastroForm = document.getElementById("cadastroForm");
const listaCadastro = document.getElementById("listaCadastro");

cadastroForm.addEventListener("submit", adicionarCadastro);

// Exibe os dados ao carregar a página
document.addEventListener("DOMContentLoaded", exibirCadastro);
