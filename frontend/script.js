// SCRIPT DO SPRINT 01

// SCRIPT DO SPRINT 02 - Manter o que havia no SPRINT 01 e adicionar fluxo funcional

/*
=====================================================
script.js – Sprint 3 (incremental)
Mantém o Sprint 2 e adiciona persistência + conflitos
=====================================================
*/

/*
=======================================================
script.js – Sprint 4 (refatoração da API)
Remove localStorage (repo) e conecta ao backend Node.js
=======================================================
*/

/* TOAST (Igual Sprint 2) */
const $toast = document.getElementById('toast');
let __toastTimer = null;
function mostrarToast(mensagem, tipo = 'ok') {
    if (!$toast) { alert(mensagem); return; }

    $toast.classList.remove('warn', 'err', 'visivel');

    if (tipo === 'warn') $toast.classList.add('warn');
    if (tipo === 'err') $toast.classList.add('err');

    $toast.textContent = mensagem;
    void $toast.offsetWidth;
    $toast.classList.add('visivel');

    clearTimeout(__toastTimer);
    __toastTimer = setTimeout(() => $toast.classList.remove('visivel'), 2800);
}

/* 1) FUNÇÕES DO SPRINT 1 (mantidas) */
function abrirLogin() {
    const modal = document.getElementById('modalLogin');

    if (modal && typeof modal.showModal === 'function') modal.showModal();
    else mostrarToast('Modal não suportado neste navegador.', 'warn');
}
function rolarParaRapido() {
    const formRapido = document.querySelector('.formRapido');

    if (formRapido) formRapido.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

(function inicializarValidacao() {
    const form = document.querySelector('.formRapido');
    if (!form) return;

    const seletorRecurso = form.querySelector('select');
    const campoData = form.querySelector('input[type="date"]');
    const campoInicio = form.querySelector('input[placeholder="Início"]');
    const campoFim = form.querySelector('input[placeholder="Fim"]');

    [seletorRecurso, campoData, campoInicio, campoFim].forEach(el => {
        if (!el) return;

        el.addEventListener('input', () => el.style.borderColor = '');
        el.addEventListener('change', () => el.style.borderColor = '');
    });

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        let valido = true;

        if (seletorRecurso && seletorRecurso.selectedIndex === 0) { seletorRecurso.style.borderColor = 'red'; valido = false; }
        if (campoData && !campoData.value) { campoData.style.borderColor = 'red'; valido = false; }

        const hInicio = campoInicio?.value || '', hFim = campoFim?.value || '';

        if (!hInicio) { campoInicio.style.borderColor = 'red'; valido = false; }
        if (!hFim) { campoFim.style.borderColor = 'red'; valido = false; }
        if (hInicio && hFim && hFim <= hInicio) {
            mostrarToast('O horário final precisa ser maior que o horário inicial.', 'warn');
            campoInicio.style.borderColor = 'red';
            campoFim.style.borderColor = 'red';
            return;
        }
        if (!valido) { mostrarToast('Por favor, preencha todos os campos obrigatórios.', 'warn'); return; }
        mostrarToast('Reserva simulada com sucesso! (fluxo rápido/legado)');
        form.reset();
    });
})();

/* 2) AJUDANTES + ESTADO (Sprint 2 mantido) */
function dadosDoForm(form) { return Object.fromEntries(new FormData(form).entries()); }
let usuarioAtual = null;
let ultimoFiltroPesquisa = null;

/* 3) MENU ATIVO POR HASH (Sprint 2) */
const menuLinks = document.querySelectorAll('.menu a, header .acoesNav a');
function atualizarMenuAtivo() {
    const hash = location.hash || '#secLogin';
    menuLinks.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === hash ? 'true' : 'false'));
}
window.addEventListener('hashchange', atualizarMenuAtivo);
// SPRINT 4: A chamada inicial foi movida para o DOMContentLoaded
// document.addEventListener('DOMContentLoaded', atualizarMenuAtivo);

/* 4) SELETORES das seções */
const formLogin = document.getElementById('formLogin');
const formPesquisa = document.getElementById('formPesquisa');
const formSolicitar = document.getElementById('formSolicitar');
const listaReservas = document.getElementById('listaReservas');

/*
=================================================
SPRINT 3 – Regras novas (revisadas pelo SPRINT 4)
=================================================
*/

/* SPRINT 3: Adiciona 1h ao horário “HH:MM” para fim padrão */
// SPRINT 4: Mantido pois o backend aguarda (POST/api/reservas) espera a horaFim
function adicionar1Hora(hhmm) {
    const [h, m] = (hhmm || '00:00').split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0);
    d.setMinutes(d.getMinutes() + 60);
    return d.toTimeString().slice(0, 5);
}

