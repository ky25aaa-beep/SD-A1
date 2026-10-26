//simplify code use plain js functions and remove unnecessary code

// MDN Web Docs (2025) function declaration. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function (Accessed: 30 September 2026).
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
    /* Fetch the word list once, then reuse the cached copy on later visits. */
    // MDN Web Docs (2026) Window: localStorage property. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage (Accessed: 7 October 2026).
    // MDN Web Docs (2024) Storage: getItem() method. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem (Accessed: 7 October 2026).
    const storedWordList = localStorage.getItem("wordList");
    // MDN Web Docs (2026) JSON.parse(). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse (Accessed: 14 October 2026).
    const parsedStoredWordList = storedWordList ? JSON.parse(storedWordList) : [];
    const normalisedStoredWordList = normaliseWordList(parsedStoredWordList);
    // MDN Web Docs (2025) Document: getElementById() method. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById (Accessed: 30 September 2026).
    const statusRegion = document.getElementById("game-status");

    if (normalisedStoredWordList.length > 0) {
        wordList = normalisedStoredWordList;
        if (!Array.isArray(parsedStoredWordList) || (parsedStoredWordList.words && Array.isArray(parsedStoredWordList.words))) {
            localStorage.setItem("wordList", JSON.stringify(wordList));
        }
        if (statusRegion) statusRegion.textContent = "Word list loaded. The game is ready.";
    } else {
        if (statusRegion) statusRegion.textContent = "Loading the word list.";
        fetch("https://darkermango.github.io/5-Letter-words/words.json")
            .then(response => {
                // MDN Web Docs (2025) Template literals (Template strings). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals (Accessed: 30 September 2026).
                if (!response.ok) throw new Error(`Word list request failed: ${response.status}`);
                return response.json();
            })
            .then(data => {
                wordList = normaliseWordList(data);
                if (!wordList.length) throw new Error("The word list was empty or had an unsupported format.");
                localStorage.setItem("wordList", JSON.stringify(wordList));
                if (statusRegion) statusRegion.textContent = "Word list loaded. The game is ready.";
            })
            .catch(error => {
                console.error("Error fetching word list:", error);
                if (statusRegion) statusRegion.textContent = "The word list could not be loaded.";
                if (typeof display_message === "function") {
                    display_message("Word list unavailable", "The game could not load its word list. Check your internet connection, then refresh the page to try again.");
                }
            });
    }
}
load_wordlist();
// Learning reference for console debugging: Codecademy (2020), Learn JavaScript with Codecademy!, 30:38–31:14. https://www.youtube.com/watch?v=O8PlcR-4GRQ&t=1838s (Accessed: 26 October 2026).
console.log("Word list loaded:", wordList);



function GET_Random_Word() {
    const words = normaliseWordList(wordList);
    // MDN Web Docs (2025) Falsy. Available at: https://developer.mozilla.org/en-US/docs/Glossary/Falsy (Accessed: 14 October 2026).
    if (!words.length) {
        return "";
    }

    // MDN Web Docs (2025) Math.random(). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random (Accessed: 7 October 2026).
    // MDN Web Docs (2025) Math.floor(). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor (Accessed: 7 October 2026).
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
    localStorage.setItem("guess_statuses", JSON.stringify([]));

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
        localStorage.setItem("guess_statuses", JSON.stringify(["known", "known", "known", "known", "known"]));
        return;
    } else {
        var result = ["incorrect"];
        localStorage.setItem("result", JSON.stringify(result));
    }

    var result_known_positions = {};
    var result_unknown_positions = [];
    var known_unused_letters = JSON.parse(localStorage.getItem("known_unused_letters") || "[]");

    // Count how many times each letter appears in the secret word
    var secret_letter_counts = {};
    // MDN Web Docs (2026) for statement. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for (Accessed: 30 September 2026).
    for (let i = 0; i < random_word.length; i++) {
        let char = random_word.charAt(i);
        secret_letter_counts[char] = (secret_letter_counts[char] || 0) + 1;
    }

    // Array to temporarily keep track of statuses for this exact guess row
    var guess_statuses = new Array(5).fill("absent");

    // PASS 1: Identify all perfect Green matches first and consume their counts
    for (let i = 0; i < normalized_guess.length; i++) {
        let letter = normalized_guess.charAt(i);
        if (letter === random_word.charAt(i)) {
            result_known_positions[i] = letter;
            guess_statuses[i] = "known";
            secret_letter_counts[letter]--; // Subtract from available pool
        }
    }

    // PASS 2: Identify Yellow matches from the remaining available pool
    for (let i = 0; i < normalized_guess.length; i++) {
        // Skip if this spot was already solved as Green
        if (guess_statuses[i] === "known") continue;

        let letter = normalized_guess.charAt(i);

        // If the letter is in the secret word pool and has remaining instances left
        if (secret_letter_counts[letter] && secret_letter_counts[letter] > 0) {
            guess_statuses[i] = "unknown";
            // Store the letter in our list of misplaced letters if not already present
            if (!result_unknown_positions.includes(letter)) {
                // MDN Web Docs (2026) Array.prototype.push(). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push (Accessed: 14 October 2026).
                result_unknown_positions.push(letter);
            }
            secret_letter_counts[letter]--; // Subtract from pool
        } else {
            // Letter is either not in the word at all, or its count has run out
            guess_statuses[i] = "absent";
            if (!known_unused_letters.includes(letter)) {
                known_unused_letters.push(letter);
            }
        }
    }

    localStorage.setItem("known_unused_letters", JSON.stringify(known_unused_letters));
    localStorage.setItem("result_known_positions", JSON.stringify(result_known_positions));
    localStorage.setItem("result_unknown_positions", JSON.stringify(result_unknown_positions));
    localStorage.setItem("guess_statuses", JSON.stringify(guess_statuses));
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
    localStorage.removeItem("guess_statuses");
    localStorage.removeItem('confirmed_position_letters');
    location.reload();
}

document.getElementById("reset-button").addEventListener("click", resetGame);


