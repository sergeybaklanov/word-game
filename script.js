import vocabulary, { categoryLabels } from './vocabulary.js';
import grammarTopics from './grammar.js';
import grammarB2Topics from './grammar-b2.js';
import * as srs from './srs.js';

const SESSION_SIZE = 5;
const THEME_KEY = 'wordGameTheme';
const CATEGORY_ORDER = ['mixed', ...Object.keys(vocabulary)];
const categoryChipLabels = { mixed: 'Змішано (усі теми)', ...categoryLabels };

let currentCategoryKey = 'mixed';
let sentenceGameMode = false;
let sessionStreak = 0;
let selectedEnglish = null;
let selectedTranslation = null;

const categorySelectEl = document.getElementById('categorySelect');
const englishListEl = document.getElementById('englishWords');
const translationListEl = document.getElementById('translatedWords');
const wordsCountEl = document.getElementById('wordsInTheList');
const wordsLeftEl = document.getElementById('wordsLeft');
const sessionStreakEl = document.getElementById('sessionStreak');
const statusEl = document.getElementById('status');
const streakCountEl = document.getElementById('streakCount');
const themeToggleEl = document.getElementById('themeToggle');
const grammarListEl = document.getElementById('grammarList');
const progressListEl = document.getElementById('progressList');

function buildPool(key) {
    if (key === 'mixed') {
        return Object.keys(vocabulary).flatMap(catKey =>
            vocabulary[catKey].map(pair => ({ ...pair, _cat: catKey }))
        );
    }
    return vocabulary[key].map(pair => ({ ...pair, _cat: key }));
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function loadWords() {
    englishListEl.innerHTML = '';
    translationListEl.innerHTML = '';

    const pool = buildPool(currentCategoryKey);
    const selectedPairs = srs.pickSessionWords(pool, SESSION_SIZE);

    selectedPairs.forEach((pair, index) => {
        const li = document.createElement('li');
        li.textContent = sentenceGameMode ? `${pair.english} (${pair.translation})` : pair.english;
        li.style.gridRow = index + 1;
        li.addEventListener('click', () => selectEnglish(li, pair));
        englishListEl.appendChild(li);
    });

    shuffle([...selectedPairs]).forEach((pair, index) => {
        const li = document.createElement('li');
        li.textContent = sentenceGameMode ? pair.sentence : pair.translation;
        li.style.gridRow = index + 1;
        li.addEventListener('click', () => selectTranslation(li, pair));
        translationListEl.appendChild(li);
    });

    updateSessionBar();
}

function updateSessionBar() {
    const pool = buildPool(currentCategoryKey);
    const stats = srs.getCategoryStats(pool);

    wordsCountEl.textContent = stats.total;
    wordsLeftEl.textContent = stats.due;
    sessionStreakEl.textContent = sessionStreak;
    streakCountEl.textContent = srs.getStreak().count;

    statusEl.textContent = stats.due === 0
        ? 'Усі слова цієї категорії повторені! Можна продовжити практику заздалегідь. 🎉'
        : '';
}

function selectEnglish(element, pair) {
    clearSelections('englishWords');
    element.classList.add('selected');
    selectedEnglish = pair;
    checkMatch();
}

function selectTranslation(element, pair) {
    clearSelections('translatedWords');
    element.classList.add('selected');
    selectedTranslation = pair;
    checkMatch();
}

function checkMatch() {
    if (!(selectedEnglish && selectedTranslation)) return;

    const englishElement = document.querySelector('.left .selected');
    const translationElement = document.querySelector('.right .selected');
    const correct = selectedEnglish === selectedTranslation;

    srs.recordResult(selectedEnglish, correct);

    if (correct) {
        englishElement.classList.add('correct');
        translationElement.classList.add('correct');
        sessionStreak++;
        updateSessionBar();
        setTimeout(loadWords, 700);
    } else {
        englishElement.classList.add('wrong');
        translationElement.classList.add('wrong');
        sessionStreak = 0;
        updateSessionBar();
        setTimeout(() => {
            clearSelections('englishWords');
            clearSelections('translatedWords');
        }, 700);
    }

    selectedEnglish = null;
    selectedTranslation = null;
}

function clearSelections(columnId) {
    document.querySelectorAll(`#${columnId} .selected`).forEach(item => {
        item.classList.remove('selected', 'wrong', 'correct');
    });
}

function renderCategoryChips() {
    categorySelectEl.innerHTML = '';
    CATEGORY_ORDER.forEach(key => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `chip${key === currentCategoryKey ? ' active' : ''}`;
        chip.textContent = categoryChipLabels[key] || key;
        chip.addEventListener('click', () => {
            currentCategoryKey = key;
            renderCategoryChips();
            loadWords();
        });
        categorySelectEl.appendChild(chip);
    });
}