/* SPRINT 3: Detecção de conflito (RN2). Não há conflito apenas quando um termina antes do outro começar. */
// SPRINT 4: Remove haConflito pois toda a lógica de verificação é responsabilidade do backend (reservaController.js)
// function haConflito({ recursoId, data, horaInicio, horaFim }) {
//     const existentes = repo.get(DB_KEYS.reservas)
//         .filter(r => r.recursoId === recursoId && r.data === data && r.status !== 'cancelada');
//     return existentes.some(r => !(r.horaFim <= horaInicio || r.horaInicio >= horaFim));
// }

/* SPRINT 3: Render a partir do “banco” (localStorage) */
// SPRINT 4: Remover renderItemReservaPersistida pois esta function foi substituída por renderItemReservaAPI, o formato dos dados mudou (vem da API com startAt, endAt e o objeto recurso)
// function renderItemReservaPersistida(r, recursosMap = null) {
//     if (!listaReservas) return;

//     const recursos = recursosMap || Object.fromEntries(repo.get(DB_KEYS.recursos).map(rr => [rr.id, rr.nome]));
//     const quando = `${r.data.split('-').reverse().join('/')} • ${r.horaInicio}–${r.horaFim}`;
//     const li = document.createElement('li');
//     const simbolo = r.status === 'aprovada' ? '✅' : r.status === 'cancelada' ? '❌' : '⏳';

//     li.innerHTML = `
//     <span><strong>${recursos[r.recursoId] || r.recursoId}</strong> — ${quando}</span>
//     <span>${simbolo} ${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
//   `;

//     if (r.status === 'cancelada') li.setAttribute('aria-disabled', 'true');

//     // Cancelamento “click to cancel” (didático)
//     li.addEventListener('click', () => {
//         if (r.status === 'cancelada') return;

//         r.status = 'cancelada';
//         repo.updateById(DB_KEYS.reservas, r.id, () => r);
//         li.lastElementChild.textContent = '❌ Cancelada';
//         li.setAttribute('aria-disabled', 'true');

//         mostrarToast('Reserva cancelada.', 'warn');
//     });

//     listaReservas.appendChild(li);
// }

// SPRINT 4: Nova função de renderização
function renderItemReservaAPI(reserva) {
    if (!listaReservas) return;

    // O backend (reservaController) já fez o JOIN via include
    const nomeRecurso = reserva.recurso?.nome || `Recurso #${reserva.recursoId}`;

    // Formatar as datas que vêm do banco usando timezone UTC
    const dataFormatada = new Date(reserva.startAt).toLocaleDateString('pt-br', { timeZone: 'UTC' });
    const horaInicio = new Date(reserva.startAt).toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    const horaFim = new Date(reserva.endAt).toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    const quando = `${dataFormatada} ! ${horaInicio}-${horaFim}`;
    const li = document.createElement('li');

    // O backend define o status ('pendente', 'aprovada', 'rejeitada')
    const simbolo = reserva.status === 'aprovada' ? 'caixa verificada' : (reserva.status === 'rejeitada' || reserva.status === 'cancelada') ? 'X cancela' : 'ampulheta';
    const statusFormatado = reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1);

    li.innerHTML = `
        <span><strong>${nomeRecurso}</strong> - ${quando}</span>
        <span>${simbolo} ${statusFormatado}</span>
    `;

    if (reserva.status === 'rejeitada' || reserva.status === 'cancelada') {
        li.setAttribute('aria-disabled', 'true');
    }

    listaReservas.appendChild(li);
}

/* 
================================================
FLUXO Sprint 2 (mantido) + persistência Sprint 3
================================================
*/

// LOGIN (Igual Sprint 2)
formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();

    const { usuario, senha } = dadosDoForm(formLogin);

    if (!usuario || (senha || '').length < 3) { mostrarToast('Usuário/senha inválidos (mín. 3 caracteres).', 'warn'); return; }

    const professor = /prof/i.test(usuario);
    usuarioAtual = { login: usuario, professor };

    mostrarToast(`Bem-vindo, ${usuarioAtual.login}!`);
    location.hash = '#secPesquisa';

    atualizarMenuAtivo();
});

/*
(b) PESQUISAR(igual Sprint 2 — só guardamos o id do recurso)
formPesquisa?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!usuarioAtual) { mostrarToast('Faça login antes de pesquisar.', 'warn'); location.hash = '#secLogin'; atualizarMenuAtivo(); return; }
    
    const { recurso, data, hora } = dadosDoForm(formPesquisa);
    
    if (!recurso || !data || !hora) { mostrarToast('Preencha recurso, data e horário.', 'warn'); return; }
    
    ultimoFiltroPesquisa = { recurso: Number(recurso), data, hora };
    const quando = new Date(`${data}T${hora}`).toLocaleString('pt-BR');
    
    mostrarToast(`Disponível: recurso ${recurso} em ${quando}.`);
    location.hash = '#secSolicitar';
    
    atualizarMenuAtivo();
});
*/


