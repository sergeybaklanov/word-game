const words = [
    { english: "Thread", translation: "Поток" },
    { english: "Establish", translation: "Установить" },
    { english: "Dependency", translation: "Зависимость" },
    { english: "Utilize", translation: "Использовать" },
    { english: "Junction", translation: "Соединение" },
    { english: "Within", translation: "Внутри" },
    { english: "Modify", translation: "Изменить" },
    { english: "Exist", translation: "Существовать" },
    { english: "Restore", translation: "Восстановить" },
    { english: "Execute", translation: "Выполнить" },
    { english: "Transaction", translation: "Транзакция" },
    { english: "To handle", translation: "Обрабатывать" },
    { english: "Separate", translation: "Разделять" },
    { english: "Break", translation: "Прерывать" },
    { english: "Chunk", translation: "Фрагмент" },
    { english: "Maintain", translation: "Поддерживать" },
    { english: "Queue", translation: "Очередь" },
    { english: "Completion", translation: "Завершение" },
    { english: "Implements", translation: "Реализует" },
    { english: "Inherit", translation: "Наследовать" },
    { english: "Fetch", translation: "Извлекать" },
    { english: "Rely", translation: "Полагаться" },
    { english: "Explicitly", translation: "Явно" },
    { english: "Retrieve", translation: "Получать" },
    { english: "Certain", translation: "Определённый" },
    { english: "Occur", translation: "Происходить" },
    { english: "Inactive", translation: "Неактивный" },
    { english: "So far", translation: "Пока что" },
    { english: "Fancy", translation: "Сложный" },
    { english: "Thrilled", translation: "В восторге" },
    { english: "Keep track", translation: "Отслеживать" },
    { english: "That instance", translation: "Этот экземпляр" },
    { english: "Store", translation: "Хранить" },
    { english: "Capabilities", translation: "Возможности" },
    { english: "Handy", translation: "Удобный" },
    { english: "Competitively", translation: "Конкурентоспособно" },
    { english: "Define", translation: "Определить" },
    { english: "Overview", translation: "Обзор" },
    { english: "Considerations", translation: "Соображения" },
    { english: "Affect", translation: "Влиять" },
    { english: "Expand", translation: "Расширять" },
    { english: "Restrict", translation: "Ограничивать" },
    { english: "Pipeline", translation: "Конвейер" },
    { english: "Performance", translation: "Производительность" },
    { english: "Though", translation: "Хотя" },
    { english: "Recipient", translation: "Получатель" },
    { english: "Obey", translation: "Подчиняться" },
    { english: "Capability", translation: "Возможность" },
    { english: "Omits", translation: "Пропускает" },
    { english: "Statement", translation: "Оператор" },
    { english: "Whether or", translation: "Или" },
    { english: "Obtain", translation: "Получать" },
    { english: "Matter", translation: "Дело" },
    { english: "Overall", translation: "В целом" },
    { english: "Circular", translation: "Циклический" },
    { english: "Claim", translation: "Утверждать" },
    { english: "Found", translation: "Найденный" },
    { english: "Perform", translation: "Выполнять" },
    { english: "Manage", translation: "Управлять" },
    { english: "Acts", translation: "Действия" },
    { english: "Furthermore", translation: "Кроме того" },
    { english: "Impact", translation: "Воздействие" },
    { english: "Perspective", translation: "Перспектива" },
    { english: "Straightforward", translation: "Простой" },
    { english: "Assume", translation: "Предполагать" },
    { english: "Generic", translation: "Обобщённый" },
    { english: "Arguably", translation: "Возможно"},
    { english: "Designated", translation: "Назначенный"},
    { english: "Vulnerability", translation: "Уязвимость"},
    { english: "Assess", translation: "Оценивать"},
    { english: "Alter", translation: "Изменить"},
    { english: "Violation", translation: "Нарушение"},
    { english: "Regardless", translation: "Несмотря ни на что"},
    { english: "Intermingle", translation: "Смешиваться"},
    { english: "Tricky", translation: "Хитрый"},
    { english: "Agile", translation: "Гибкий"},
    { english: "Dedicate", translation: "Посвятить"},
    { english: "Disposable", translation: "Одноразовый"},
    { english: "Emphasize", translation: "Подчеркнуть"},
    { english: "Consequences", translation: "Последствия"},
    { english: "Persist", translation: "Сохранить"},
    { english: "In charge", translation: "Ответсвенный"},
    { english: "Expose", translation: "Раскрыть"},
    { english: "Expose", translation: "Раскрыть"},
    { english: "Efforts", translation: "Усилия"},
    { english: "Beforehead", translation: "Наперед"},
];

let remainingWords = [...words];
let selectedEnglish = null;
let selectedTranslation = null;

function loadWords() {
    const englishList = document.getElementById('englishWords');
    const translationList = document.getElementById('translatedWords');
    englishList.innerHTML = '';
    translationList.innerHTML = '';

    if (remainingWords.length === 0) {
        document.getElementById('status').textContent = "Game Over! You've matched all the words!";
        return;
    }

    // Select 10 random unique words
    const selectedPairs = getRandomWords(10, remainingWords);

    // Add English words
    selectedPairs.forEach(pair => {
        const englishLi = document.createElement('li');
        englishLi.textContent = pair.english;
        englishLi.addEventListener('click', () => selectEnglish(englishLi, pair));
        englishList.appendChild(englishLi);
    });

    // Shuffle translations and add them
    const shuffledTranslations = shuffle(selectedPairs);
    shuffledTranslations.forEach(pair => {
        const translationLi = document.createElement('li');
        translationLi.textContent = pair.translation;
        translationLi.addEventListener('click', () => selectTranslation(translationLi, pair));
        translationList.appendChild(translationLi);
    });
}

function getRandomWords(count, wordList) {
    return shuffle(wordList).slice(0, count);
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function selectEnglish(element, word) {
    clearSelections('englishWords');
    element.classList.add('selected');
    selectedEnglish = word;
    checkMatch();
}

function selectTranslation(element, word) {
    clearSelections('translatedWords');
    element.classList.add('selected');
    selectedTranslation = word;
    checkMatch();
}

function selectCorrectTranslation(word){
    clearSelections('translatedWords');
    
}

function checkMatch() {
    if (selectedEnglish && selectedTranslation) {
        const englishElement = document.querySelector('.left .selected');
        const translationElement = document.querySelector('.right .selected');
        
        if (selectedEnglish.english === selectedTranslation.english) {
            englishElement.classList.add('correct');
            translationElement.classList.add('correct');

            remainingWords = remainingWords.filter(
                word => word.english !== selectedEnglish.english
            );

            setTimeout(() => {
                englishElement.remove();
                translationElement.remove();

                loadWords();
            }, 1000);
        } else {
            englishElement.classList.add('wrong');
            translationElement.classList.add('wrong');
            setTimeout(() => {
                clearSelections('englishWords');
                clearSelections('translatedWords');
            }, 1000);
        }
        selectedEnglish = null;
        selectedTranslation = null;
    }
}

function clearSelections(columnId) {
    const selectedItems = document.querySelectorAll(`#${columnId} .selected`);
    selectedItems.forEach(item => {
        item.classList.remove('selected', 'wrong', 'correct');
    });
}

loadWords();
