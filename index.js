/* app.js
   Funcionalidades:
   - seed de dados em localStorage
   - render de cards e tabela
   - busca em tempo real
   - delete de ordens
   - highlight do link ativo no sidebar
   - init de gráficos (Chart.js) se presente
*/

/* ---------- CONFIG / KEYS ---------- */
const STORAGE_KEYS = {
  ORDENS: 'sf_ordens',   // ordens de serviço
  PECAS:  'sf_pecas'     // peças/estoque (usado para cards)
};

/* ---------- HELPERS ---------- */
const qs  = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));

function read(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Erro lendo localStorage', e);
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Erro escrevendo localStorage', e);
  }
}
function escapeHtml(str) {
  return String(str || '').replace(/[&<>"'`=\/]/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'
  })[s]);
}

/* ---------- SEED (dados iniciais) ---------- */
function seedIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEYS.ORDENS)) {
    const sample = [
      { id: 101, cliente: "João Silva", aparelho: "Samsung A32", status: "Em reparo", data: "2025-10-07", valor: 300, tecnico: "Rafael", defeito: "Tela" },
      { id: 102, cliente: "Ana Souza", aparelho: "iPhone 11", status: "Concluído", data: "2025-10-07", valor: 450, tecnico: "Mariana", defeito: "Áudio" },
      { id: 103, cliente: "Pedro Lima", aparelho: "Redmi Note 10", status: "Aguardando peça", data: "2025-10-06", valor: 180, tecnico: "Rafael", defeito: "Conector" },
      { id: 104, cliente: "Kelve Lima", aparelho: "iPhone 11", status: "Concluído", data: "2025-09-30", valor: 220, tecnico: "Mariana", defeito: "Bateria" },
      { id: 105, cliente: "Dona Maria", aparelho: "iPhone 11", status: "Concluído", data: "2025-10-01", valor: 320, tecnico: "Rafael", defeito: "Tela" }
    ];
    write(STORAGE_KEYS.ORDENS, sample);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PECAS)) {
    const parts = [
      { codigo: 'T-SAM-A32', nome: 'Tela Samsung A32', quantidade: 2, preco: 120 },
      { codigo: 'B-IP11', nome: 'Bateria iPhone 11', quantidade: 5, preco: 60 },
      { codigo: 'C-HDMI', nome: 'Cabo HDMI 2m', quantidade: 40, preco: 20 }
    ];
    write(STORAGE_KEYS.PECAS, parts);
  }
}

/* ---------- RENDER CARDS ---------- */
function renderCards() {
  const ordens = read(STORAGE_KEYS.ORDENS, []);
  const pecas = read(STORAGE_KEYS.PECAS, []);

  // ordens em andamento (status != concluído)
  const andamento = ordens.filter(o => !/Concluído/i.test(o.status)).length;

  // concluídas hoje
  const todayStr = new Date().toISOString().slice(0,10);
  const concluidasHoje = ordens.filter(o => {
    if (!o.data) return false;
    const d = (new Date(o.data)).toISOString().slice(0,10);
    return d === todayStr && /Concluído/i.test(o.status);
  }).length;

  // peças em falta (threshold <= 3)
  const pecasEmFalta = pecas.filter(p => Number(p.quantidade || 0) <= 3).length;

  // lucro do mês (soma valores de ordens concluídas do mês atual)
  const now = new Date();
  const lucroMes = ordens.reduce((acc, o) => {
    if (!o.data) return acc;
    const d = new Date(o.data);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && /Concluído/i.test(o.status)) {
      return acc + (Number(o.valor) || 0);
    }
    return acc;
  }, 0);

  // mapear para elementos existentes (verifica presença)
  const cardEls = qsa('.cards-container .card');
  if (cardEls.length >= 4) {
    // assume a ordem do HTML: andamento, concluídas, peças, lucro
    cardEls[0].querySelector('p').textContent = andamento;
    cardEls[1].querySelector('p').textContent = concluidasHoje;
    cardEls[2].querySelector('p').textContent = pecasEmFalta;
    cardEls[3].querySelector('p').textContent = `R$ ${lucroMes.toFixed(2).replace('.', ',')}`;
  } else {
    // tenta selecionar por classes auxiliares
    const elAnd = qs('.card.andamento p');
    if (elAnd) elAnd.textContent = andamento;
    const elCon = qs('.card.concluidas p');
    if (elCon) elCon.textContent = concluidasHoje;
    const elPec = qs('.card.pecas p');
    if (elPec) elPec.textContent = pecasEmFalta;
    const elLuc = qs('.card.lucro p');
    if (elLuc) elLuc.textContent = `R$ ${lucroMes.toFixed(2).replace('.', ',')}`;
  }
}

