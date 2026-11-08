const grammarTopics = [
    {
        id: 'howToLearn',
        icon: '🧠',
        title: 'Як ефективно запам’ятовувати слова',
        summary: 'Ця гра побудована на методах, які наука визнає найефективнішими для довготривалого запам’ятовування.',
        rules: [
            'Інтервальне повторення (spaced repetition): слова, які ви плутаєте, з’являються частіше; вивчені — рідше. Саме тому «Залишилось» у практиці не обов’язково зменшується до нуля — це список слів, які варто повторити зараз.',
            'Активне пригадування (active recall): корисніше самому згадати переклад, ніж просто прочитати відповідь — тому гра завжди запитує вас, а не показує готову відповідь.',
            'Перемішування тем (interleaving): чергування різних категорій слів («Змішано») закріплює знання краще, ніж «зубріння» одного списку поспіль.',
            'Контекст має значення: режим «Речення» показує слово в реченні — так ви запам’ятовуєте не лише переклад, а й те, як слово вживається.',
            'Короткі щоденні сесії працюють краще за рідкісні довгі — звідси лічильник серії днів 🔥 у хедері.',
        ],
    },
    {
        id: 'infinitives',
        icon: '🎯',
        title: 'Інфінітив з «to»',
        category: 'infinitives',
        summary: 'Багато дієслів вимагають після себе інфінітив з часткою to (to + базова форма дієслова), а не герундій.',
        rules: [
            'Структура: дієслово + to + V1. Наприклад: She decided to leave.',
            'Типові дієслова: agree, decide, hope, plan, promise, want, manage, learn, refuse, seem, afford, offer, expect, intend.',
            'Інфінітив часто пояснює мету дії: She called to ask about the schedule (навіщо подзвонила — щоб запитати).',
            'Після прикметників: It is important to practice every day.',
            'Заперечення утворюється як not to + V1: He decided not to go.',
        ],
        examples: [
            { en: 'They managed to finish the project on time.', uk: 'Їм вдалося завершити проєкт вчасно.' },
            { en: 'I want to learn a new language.', uk: 'Я хочу вивчити нову мову.' },
            { en: 'She refused to answer the question.', uk: 'Вона відмовилася відповідати на питання.' },
        ],
    },
    {
        id: 'gerund',
        icon: '🔁',
        title: 'Герундій (-ing форма)',
        category: 'gerund',
        summary: 'Деякі дієслова та всі прийменники вимагають після себе герундій — форму на -ing, яка виконує роль іменника.',
        rules: [
            'Структура: дієслово/прийменник + V-ing. Наприклад: I enjoy reading.',
            'Типові дієслова: enjoy, avoid, consider, admit, finish, suggest, practice, mind, risk, give up, keep, dislike, delay.',
            'Герундій завжди йде після прийменника: good AT cooking, interested IN learning, instead OF waiting.',
            'Герундій може бути підметом речення: Learning English takes time and practice.',
        ],
        examples: [
            { en: 'She avoids eating too much sugar.', uk: 'Вона уникає вживання забагато цукру.' },
            { en: 'He is good at solving problems.', uk: 'Він добре вміє вирішувати проблеми.' },
            { en: 'They finished writing the report.', uk: 'Вони закінчили писати звіт.' },
        ],
        note: {
            title: 'Деякі дієслова можуть мати і те, і інше — але зі зміною значення',
            items: [
                'stop to do (зупинитися, щоб зробити) ≠ stop doing (перестати робити)',
                'remember to do (не забути зробити) ≠ remember doing (пам’ятати, що робив)',
                'try to do (докласти зусиль) ≠ try doing (спробувати як варіант)',
            ],
        },
    },
    {
        id: 'transitionWords',
        icon: '🔗',
        title: 'Сполучні слова (Linking Words)',
        category: 'transitionWords',
        summary: 'Сполучні слова з’єднують думки між реченнями й абзацами, показуючи логічний зв’язок: додавання, контраст, причину, наслідок тощо.',
        groups: [
            { name: 'Додавання', words: 'in addition, furthermore, besides, also', example: 'She speaks French. In addition, she speaks Spanish.' },
            { name: 'Контраст', words: 'however, although, whereas, despite', example: 'The house is small. However, it’s very cozy.' },
            { name: 'Причина', words: 'because, due to, owing to, for', example: 'The flight was canceled due to heavy fog.' },
            { name: 'Наслідок', words: 'therefore, as a result, consequently, thus', example: 'The strategy isn’t working. Therefore, we need a new approach.' },
            { name: 'Послідовність', words: 'first, then, afterward, finally', example: 'First, we need a plan. Then, we gather resources.' },
            { name: 'Приклад', words: 'for example, for instance, such as', example: 'I enjoy outdoor sports such as tennis and swimming.' },
            { name: 'Умова', words: 'if, unless, even if, provided that', example: 'Unless you hurry, we’ll be late.' },
            { name: 'Порівняння', words: 'similarly, likewise, in comparison', example: 'Paris has many museums. Similarly, London offers great culture.' },
        ],
    },
    {
        id: 'words',
        icon: '📚',
        title: 'Загальна лексика',
        category: 'words',
        summary: 'Слова та вирази без окремого граматичного правила — вивчайте їх у контексті речення, це найкраще закріплює значення.',
        rules: [
            'Звертайте увагу на частину мови: багато слів тут — дієслова (execute, retrieve) або іменники (dependency, pipeline), форма підказує, як вжити слово в реченні.',
            'Якщо слово плутається з іншим — спробуйте режим «Речення», щоб побачити його в контексті.',
        ],
    },
];

export default grammarTopics;
