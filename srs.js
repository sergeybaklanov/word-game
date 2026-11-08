const STORAGE_KEY = 'wordGameSRS.v1';
const STREAK_KEY = 'wordGameStreak.v1';

const BOX_INTERVALS_MS = [
    0,                          // box 0: new or just missed -> due right away
    10 * 60 * 1000,             // box 1: 10 minutes
    24 * 60 * 60 * 1000,        // box 2: 1 day
    3 * 24 * 60 * 60 * 1000,    // box 3: 3 days
    7 * 24 * 60 * 60 * 1000,    // box 4: 7 days - considered "mastered"
];
const MASTERED_BOX = BOX_INTERVALS_MS.length - 1;

function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // localStorage unavailable (private mode etc.) - progress just won't persist
    }
}

let state = loadJSON(STORAGE_KEY, {});

function keyFor(pair) {
    return `${pair._cat}::${pair.english}::${pair.translation}`;
}

function entryFor(pair) {
    return state[keyFor(pair)];
}

export function isDue(pair) {
    const entry = entryFor(pair);
    return !entry || entry.dueAt <= Date.now();
}

export function getBox(pair) {
    return entryFor(pair)?.box ?? 0;
}

export function recordResult(pair, correct) {
    const key = keyFor(pair);
    const prevBox = state[key]?.box ?? 0;
    const box = correct ? Math.min(prevBox + 1, MASTERED_BOX) : 0;
    state[key] = {
        box,
        dueAt: Date.now() + BOX_INTERVALS_MS[box],
        lastResult: correct ? 'correct' : 'wrong',
    };
    saveJSON(STORAGE_KEY, state);
    touchStreak();
}

export function pickSessionWords(pool, count) {
    const now = Date.now();
    const withMeta = pool.map(pair => {
        const entry = entryFor(pair);
        return {
            pair,
            box: entry?.box ?? 0,
            dueAt: entry?.dueAt ?? 0,
        };
    });

    withMeta.sort((a, b) => {
        const aDue = a.dueAt <= now;
        const bDue = b.dueAt <= now;
        if (aDue !== bDue) return aDue ? -1 : 1;
        if (a.box !== b.box) return a.box - b.box;
        return a.dueAt - b.dueAt;
    });

    const frontSliceSize = Math.min(withMeta.length, Math.max(count * 3, count));
    const front = withMeta.slice(0, frontSliceSize);
    for (let i = front.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [front[i], front[j]] = [front[j], front[i]];
    }

    return front.slice(0, count).map(item => item.pair);
}

export function getCategoryStats(pool) {
    const now = Date.now();
    let due = 0;
    let mastered = 0;
    pool.forEach(pair => {
        const entry = entryFor(pair);
        if (!entry || entry.dueAt <= now) due++;
        if (entry && entry.box >= MASTERED_BOX) mastered++;
    });
    return { total: pool.length, due, mastered };
}

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

export function touchStreak() {
    const streak = loadJSON(STREAK_KEY, { count: 0, lastDate: null });
    const today = todayStr();
    if (streak.lastDate === today) return streak;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    streak.count = streak.lastDate === yesterday ? streak.count + 1 : 1;
    streak.lastDate = today;
    saveJSON(STREAK_KEY, streak);
    return streak;
}

export function getStreak() {
    return loadJSON(STREAK_KEY, { count: 0, lastDate: null });
}
