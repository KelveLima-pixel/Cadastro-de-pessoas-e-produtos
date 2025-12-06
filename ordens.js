// Script para adicionar OS à lista automaticamente
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('os-form');
  const tbody = document.querySelector('#os-lista tbody');

  if (!form || !tbody) return;

  function getNextNumber() {
    const rows = tbody.querySelectorAll('tr').length;
    return String(rows + 1).padStart(4, '0');
  }

  function statusClass(status) {
    if (!status) return 'pendente';
    const s = status.toLowerCase();
    if (s.includes('and')) return 'andamento';
    if (s.includes('concl')) return 'concluido';
    if (s.includes('pend')) return 'pendente';
    return 'pendente';
  }

  function escapeHtml(text){
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Reindexa os números das OS na tabela (1..N)
  function reindexNumbers() {
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      const tdNum = row.querySelector('td');
      if (tdNum) tdNum.textContent = String(i + 1).padStart(4, '0');
    });
  }

  function updateStatusBadgeInRow(row, status) {
    const span = row.querySelector('.status-badge');
    if (!span) return;
    span.textContent = status || '';
    const cls = statusClass(status);
    span.className = `status-badge ${cls}`;
  }

  // Delegação de eventos para os botões dentro da tabela
  tbody.addEventListener('click', (e) => {
    const target = e.target;
    const tr = target.closest('tr');
    if (!tr) return;

    // Apagar
    if (target.classList && target.classList.contains('btn-delete')) {
      if (confirm('Confirma exclusão desta Ordem de Serviço?')) {
        tr.remove();
        reindexNumbers();
      }
      return;
    }

    // Editar
    if (target.classList && target.classList.contains('btn-edit')) {
      // preencher o formulário com os dados da linha, MAS não sobrescrever
      // campos que já possuem valor (o usuário pediu para não apagar nada)
      const fields = ['cliente','marca','aparelho','diagnostico','solucao','valor','rua','numero','bairro','referencia','cidade','estado','status','colaborador','prioridade','telefone','email','dataEntrada','dataSaida','observacoes'];
      fields.forEach(f => {
        const el = document.getElementById(`os-${f}`);
        const valueFromRow = tr.dataset[f] || '';
        if (!el) return;
        // só atribui se o campo do formulário estiver vazio
        const current = String(el.value || '').trim();
        if (current === '') {
          el.value = valueFromRow;
        }
      });

      // marcar que estamos editando esta linha
      form.dataset.editingId = tr.dataset.id;
      const submitBtn = form.querySelector('.btn-submit');
      if (submitBtn) submitBtn.textContent = 'Salvar Alterações';
      form.scrollIntoView({behavior: 'smooth'});
      return;
    }

    // Encaminhar
    if (target.classList && target.classList.contains('btn-forward')) {
      const colaborador = prompt('Informe o nome do colaborador para encaminhar:');
      if (colaborador) {
        tr.dataset.colaborador = colaborador;
        tr.dataset.status = 'Em andamento';
        updateStatusBadgeInRow(tr, 'Em andamento');
        alert('Ordem encaminhada para ' + colaborador);
      }
      return;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cliente = document.getElementById('os-cliente')?.value.trim() || '';
    const marca = document.getElementById('os-marca')?.value.trim() || '';
    const aparelho = document.getElementById('os-aparelho')?.value.trim() || '';
    const diagnostico = document.getElementById('os-diagnostico')?.value.trim() || '';
    const solucao = document.getElementById('os-solucao')?.value.trim() || '';
    const valor = document.getElementById('os-valor')?.value.trim() || '';
    const rua = document.getElementById('os-rua')?.value.trim() || '';
    const numero = document.getElementById('os-numero')?.value.trim() || '';
    const bairro = document.getElementById('os-bairro')?.value.trim() || '';
    const referencia = document.getElementById('os-referencia')?.value.trim() || '';
    const cidade = document.getElementById('os-cidade')?.value.trim() || '';
    const estado = document.getElementById('os-estado')?.value.trim() || '';
    const status = document.getElementById('os-status')?.value.trim() || '';
    const colaborador = document.getElementById('os-colaborador')?.value.trim() || '';
    const prioridade = document.getElementById('os-prioridade')?.value.trim() || '';
    const telefone = document.getElementById('os-telefone')?.value.trim() || '';
    const email = document.getElementById('os-email')?.value.trim() || '';
    const dataEntrada = document.getElementById('os-data-entrada')?.value || new Date().toISOString();
    const dataSaida = document.getElementById('os-data-saida')?.value || '';
    const observacoes = document.getElementById('os-observacoes')?.value.trim() || '';

    // Se estamos editando, atualizar a linha existente
    if (form.dataset.editingId) {
      const editingId = form.dataset.editingId;
      const row = tbody.querySelector(`tr[data-id="${editingId}"]`);
      if (row) {
        // Atualiza apenas os campos que foram preenchidos no formulário.
        const updatable = ['cliente','marca','aparelho','diagnostico','solucao','valor','rua','numero','bairro','referencia','cidade','estado','status','colaborador','prioridade','telefone','email','dataEntrada','dataSaida','observacoes'];
        updatable.forEach(key => {
          const el = document.getElementById(`os-${key}`);
          const val = el ? String(el.value || '').trim() : '';
          if (val !== '') {
            row.dataset[key] = val;
          }
        });

        // atualizar células visíveis apenas se houve novo valor
        const clienteCell = row.querySelector('.os-cliente');
        const newCliente = document.getElementById('os-cliente')?.value.trim() || '';
        if (clienteCell && newCliente !== '') clienteCell.textContent = newCliente;
        const newStatus = document.getElementById('os-status')?.value.trim() || '';
        if (newStatus !== '') updateStatusBadgeInRow(row, newStatus);
      }

      // limpar modo edição
      delete form.dataset.editingId;
      const submitBtn = form.querySelector('.btn-submit');
      if (submitBtn) submitBtn.textContent = 'Salvar OS';
      form.reset();
      document.getElementById('os-cliente')?.focus();
      return;
    }

    // criar nova linha
    const numeroOS = getNextNumber();
    const cls = statusClass(status);
    const dataStr = new Date(dataEntrada).toLocaleDateString();

    const tr = document.createElement('tr');
    tr.dataset.id = `os-${Date.now()}`;
    tr.dataset.cliente = cliente;
    if (marca) tr.dataset.marca = marca;
    tr.dataset.aparelho = aparelho;
    tr.dataset.diagnostico = diagnostico;
    tr.dataset.solucao = solucao;
    tr.dataset.valor = valor;
    tr.dataset.rua = rua;
    tr.dataset.numero = numero;
    tr.dataset.bairro = bairro;
    tr.dataset.referencia = referencia;
    tr.dataset.cidade = cidade;
    tr.dataset.estado = estado;
    tr.dataset.status = status;
    tr.dataset.colaborador = colaborador;
    tr.dataset.prioridade = prioridade;
    tr.dataset.telefone = telefone;
    tr.dataset.email = email;
    tr.dataset.dataEntrada = dataEntrada;
    tr.dataset.dataSaida = dataSaida;
    tr.dataset.observacoes = observacoes;

    tr.innerHTML = `
      <td>${escapeHtml(numeroOS)}</td>
      <td class="os-cliente">${escapeHtml(cliente)}</td>
      <td><span class="status-badge ${cls}">${escapeHtml(status)}</span></td>
      <td>${escapeHtml(dataStr)}</td>
      <td class="actions"><span class="ver-ordem">Ver Ordem</span></td>
    `;

    // adiciona ao final da tabela
    tbody.appendChild(tr);

    // opcional: limpar o formulário
    form.reset();

    // foco no primeiro campo
    document.getElementById('os-cliente')?.focus();
  });

  // Busca de CEP automática usando API ViaCEP
  // Busca em tempo real: pelo nome do cliente e pela marca
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.trim().toLowerCase();
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(row => {
        const clienteText = row.querySelector('.os-cliente')?.textContent.toLowerCase() || '';
        const marcaText = (row.dataset.marca || '').toLowerCase();
        const match = clienteText.includes(term) || marcaText.includes(term);
        row.style.display = match ? '' : 'none';
      });
    });
  }

  const cepInput = document.getElementById('os-cep');
  if (cepInput) {
    cepInput.addEventListener('blur', async () => {
      const cep = cepInput.value.trim().replace(/\D/g, ''); // remove tudo que não é número
      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            document.getElementById('os-rua').value = data.logradouro || '';
            document.getElementById('os-bairro').value = data.bairro || '';
            document.getElementById('os-cidade').value = data.localidade || '';
            document.getElementById('os-estado').value = data.uf || '';
          } else {
            alert('CEP não encontrado');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    });
  }

});
