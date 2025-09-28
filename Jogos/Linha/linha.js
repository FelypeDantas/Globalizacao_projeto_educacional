// Base de eventos (título + ano). Você pode editar/adicionar mais.
const EVENTS = [
    { title: 'Invenção do telégrafo (Morse)', year: 1837 },
    { title: 'Invenção do telefone (Alexander Graham Bell)', year: 1876 },
    { title: 'Invenção do rádio (Marconi)', year: 1895 },
    { title: 'Primeira transmissão de televisão', year: 1927 },
    { title: 'Invenção do transistor', year: 1947 },
    { title: 'Primeiro microprocessador', year: 1971 },
    { title: 'Lançamento do IBM PC', year: 1981 },
    { title: 'Criação do ARPANET (origem da Internet)', year: 1969 },
    { title: 'Criação do e-mail (Ray Tomlinson)', year: 1971 },
    { title: 'Criação da World Wide Web (publicação)', year: 1991 },
    { title: 'Surgimento do comércio eletrônico popular (Amazon fundada)', year: 1994 },
    { title: 'Primeiro smartphone comercial (IBM Simon)', year: 1994 },
    { title: 'Lançamento do iPhone (surgimento dos smartphones modernos)', year: 2007 },
    { title: 'Lançamento do Android (plataforma móvel)', year: 2008 },
    { title: 'Popularização do termo "Computação em nuvem"', year: 2006 }
];

// Estado do jogo
let round = 1;
let score = 0;
let globalProgress = 0; // 0-100
let currentEvents = []; // eventos na rodada
let placed = []; // array de indices ou null

const chipsArea = document.getElementById('chipsArea');
const slotsArea = document.getElementById('slotsArea');
const checkBtn = document.getElementById('checkBtn');
const undoBtn = document.getElementById('undoBtn');
const nextBtn = document.getElementById('nextBtn');
const numEventsRange = document.getElementById('numEvents');
const numEventsLabel = document.getElementById('numEventsLabel');
const roundInfo = document.getElementById('roundInfo');
const roundProgressBar = document.getElementById('roundProgressBar');
const roundProgressText = document.getElementById('roundProgressText');
const messageArea = document.getElementById('messageArea');
const globalProgressEl = document.getElementById('globalProgress');
const scoreEl = document.getElementById('score');

numEventsRange.addEventListener('input', () => {
    numEventsLabel.textContent = numEventsRange.value;
});

function shuffle(arr) {
    let a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickRandomEvents(n) {
    const pool = EVENTS.slice();
    return shuffle(pool).slice(0, n);
}

function startRound() {
    const n = parseInt(numEventsRange.value, 10);
    currentEvents = pickRandomEvents(n);
    placed = Array(n).fill(null);
    renderChips();
    renderSlots();
    roundInfo.textContent = `Rodada ${round}`;
    updateRoundProgress();
    messageArea.textContent = 'Monte a sequência correta (do mais antigo para o mais recente).';
}

function renderChips() {
    chipsArea.innerHTML = '';
    const shuffled = shuffle(currentEvents);
    for (let i = 0; i < shuffled.length; i++) {
        const ev = shuffled[i];
        const btn = document.createElement('button');
        btn.className = 'chip';
        btn.tabIndex = 0;
        btn.textContent = ev.title;
        btn.dataset.year = ev.year;
        btn.dataset.title = ev.title;
        btn.addEventListener('click', () => {
            placeEvent(ev.title, ev.year, btn);
        });
        chipsArea.appendChild(btn);
    }
}

function renderSlots() {
    slotsArea.innerHTML = '';
    for (let i = 0; i < currentEvents.length; i++) {
        const s = document.createElement('div');
        s.className = 'slot';
        s.dataset.index = i;
        const label = document.createElement('div'); label.className = 'label'; label.textContent = `Posição ${i + 1}`;
        const title = document.createElement('div'); title.className = 'title'; title.textContent = placed[i]?.title ?? '';
        s.appendChild(label); s.appendChild(title);
        s.addEventListener('click', () => {
            // desfazer colocação
            if (placed[i]) {
                restoreChip(placed[i]);
                placed[i] = null;
                renderSlots();
                renderChips();
            }
        });
        slotsArea.appendChild(s);
    }
}

function placeEvent(title, year, btn) {
    const nextIdx = placed.findIndex(v => v === null);
    if (nextIdx === -1) return; // já cheio
    placed[nextIdx] = { title, year };
    // remover o chip clicado
    btn.remove();
    renderSlots();
    updateRoundProgress();
}

function restoreChip(ev) {
    // coloca de volta ao chipsArea; damos prioridade ao início
    // mas renderChips fará shuffle — para simplicidade, só renderiza chips novamente com os que ainda não colocados
}

function updateRoundProgress() {
    const filled = placed.filter(Boolean).length;
    const total = placed.length;
    roundProgressText.textContent = `Acertos: 0 / ${total}`; // until checked, acertos = 0
    const pct = Math.round((filled / total) * 100);
    roundProgressBar.style.width = pct + '%';
}

function checkAnswer() {
    // compare anos em ordem crescente
    const years = placed.map(p => p ? p.year : Infinity);
    // if any empty, prompt
    if (years.includes(Infinity)) {
        messageArea.textContent = 'Preencha todas as posições antes de verificar.';
        return;
    }

    // Determine correct order of currentEvents by year ascending
    const correctOrder = currentEvents.slice().sort((a, b) => a.year - b.year).map(e => e.title);
    let correctCount = 0;

    // Check each placed
    for (let i = 0; i < placed.length; i++) {
        const slot = slotsArea.children[i];
        slot.classList.remove('result-correct', 'result-wrong');
        const placedTitle = placed[i].title;
        if (placedTitle === correctOrder[i]) {
            slot.classList.add('result-correct');
            correctCount++;
        } else {
            slot.classList.add('result-wrong');
        }
    }

    // Update scores/progress
    score += correctCount;
    scoreEl.textContent = score;

    // Update global progress proportionally (each correct adds fraction of 100)
    const increment = Math.round((correctCount / currentEvents.length) * 100);
    globalProgress = Math.min(100, globalProgress + increment);
    globalProgressEl.style.width = globalProgress + '%';

    roundProgressText.textContent = `Acertos: ${correctCount} / ${currentEvents.length}`;
    roundProgressBar.style.width = Math.round((correctCount / currentEvents.length) * 100) + '%';

    if (correctCount === currentEvents.length) {
        messageArea.textContent = 'Perfeito! Todos corretos — parabéns!';
    } else {
        messageArea.textContent = `${correctCount} corretos — reveja os erros e avance quando quiser.`;
    }

}

function clearRound() {
    // retorna todos os chips e limpa slots
    placed = Array(currentEvents.length).fill(null);
    renderSlots();
    renderChips();
    roundProgressBar.style.width = '0%';
    roundProgressText.textContent = `Acertos: 0 / ${currentEvents.length}`;
    messageArea.textContent = 'Montagem limpa. Tente novamente.';
}

function nextRound() {
    round++;
    startRound();
}

checkBtn.addEventListener('click', checkAnswer);
undoBtn.addEventListener('click', clearRound);
nextBtn.addEventListener('click', nextRound);

// Inicializar
startRound();