function wireModeToggle() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sentenceGameMode = btn.dataset.mode === 'sentence';
            loadWords();
        });
    });
}

function switchTab(name) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('hidden', view.id !== `view-${name}`));
    if (name === 'progress') renderProgress();
}

function wireTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
}

function wireTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const initial = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(initial);

    themeToggleEl.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    });
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggleEl.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function normalizeAnswer(str) {
    return str.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.,!?;:]+$/, '');
}

function isCorrectAnswer(input, answer) {
    const accepted = answer.split('/').map(normalizeAnswer);
    return accepted.includes(normalizeAnswer(input));
}

function checkExercise(item, input, feedback, answer) {
    const correct = isCorrectAnswer(input.value, answer);
    item.classList.remove('exercise-correct', 'exercise-wrong');
    item.classList.add(correct ? 'exercise-correct' : 'exercise-wrong');
    feedback.textContent = correct ? '✓ Правильно' : `✗ Правильна відповідь: ${answer.split('/')[0].trim()}`;
    return correct;
}

function buildExerciseBlock(exercises) {
    const wrap = document.createElement('div');
    wrap.className = 'exercise-block';

    const heading = document.createElement('div');
    heading.className = 'exercise-heading';
    heading.textContent = 'Практичні вправи';
    wrap.appendChild(heading);

    const checkers = exercises.map(ex => {
        const item = document.createElement('div');
        item.className = 'exercise-item';

        const sentenceEl = document.createElement('div');
        sentenceEl.className = 'exercise-sentence';
        const [before, after] = ex.sentence.split('____');
        sentenceEl.appendChild(document.createTextNode(before));
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'exercise-input';
        input.autocomplete = 'off';
        input.spellcheck = false;
        sentenceEl.appendChild(input);
        sentenceEl.appendChild(document.createTextNode(after ?? ''));
        item.appendChild(sentenceEl);

        if (ex.hint) {
            const hintEl = document.createElement('div');
            hintEl.className = 'exercise-hint';
            hintEl.textContent = `💡 ${ex.hint}`;
            item.appendChild(hintEl);
        }

        const feedback = document.createElement('div');
        feedback.className = 'exercise-feedback';
        item.appendChild(feedback);

        const runCheck = () => checkExercise(item, input, feedback, ex.answer);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') runCheck();
        });

        wrap.appendChild(item);
        return runCheck;
    });

    const actions = document.createElement('div');
    actions.className = 'exercise-actions';

    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'exercise-check-btn';
    checkBtn.textContent = 'Перевірити всі';

    const scoreEl = document.createElement('span');
    scoreEl.className = 'exercise-score';

    checkBtn.addEventListener('click', () => {
        const correctCount = checkers.filter(runCheck => runCheck()).length;
        scoreEl.textContent = `${correctCount} / ${checkers.length} правильно`;
    });

    actions.appendChild(checkBtn);
    actions.appendChild(scoreEl);
    wrap.appendChild(actions);

    return wrap;
}

