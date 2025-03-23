const NUM_WORDS = 3;
const words = [
    { english: "Thread", translation: "Поток", sentence: "A single _____ can execute multiple tasks concurrently." },
    { english: "Establish", translation: "Установить", sentence: "We need to _____ a secure connection before transmitting data." },
    { english: "Dependency", translation: "Зависимость", sentence: "This project has a _____ on external libraries." },
    { english: "Utilize", translation: "Использовать", sentence: "Developers _____ various tools to optimize performance." },
    { english: "Junction", translation: "Соединение", sentence: "A network _____ connects multiple paths." },
    { english: "Within", translation: "Внутри", sentence: "The value is contained _____ the specified range." },
    { english: "Modify", translation: "Изменить", sentence: "You can _____ the settings from the control panel." },
    { english: "Exist", translation: "Существовать", sentence: "These records _____ in the database." },
    { english: "Restore", translation: "Восстановить", sentence: "We must _____ the backup files immediately." },
    { english: "Execute", translation: "Выполнить", sentence: "The program will _____ the given commands." },
    { english: "Transaction", translation: "Транзакция", sentence: "Each _____ is recorded in the ledger." },
    { english: "To handle", translation: "Обрабатывать", sentence: "We need a way _____ errors efficiently." },
    { english: "Separate", translation: "Разделять", sentence: "It is important to _____ logic from presentation." },
    { english: "Break", translation: "Прерывать", sentence: "You can _____ the loop using a condition." },
    { english: "Chunk", translation: "Фрагмент", sentence: "The data is processed in small _____." },
    { english: "Maintain", translation: "Поддерживать", sentence: "We should _____ clean code practices." },
    { english: "Queue", translation: "Очередь", sentence: "Tasks are processed in the order they enter the _____." },
    { english: "Completion", translation: "Завершение", sentence: "The _____ of the task triggered the next step." },
    { english: "Implements", translation: "Реализует", sentence: "This class _____ the required interface." },
    { english: "Inherit", translation: "Наследовать", sentence: "The subclass will _____ properties from the parent class." },
    { english: "Fetch", translation: "Извлекать", sentence: "We need to _____ the latest data from the server." },
    { english: "Rely", translation: "Полагаться", sentence: "We _____ on external services for authentication." },
    { english: "Explicitly", translation: "Явно", sentence: "The rules were _____ stated in the document." },
    { english: "Retrieve", translation: "Получать", sentence: "The function will _____ the requested resource." },
    { english: "Certain", translation: "Определённый", sentence: "We must ensure _____ conditions are met." },
    { english: "Occur", translation: "Происходить", sentence: "Errors may _____ during execution." },
    { english: "Inactive", translation: "Неактивный", sentence: "The user account remains _____." },
    { english: "So far", translation: "Пока что", sentence: "The results have been positive _____." },
    { english: "Fancy", translation: "Сложный", sentence: "The design is too _____ for a simple app." },
    { english: "Thrilled", translation: "В восторге", sentence: "The team was _____ with the project’s success." },
    { english: "Keep track", translation: "Отслеживать", sentence: "We need to _____ of all user activities." },
    { english: "That instance", translation: "Этот экземпляр", sentence: "We need to debug _____ to find the error." },
    { english: "Store", translation: "Хранить", sentence: "We will _____ the data securely." },
    { english: "Capabilities", translation: "Возможности", sentence: "The new feature extends the app's _____." },
    { english: "Handy", translation: "Удобный", sentence: "This tool is quite _____ for debugging." },
    { english: "Competitively", translation: "Конкурентоспособно", sentence: "Our app performs _____ in the market." },
    { english: "Define", translation: "Определить", sentence: "We must _____ the terms clearly." },
    { english: "Overview", translation: "Обзор", sentence: "The report provides an _____ of system performance." },
    { english: "Considerations", translation: "Соображения", sentence: "There are many _____ when building secure apps." },
    { english: "Affect", translation: "Влиять", sentence: "The new rules will _____ the overall performance." },
    { english: "Expand", translation: "Расширять", sentence: "The company plans to _____ its operations next year." },
    { english: "Restrict", translation: "Ограничивать", sentence: "We must _____ access to sensitive information." },
    { english: "Pipeline", translation: "Конвейер", sentence: "Data flows through the _____ for processing." },
    { english: "Performance", translation: "Производительность", sentence: "The system's _____ has improved significantly." },
    { english: "Though", translation: "Хотя", sentence: "He accepted the offer, _____ he had some doubts." },
    { english: "Recipient", translation: "Получатель", sentence: "The email was sent to the wrong _____." },
    { english: "Obey", translation: "Подчиняться", sentence: "All employees must _____ the company rules." },
    { english: "Capability", translation: "Возможность", sentence: "This software has the _____ to handle large data sets." },
    { english: "Omits", translation: "Пропускает", sentence: "The report _____ key details about the incident." },
    { english: "Statement", translation: "Оператор", sentence: "The SQL _____ retrieves data from the database." },
    { english: "Whether or", translation: "Или", sentence: "I don’t know _____ not he will come." },
    { english: "Obtain", translation: "Получать", sentence: "You need permission to _____ the files." },
    { english: "Matter", translation: "Дело", sentence: "It’s a serious _____ that needs attention." },
    { english: "Overall", translation: "В целом", sentence: "The _____ results were quite positive." },
    { english: "Circular", translation: "Циклический", sentence: "The _____ queue efficiently handles data flow." },
    { english: "Claim", translation: "Утверждать", sentence: "She made a bold _____ about the project's success." },
    { english: "Found", translation: "Найденный", sentence: "The missing document was finally _____." },
    { english: "Perform", translation: "Выполнять", sentence: "The robot can _____ complex tasks." },
    { english: "Manage", translation: "Управлять", sentence: "He knows how to _____ his time effectively." },
    { english: "Acts", translation: "Действия", sentence: "Her _____ of kindness were appreciated." },
    { english: "Furthermore", translation: "Кроме того", sentence: "The report is accurate; _____, it’s well-written." },
    { english: "Impact", translation: "Воздействие", sentence: "The new policy will _____ the company’s growth." },
    { english: "Perspective", translation: "Перспектива", sentence: "Try to see the situation from a different _____." },
    { english: "Straightforward", translation: "Простой", sentence: "The solution was surprisingly _____." },
    { english: "Assume", translation: "Предполагать", sentence: "Don’t _____ things without proof." },
    { english: "Generic", translation: "Обобщённый", sentence: "He used a _____ design for the interface." },
    { english: "Arguably", translation: "Возможно", sentence: "She is _____ the best player on the team." },
    { english: "Designated", translation: "Назначенный", sentence: "He was the _____ spokesperson for the group." },
    { english: "Vulnerability", translation: "Уязвимость", sentence: "The software had a critical security _____." },
    { english: "Assess", translation: "Оценивать", sentence: "The team will _____ the project’s progress." },
    { english: "Alter", translation: "Изменить", sentence: "You can _____ the document if needed." },
    { english: "Violation", translation: "Нарушение", sentence: "Parking here is a _____ of the rules." },
    { english: "Regardless", translation: "Несмотря ни на что", sentence: "We will proceed _____ of the outcome." },
    { english: "Intermingle", translation: "Смешиваться", sentence: "The colors began to _____ in the painting." },
    { english: "Tricky", translation: "Хитрый", sentence: "The puzzle was quite _____ to solve." },
    { english: "Agile", translation: "Гибкий", sentence: "She is both strong and _____." },
    { english: "Dedicate", translation: "Посвятить", sentence: "He decided to _____ his life to science." },
    { english: "Disposable", translation: "Одноразовый", sentence: "We used _____ cups at the party." },
    { english: "Emphasize", translation: "Подчеркнуть", sentence: "I want to _____ the importance of teamwork." },
    { english: "Consequences", translation: "Последствия", sentence: "Every decision has _____." },
    { english: "Persist", translation: "Сохранить", sentence: "The error continued to _____ despite the fix." },
    { english: "In charge", translation: "Ответственный", sentence: "She is _____ of the entire operation." },
    { english: "Expose", translation: "Раскрыть", sentence: "The investigation will _____ the truth." },
    { english: "Efforts", translation: "Усилия", sentence: "His _____ paid off in the end." },
    { english: "Beforehead", translation: "Наперед", sentence: "We prepared the materials _____ of time." },
    { english: "Leverage", translation: "Використовувати", sentence: "We can _____ our experience to gain a competitive advantage." },
    { english: "Drives", translation: "Сприяє", sentence: "Innovation _____ progress in the technology industry." },
    { english: "Eager", translation: "Нетерплячий", sentence: "She is _____ to start her new job next week." },
    { english: "Reconciliation ", translation: "Погодження, примирення, улагодження", sentence: " _____ of duplicate data between the two systems" },
];

const words2 = [

]

let remainingWords = [...words];
let selectedEnglish = null;
let selectedTranslation = null;

let sentenceGameMode = false;

const toggleSwitch = document.getElementById('toggleSwitch');

toggleSwitch.addEventListener('change', () => {
    sentenceGameMode = toggleSwitch.checked;
    loadWords();
});

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
    const selectedPairs = getRandomWords(NUM_WORDS, remainingWords);

    // Add English words
    selectedPairs.forEach(pair => {
        const englishLi = document.createElement('li');
        englishLi.textContent = sentenceGameMode ? pair.english +' (' + pair.translation + ')' : pair.english;
        englishLi.addEventListener('click', () => selectEnglish(englishLi, pair));
        englishList.appendChild(englishLi);
    });

    // Shuffle translations and add them
    const shuffledTranslations = shuffle(selectedPairs);
    shuffledTranslations.forEach(pair => {
        const translationLi = document.createElement('li');
        translationLi.textContent = sentenceGameMode ? pair.sentence : pair.translation;
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
