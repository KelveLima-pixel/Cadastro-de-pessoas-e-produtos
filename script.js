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

// Event Listener para capturar os dados do formulário
const cadastroForm = document.getElementById("cadastroForm");
const listaCadastro = document.getElementById("listaCadastro");

cadastroForm.addEventListener("submit", adicionarCadastro);

// Exibe os dados ao carregar a página
document.addEventListener("DOMContentLoaded", exibirCadastro);
