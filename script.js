const NUM_WORDS = 3;

const selectionMenu = document.querySelector('#selectionMenu');
const subminButton = document.querySelector('#submitWords');

const voc = Vocabulary.vocabulary;

init();

function init() {
	for (const key in voc) {
		const option = document.createElement('option');
		option.setAttribute('value', key);
		option.innerText = key;
		selectionMenu.appendChild(option);
	}
}

subminButton.addEventListener('onclick', submitWords());

function submitWords(){
	console.log(selectionMenu.value);	
}

let remainingWords = [];
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

loadWords();