/* ---------- RENDER TABELA ---------- */
function renderTable() {
  const ordens = read(STORAGE_KEYS.ORDENS, []);
  const tbody = qs('.table table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  ordens.forEach(o => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${escapeHtml(o.id)}</td>
      <td>${escapeHtml(o.cliente)}</td>
      <td>${escapeHtml(o.aparelho)}</td>
      <td class="status-cell">${escapeHtml(o.status)}</td>
      <td>${escapeHtml(o.data)}</td>
      <td class="acoes" data-id="${escapeHtml(o.id)}">
        <button class="acao-btn edit" title="Editar">✏️</button>
        <button class="acao-btn delete" title="Excluir">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/* ---------- BUSCA (filtro) ---------- */
function attachSearch() {
  const input = qs('.search-bar input') || qs('.topbar .search-bar input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const rows = qsa('.table table tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

/* ---------- AÇÕES NA TABELA (DELEÇÃO / EDIÇÃO BÁSICA) ---------- */
function attachTableActions() {
  const tbody = qs('.table table tbody');
  if (!tbody) return;

  tbody.addEventListener('click', (ev) => {
    const delBtn = ev.target.closest('.acao-btn.delete');
    if (delBtn) {
      const id = delBtn.closest('.acoes').dataset.id;
      if (confirm('Deseja realmente excluir a ordem #' + id + '?')) {
        deleteOS(id);
      }
      return;
    }

    const editBtn = ev.target.closest('.acao-btn.edit');
    if (editBtn) {
      const id = editBtn.closest('.acoes').dataset.id;
      // edição simples: prompt para alterar status (exemplo)
      const ordens = read(STORAGE_KEYS.ORDENS, []);
      const os = ordens.find(x => String(x.id) === String(id));
      if (!os) return;
      const novoStatus = prompt('Editar status da OS #' + id, os.status || '');
      if (novoStatus !== null) {
        os.status = novoStatus;
        write(STORAGE_KEYS.ORDENS, ordens);
        renderAll();
      }
    }
  });
}

function deleteOS(id) {
  let ordens = read(STORAGE_KEYS.ORDENS, []);
  ordens = ordens.filter(o => String(o.id) !== String(id));
  write(STORAGE_KEYS.ORDENS, ordens);
  renderAll();
}

/* ---------- HIGHLIGHT LINK ATIVO DO SIDEBAR ---------- */
function highlightActiveLink() {
  const links = qsa('.sidebar a');
  if (!links.length) return;
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    const li = a.closest('li');
    if (href === current || (href === '' && current === 'index.html')) {
      a.classList.add('active');
      if (li) li.classList.add('active');
    } else {
      a.classList.remove('active');
      if (li) li.classList.remove('active');
    }
  });
}

/* ---------- GRÁFICOS (Chart.js) ---------- */
let statusChart = null;
let lucroChart = null;

function initCharts() {
  // só inicializa se Chart for carregado
  if (typeof Chart === 'undefined') return;

  const ordens = read(STORAGE_KEYS.ORDENS, []);
  if (!ordens.length) return;

  // dados para gráfico de status (pizza/doughnut)
  const statusCounts = ordens.reduce((acc, o) => {
    const s = o.status || 'Outro';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const statusLabels = Object.keys(statusCounts);
  const statusData = statusLabels.map(l => statusCounts[l]);

  const ctxStatus = qs('#chart-status');
  if (ctxStatus) {
    if (statusChart) statusChart.destroy();
    statusChart = new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusData,
          backgroundColor: generateColors(statusLabels.length)
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // gráfico de lucro por mês (barra) — usa valores das ordens concluídas
  const lucroByMonth = ordens.reduce((acc, o) => {
    if (!o.data || !/Concluído/i.test(o.status)) return acc;
    const d = new Date(o.data);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    acc[key] = (acc[key] || 0) + (Number(o.valor) || 0);
    return acc;
  }, {});
  const meses = Object.keys(lucroByMonth).sort();
  const valores = meses.map(m => lucroByMonth[m]);

  const ctxLucro = qs('#chart-lucro');
  if (ctxLucro) {
    if (lucroChart) lucroChart.destroy();
    lucroChart = new Chart(ctxLucro, {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [{
          label: 'Lucro (R$)',
          data: valores,
          backgroundColor: generateColors(valores.length)
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}

function generateColors(n) {
  const palette = [
    '#4CAF50','#2196F3','#FFB300','#EF5350','#9C27B0','#00ACC1','#FF7043','#66BB6A',
    '#AB47BC','#5C6BC0','#29B6F6','#FFCA28'
  ];
  const out = [];
  for (let i=0;i<n;i++) out.push(palette[i % palette.length]);
  return out;
}

/* ---------- RENDER TUDO ---------- */
function renderAll() {
  renderCards();
  renderTable();
  initCharts();
}

/* ---------- INICIALIZAÇÃO ---------- */
function initApp() {
  seedIfEmpty();
  highlightActiveLink();
  renderAll();
  attachSearch();
  attachTableActions();

  // para redeclarar charts quando a janela for redimensionada (melhora responsividade)
  window.addEventListener('resize', () => {
    if (typeof Chart !== 'undefined') initCharts();
  });
}

/* start quando DOM pronto */
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});