function buildGrammarCard(topic) {
    const card = document.createElement('details');
    card.className = 'grammar-card';

    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="grammar-icon">${topic.icon || '📘'}</span><span>${topic.title}</span>`;
    card.appendChild(summary);

    const body = document.createElement('div');
    body.className = 'grammar-body';

    const p = document.createElement('p');
    p.className = 'grammar-summary';
    p.textContent = topic.summary;
    body.appendChild(p);

    if (topic.rules?.length) {
        const ul = document.createElement('ul');
        ul.className = 'grammar-rules';
        topic.rules.forEach(rule => {
            const li = document.createElement('li');
            li.textContent = rule;
            ul.appendChild(li);
        });
        body.appendChild(ul);
    }

    if (topic.groups?.length) {
        const grid = document.createElement('div');
        grid.className = 'grammar-groups';
        topic.groups.forEach(group => {
            const item = document.createElement('div');
            item.className = 'grammar-group';
            item.innerHTML = `<strong>${group.name}</strong><span class="grammar-group-words">${group.words}</span><em class="grammar-group-example">${group.example}</em>`;
            grid.appendChild(item);
        });
        body.appendChild(grid);
    }

    if (topic.examples?.length) {
        const exWrap = document.createElement('div');
        exWrap.className = 'grammar-examples';
        topic.examples.forEach(ex => {
            const exEl = document.createElement('div');
            exEl.className = 'grammar-example';
            exEl.innerHTML = `<span class="ex-en">${ex.en}</span><span class="ex-uk">${ex.uk}</span>`;
            exWrap.appendChild(exEl);
        });
        body.appendChild(exWrap);
    }

    if (topic.note) {
        const note = document.createElement('div');
        note.className = 'grammar-note';
        const noteTitle = document.createElement('strong');
        noteTitle.textContent = topic.note.title;
        note.appendChild(noteTitle);
        const noteList = document.createElement('ul');
        topic.note.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            noteList.appendChild(li);
        });
        note.appendChild(noteList);
        body.appendChild(note);
    }

    if (topic.exercises?.length) {
        body.appendChild(buildExerciseBlock(topic.exercises));
    }

    if (topic.category) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'grammar-practice-btn';
        btn.textContent = 'Практикувати ці слова →';
        btn.addEventListener('click', () => {
            currentCategoryKey = topic.category;
            renderCategoryChips();
            loadWords();
            switchTab('practice');
        });
        body.appendChild(btn);
    }

    if (topic.refPage) {
        const link = document.createElement('a');
        link.className = 'grammar-ref-link';
        link.href = `grammar-b2/${topic.refPage}`;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Докладніше: формули й таймлайни →';
        body.appendChild(link);
    }

    card.appendChild(body);
    return card;
}

function renderGrammar() {
    grammarListEl.innerHTML = '';

    const addGroupHeading = text => {
        const heading = document.createElement('div');
        heading.className = 'grammar-group-heading';
        heading.textContent = text;
        grammarListEl.appendChild(heading);
    };

    addGroupHeading('Лексика та основи');
    grammarTopics.forEach(topic => grammarListEl.appendChild(buildGrammarCard(topic)));

    addGroupHeading('Граматика B2');
    grammarB2Topics.forEach(topic => grammarListEl.appendChild(buildGrammarCard(topic)));
}

function pluralDays(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'день';
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'дні';
    return 'днів';
}

function renderProgress() {
    progressListEl.innerHTML = '';

    const streak = srs.getStreak();
    const streakCard = document.createElement('div');
    streakCard.className = 'progress-card progress-card--streak';
    streakCard.innerHTML = `
        <div class="progress-card-title">Серія днів практики</div>
        <div class="progress-streak-value">🔥 ${streak.count} ${pluralDays(streak.count)}</div>
    `;
    progressListEl.appendChild(streakCard);

    Object.keys(vocabulary).forEach(key => {
        const pool = buildPool(key);
        const stats = srs.getCategoryStats(pool);
        const percent = stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0;

        const card = document.createElement('div');
        card.className = 'progress-card';
        card.innerHTML = `
            <div class="progress-card-title">${categoryLabels[key] || key}</div>
            <div class="progress-bar"><div class="progress-bar-fill" style="width:${percent}%"></div></div>
            <div class="progress-card-meta">
                <span>${stats.mastered} / ${stats.total} вивчено</span>
                <span class="progress-due">${stats.due} на повторення</span>
            </div>
        `;
        progressListEl.appendChild(card);
    });
}

function initComponents() {
    wireTheme();
    renderCategoryChips();
    wireModeToggle();
    wireTabs();
    renderGrammar();
    loadWords();
}

initComponents();