// TROCAR SPRINT 3 - CORREÇÃO DO CONFLITO
formPesquisa?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!usuarioAtual) {
        mostrarToast('Faça login antes de pesquisar.', 'warn');
        location.hash = '#secLogin';

        atualizarMenuAtivo();
        return;
    }

    const { recurso, data, hora } = dadosDoForm(formPesquisa);
    if (!recurso || !data || !hora) {
        mostrarToast('Preencha recurso, data e horário.', 'warn');
        return;
    }

    const recursoId = Number(recurso);
    const horaInicio = hora;
    const horaFim = adicionar1Hora(horaInicio);

    // SPRINT 4: Remove checagem de conflito na pesquisa
    // NOVO: Checa conflito na etapa de pesquisa
    // if (haConflito({ recursoId, data, horaInicio, horaFim })) {
    //     mostrarToast('Indisponível: já existe reserva nesse intervalo.', 'err');
    //     return;
    // }

    // Mantém seu fluxo normal quando estiver disponível
    ultimoFiltroPesquisa = { recurso: recursoId, data, hora };
    const quando = new Date(`${data}T${hora}`).toLocaleString('pt-BR');

    mostrarToast(`Disponível: recurso ${recursoId} em ${quando}.`);
    location.hash = '#secSolicitar';

    atualizarMenuAtivo();
});



// (c) SOLICITAR (Sprint 3: grava no storage + valida conflito)
// (c) SOLICITAR (Sprint 4: grava na API + valida no ba)
formSolicitar?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!usuarioAtual) { mostrarToast('Faça login antes de solicitar.', 'warn'); location.hash = '#secLogin'; atualizarMenuAtivo(); return; }
    if (!ultimoFiltroPesquisa) { mostrarToast('Pesquise a disponibilidade antes de solicitar.', 'warn'); location.hash = '#secPesquisa'; atualizarMenuAtivo(); return; }

    const { justificativa } = dadosDoForm(formSolicitar);

    if (!justificativa) { mostrarToast('Descreva a justificativa.', 'warn'); return; }

    // SPRINT 3: Monta objeto completo para persistir
    const recursoId = Number(ultimoFiltroPesquisa.recurso);
    const data = ultimoFiltroPesquisa.data;
    const horaInicio = ultimoFiltroPesquisa.hora;
    const horaFim = adicionar1Hora(horaInicio);

    // SPRINT 4: Remover verificação de conflito local
    // if (haConflito({ recursoId, data, horaInicio, horaFim })) {
    //     mostrarToast('Conflito: já existe reserva neste intervalo para este recurso.', 'err');
    //     return;
    // }

    // const status = usuarioAtual.professor ? 'aprovada' : 'pendente';

    // SPRINT 4: Envio para API
    // 1. Monta o objeto para a API (body da requisição)
    const dadosParaAPI = {
        recursoId,
        usuarioId: usuarioAtual.login,
        data,
        horaInicio,
        horaFim,
        justificativa
    };
    
    try {
        // 2. Chama a apiService (que faz 'fetch POST')
        const novaReserva = await api.createReserva(dadosParaAPI);
        
        // 3. Sucesso, o backend vai responder com 201 created
        mostrarToast("Reserva enviada para análise");
        formSolicitar.reset();
        location.hash = '#secHistorico';
        atualizarMenuAtivo;
        
        // 4. Recarrega o histórico da API - Substituir ren
        await carregarHistóricoUI();
    }
    catch (error) {
        mostrarToast(error.message, 'err');
    }
    
    // SPRINT 4: Removido nova e repo.push
    // const nova = {
    //     id: Date.now(),
    //     recursoId,
    //     usuarioId: usuarioAtual.login,
    //     data, horaInicio, horaFim,
    //     justificativa,
    //     status
    // };
    
    // repo.push(DB_KEYS.reservas, nova);
    
    // renderItemReservaPersistida(nova);
    // mostrarToast(status === 'aprovada' ? 'Reserva aprovada.' : 'Reserva enviada para análise.');

    // formSolicitar.reset();
    // location.hash = '#secHistorico';

    // atualizarMenuAtivo();
});

/* 5) ARRANQUE: Já feito em storage.js (seed/popular/carregar). Aqui mantemos apenas o destaque do menu na carga */

// document.addEventListener('DOMContentLoaded', atualizarMenuAtivo);

// CORREÇÃO SPRINT 3
document.addEventListener('DOMContentLoaded', () => {
    // 1 Garante que o seed e carregamentos básicos já ocorreram no storage.js
    if (typeof seedSeNecessario === 'function') seedSeNecessario();
    // 2 NOVO: Normaliza reservas antigas (migra campos e padroniza horas)
    if (typeof normalizarReservasAntigas === 'function') normalizarReservasAntigas();

    // 3 Atualiza menu (comportamento original)
    atualizarMenuAtivo();
});