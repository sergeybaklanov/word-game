const studyPlan = [
    {
        day: 1,
        title: 'Старт: теперішні часи',
        focus: 'Present Tenses + перша порція базової лексики',
        tasks: [
            { type: 'grammar', topicId: 'present-tenses', label: '📘 Граматика: Теперішні часи' },
            { type: 'practice', categoryKey: 'words', label: '🎯 Практика: Загальна лексика' },
        ],
    },
    {
        day: 2,
        title: 'Минулі часи',
        focus: 'Past Simple, Continuous, Perfect, Perfect Continuous',
        tasks: [
            { type: 'grammar', topicId: 'past-tenses', label: '📘 Граматика: Минулі часи' },
            { type: 'practice', categoryKey: 'words', label: '🎯 Практика: Загальна лексика' },
        ],
    },
    {
        day: 3,
        title: 'Майбутні часи та плани',
        focus: 'will / going to / Future Continuous / Future Perfect + домовленості',
        tasks: [
            { type: 'grammar', topicId: 'future-tenses', label: '📘 Граматика: Майбутні часи' },
            { type: 'grammar', topicId: 'future-plans', label: '📘 Граматика: Майбутні плани' },
            { type: 'practice', categoryKey: 'words', label: '🎯 Практика: Загальна лексика' },
        ],
    },
    {
        day: 4,
        title: 'Дієслова стану та найчастіші плутанини',
        focus: 'Коли НЕ можна -ing + 4 пари часів, які плутають найбільше',
        tasks: [
            { type: 'grammar', topicId: 'stative-verbs', label: '📘 Граматика: Дієслова стану' },
            { type: 'grammar', topicId: 'tense-contrasts', label: '📘 Граматика: Контрасти часів' },
            { type: 'practice', categoryKey: 'words', label: '🎯 Практика: Загальна лексика' },
        ],
    },
    {
        day: 5,
        title: 'День повторення №1',
        focus: 'Закріплюємо всі часи — змішана практика + вправи ще раз',
        tasks: [
            { type: 'practice', categoryKey: 'mixed', label: '🎯 Змішана практика (усі категорії)' },
            { type: 'grammar', topicId: 'tense-contrasts', label: '📘 Повторити: Контрасти часів' },
            { type: 'tab', target: 'progress', label: '📊 Перевірити прогрес' },
        ],
    },
    {
        day: 6,
        title: 'Умовні речення',
        focus: 'Zero, First, Second, Third + Mixed conditional',
        tasks: [
            { type: 'grammar', topicId: 'conditionals', label: '📘 Граматика: Умовні речення' },
            { type: 'practice', categoryKey: 'infinitives', label: '🎯 Практика: Інфінітив (to + V)' },
        ],
    },
    {
        day: 7,
        title: 'Інфінітив з to',
        focus: 'Дієслова, що вимагають to-інфінітив',
        tasks: [
            { type: 'grammar', topicId: 'infinitives', label: '📘 Граматика: Інфінітив з «to»' },
            { type: 'practice', categoryKey: 'infinitives', label: '🎯 Практика: Інфінітив (to + V)' },
        ],
    },
    {
        day: 8,
        title: 'Непряма мова',
        focus: 'Backshift часів, зміна слів-маркерів, дієслова повідомлення',
        tasks: [
            { type: 'grammar', topicId: 'reported-speech', label: '📘 Граматика: Непряма мова' },
            { type: 'practice', categoryKey: 'gerund', label: '🎯 Практика: Герундій (-ing)' },
        ],
    },
    {
        day: 9,
        title: 'Герундій',
        focus: '-ing форма після дієслів і прийменників',
        tasks: [
            { type: 'grammar', topicId: 'gerund', label: '📘 Граматика: Герундій (-ing форма)' },
            { type: 'practice', categoryKey: 'gerund', label: '🎯 Практика: Герундій (-ing)' },
        ],
    },
    {
        day: 10,
        title: 'День повторення №2',
        focus: 'Пасивний стан + загальне закріплення',
        tasks: [
            { type: 'grammar', topicId: 'passive-voice', label: '📘 Граматика: Пасивний стан' },
            { type: 'practice', categoryKey: 'mixed', label: '🎯 Змішана практика (усі категорії)' },
            { type: 'tab', target: 'progress', label: '📊 Перевірити прогрес' },
        ],
    },
    {
        day: 11,
        title: 'Минулі звички та нездійснені наміри',
        focus: 'used to / would / was going to + wish / if only',
        tasks: [
            { type: 'grammar', topicId: 'past-habits', label: '📘 Граматика: Минулі звички та плани' },
            { type: 'grammar', topicId: 'wishes-regrets', label: '📘 Граматика: Побажання та жаль' },
            { type: 'practice', categoryKey: 'transitionWords', label: '🎯 Практика: Сполучні слова' },
        ],
    },
    {
        day: 12,
        title: 'Порівняння та фрази з GET',
        focus: 'Compare структури + найуживаніше дієслово в розмовній англійській',
        tasks: [
            { type: 'grammar', topicId: 'comparing', label: '📘 Граматика: Порівняння' },
            { type: 'grammar', topicId: 'get-phrases', label: '📘 Граматика: Фрази з GET' },
            { type: 'practice', categoryKey: 'transitionWords', label: '🎯 Практика: Сполучні слова' },
        ],
    },
    {
        day: 13,
        title: 'Сполучні слова',
        focus: 'Linking words — додавання, контраст, причина, наслідок, умова',
        tasks: [
            { type: 'grammar', topicId: 'transitionWords', label: '📘 Граматика: Сполучні слова (Linking Words)' },
            { type: 'practice', categoryKey: 'transitionWords', label: '🎯 Практика: Сполучні слова' },
        ],
    },
    {
        day: 14,
        title: 'Повний огляд граматики',
        focus: 'Перепройти вправи в найскладніших темах ще раз',
        tasks: [
            { type: 'grammar', topicId: 'conditionals', label: '📘 Повторити: Умовні речення' },
            { type: 'grammar', topicId: 'passive-voice', label: '📘 Повторити: Пасивний стан' },
            { type: 'grammar', topicId: 'reported-speech', label: '📘 Повторити: Непряма мова' },
            { type: 'practice', categoryKey: 'mixed', label: '🎯 Змішана практика (усі категорії)' },
        ],
    },
    {
        day: 15,
        title: 'Фінал',
        focus: 'Підсумкова змішана практика та перевірка всього прогресу',
        tasks: [
            { type: 'practice', categoryKey: 'mixed', label: '🎯 Фінальна змішана практика' },
            { type: 'tab', target: 'progress', label: '📊 Підсумковий прогрес' },
        ],
    },
];

export default studyPlan;
