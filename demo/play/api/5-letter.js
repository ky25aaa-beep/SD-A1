//simplify code use plain js functions and remove unnecessary code

function normaliseWordList(rawList) {
    if (Array.isArray(rawList)) {
        return rawList;
    }

    if (rawList && Array.isArray(rawList.words)) {
        return rawList.words;
    }

    return [];
}

//generate a random 5 letter word from the list of words
var wordList = [];
function load_wordlist(){
    /* https://darkermango.github.io/5-Letter-words/words.json */
    /* fetch the word list from the url and store it in local storage */
    const storedWordList = localStorage.getItem("wordList");
    const parsedStoredWordList = storedWordList ? JSON.parse(storedWordList) : [];
    const normalisedStoredWordList = normaliseWordList(parsedStoredWordList);

    if (normalisedStoredWordList.length > 0) {
        wordList = normalisedStoredWordList;
        if (!Array.isArray(parsedStoredWordList) || (parsedStoredWordList.words && Array.isArray(parsedStoredWordList.words))) {
            localStorage.setItem("wordList", JSON.stringify(wordList));
        }
    } else {
        fetch("https://darkermango.github.io/5-Letter-words/words.json")
            .then(response => response.json())
            .then(data => {
                /* make global varaible wordList and store the data in it */
                wordList = normaliseWordList(data);
                /* store the word list in local storage */
                localStorage.setItem("wordList", JSON.stringify(wordList));
            })
            .catch(error => {
                console.error("Error fetching word list:", error);
            });
    }
}
load_wordlist();
console.log("Word list loaded:", wordList);



function GET_Random_Word() {
    const words = normaliseWordList(wordList);
    if (!words.length) {
        return "";
    }

    var temp_random_number = Math.floor(Math.random() * words.length);
    return words[temp_random_number];
}

function initialiseGame() {
    //generate a random 5 letter word from the list of words
    var random_word = GET_Random_Word();
    console.log("Random word: " + random_word);
    localStorage.setItem("random_word", random_word);
    localStorage.setItem("random_word_hash", btoa(random_word));
    var result = [];
    var result_known_positions = {};
    var result_unknown_positions = [];
    var known_unused_letters = [];
    var prev_guesses = [];

    localStorage.setItem("prev_guesses", JSON.stringify(prev_guesses));
    localStorage.setItem("result", JSON.stringify(result));
    localStorage.setItem("result_known_positions", JSON.stringify(result_known_positions));
    localStorage.setItem("result_unknown_positions", JSON.stringify(result_unknown_positions));
    localStorage.setItem("known_unused_letters", JSON.stringify(known_unused_letters));

    return random_word;
}

function GET_guess_result(guess) {
    /* if guess storage is blank initialise game */
    if (!localStorage.getItem("random_word")) {
        initialiseGame();
    }
    console.log("Guess: " + guess);
    var random_word = localStorage.getItem("random_word");
    var random_word_hash_storage = localStorage.getItem("random_word_hash");
    var random_word_hash = atob(random_word_hash_storage || "");

    if (random_word_hash !== random_word) {
        return;
    }

    var normalized_guess = (guess || '').toLowerCase();

    if (normalized_guess === random_word) {
        var result = ["correct"];
        var result_known_positions = { 0: normalized_guess.charAt(0), 1: normalized_guess.charAt(1), 2: normalized_guess.charAt(2), 3: normalized_guess.charAt(3), 4: normalized_guess.charAt(4) };
        var result_unknown_positions = [];
        localStorage.setItem("result", JSON.stringify(result));
        localStorage.setItem("result_known_positions", JSON.stringify(result_known_positions));
        localStorage.setItem("result_unknown_positions", JSON.stringify(result_unknown_positions));
        return;
    } else {
        var result = ["incorrect"];
        localStorage.setItem("result", JSON.stringify(result));
    }

    var result_known_positions = {};
    var result_unknown_positions = [];
    var known_unused_letters = JSON.parse(localStorage.getItem("known_unused_letters") || "[]");

    for (let i = 0; i < normalized_guess.length; i++) {
        var letter = normalized_guess.charAt(i);
        if (!random_word.includes(letter)) {
            if (!known_unused_letters.includes(letter)) {
                known_unused_letters.push(letter);
            }
        } else if (random_word.includes(letter)) {
            if (!result_unknown_positions.includes(letter)) {
                result_unknown_positions.push(letter);
            }
        }

        if (letter === random_word.charAt(i)) {
            result_known_positions[i] = letter;
            result_unknown_positions = result_unknown_positions.filter(item => item !== letter);
        }
    }

    localStorage.setItem("known_unused_letters", JSON.stringify(known_unused_letters));
    localStorage.setItem("result_known_positions", JSON.stringify(result_known_positions));
    localStorage.setItem("result_unknown_positions", JSON.stringify(result_unknown_positions));
}

/* function to reset the game if reset-button is pressed (reset session storage and reload the page) */
function resetGame() {
    localStorage.removeItem("random_word");
    localStorage.removeItem("random_word_hash");
    localStorage.removeItem("prev_guesses");
    localStorage.removeItem("result");
    localStorage.removeItem("result_known_positions");
    localStorage.removeItem("result_unknown_positions");
    localStorage.removeItem("known_unused_letters");
    location.reload();
}
