import vocabulary from './vocabulary.js';
const NUM_WORDS = 5;

const words2 = [

]

let remainingWords = [];
let selectedEnglish = null;
let selectedTranslation = null;

let sentenceGameMode = false;

const toggleSwitch = document.getElementById('toggleSwitch');
const dropdownContent = document.getElementById('dropdownContent');

toggleSwitch.addEventListener('change', () => {
    console.log('Toggle switch changed: ' + toggleSwitch.checked);
    sentenceGameMode = toggleSwitch.checked;
    loadWords();
});

dropdownContent.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        console.log('Selected option: ' + event.target.textContent);
        const selectedOption = event.target.textContent;
        remainingWords = [...vocabulary[selectedOption]];
    }
     loadWords();
});


function initComponents() {
    addOptionsToDropdown();
}

function loadWords() {
    console.log('Importing words:');
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
        englishLi.textContent = sentenceGameMode ? pair.english + ' (' + pair.translation + ')' : pair.english;
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

function selectCorrectTranslation(word) {
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

function addOptionsToDropdown() {
    for(const key in vocabulary) {
        console.log('Adding option: ' + key);
        const option = document.createElement('a');
        option.href = '#';
        option.textContent = key;
        dropdownContent.appendChild(option);
    }
}

initComponents();

