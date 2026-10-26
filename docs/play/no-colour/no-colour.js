// old js is 5-letter.js new code for new system is 5-letter-game.js
// This file contains the JavaScript code for the 5-letter game functionality.


//Make Current guess underscore flashing inside the box my default current_guess is 1 
var current_guess_number = 1;
// MDN Web Docs (2025) Document: getElementById() method. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById (Accessed: 30 September 2026). First recorded code use: commit ffbc57d.
// MDN Web Docs (2025) Template literals (Template strings). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals (Accessed: 30 September 2026). First recorded code use: commit ffbc57d.
var current_row = document.getElementById(`row-${current_guess_number}`);
let isunknown = false;
let isFlashing = false; 

// MDN Web Docs (2025) function declaration. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function (Accessed: 30 September 2026). First recorded code use: commit ffbc57d.
function rowToWord(row) {
    return Array.from(row.children, input => input.value || '').join('').toUpperCase();
}
function updateGuessFeedback(row, guessNumber, statuses, knownPositions, won) {
    const misplacedLetters = [];
    const absentLetters = [];

    // MDN Web Docs (2026) for statement. Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for (Accessed: 30 September 2026). First recorded code use: commit df1ca22.
    for (let index = 0; index < 5; index++) {
        const letter = (row.children[index].value || '').toUpperCase();
        // MDN Web Docs (2026) Array.prototype.push(). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push (Accessed: 14 October 2026). First recorded code use: commit b4ff788.
        if (statuses[index] === 'unknown') misplacedLetters.push(letter);
        if (statuses[index] === 'absent') absentLetters.push(letter);
    }

    // MDN Web Docs (2026) Window: localStorage property. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage (Accessed: 7 October 2026). First recorded code use: commit 7a75d7f.
    // MDN Web Docs (2024) Storage: getItem() method. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem (Accessed: 7 October 2026). First recorded code use: commit 7a75d7f.
    // MDN Web Docs (2026) JSON.parse(). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse (Accessed: 14 October 2026). First recorded code use: commit b4ff788.
    const confirmedPositions = JSON.parse(localStorage.getItem('confirmed_position_letters') || '{}');
    Object.entries(knownPositions).forEach(([position, letter]) => {
        confirmedPositions[position] = letter.toUpperCase();
    });
    localStorage.setItem('confirmed_position_letters', JSON.stringify(confirmedPositions));

    const known = [];
    const unconfirmed = [];
    for (let index = 0; index < 5; index++) {
        if (confirmedPositions[index]) {
            known.push(`Character ${index + 1} is ${confirmedPositions[index]}`);
        } else {
            unconfirmed.push(`Character ${index + 1}`);
        }
    }

    const feedbackTitle = document.getElementById('guess-feedback-title');
    const feedbackPanel = document.querySelector('.guess-feedback');
    if (feedbackTitle) {
        if (won) {
            feedbackTitle.textContent = 'You won!';
        } else {
            feedbackTitle.textContent = 'Guess feedback';
        }
    }

    if (feedbackPanel) {
        feedbackPanel.classList.toggle('won', won);
    }

    const lines = [];
    if (won) {
        let guessWord = 'guesses';
        if (guessNumber === 1) {
            guessWord = 'guess';
        }
        lines.push(`You won! You solved the word in ${guessNumber} ${guessWord}.`);
        lines.push(`Winning word: ${rowToWord(row)}.`);
    } else {
        lines.push(`Guess ${guessNumber} feedback:`);
    }
    const correctThisGuess = Object.entries(knownPositions)
        .map(([position, letter]) => `Character ${Number(position) + 1} is ${letter.toUpperCase()}`);

    if (correctThisGuess.length > 0) {
        lines.push(`Correct position: ${correctThisGuess.join('; ')}.`);
    } else {
        lines.push('No letters are in the correct position in this guess.');
    }

    if (misplacedLetters.length > 0) {
        lines.push(`In the answer but in the wrong position: ${misplacedLetters.join(', ')}.`);
    } else {
        lines.push('No letters in this guess are confirmed in a different position.');
    }

    if (absentLetters.length > 0) {
        lines.push(`Not in the answer: ${absentLetters.join(', ')}.`);
    } else {
        lines.push('No letters in this guess were marked absent.');
    }
    lines.push(`Confirmed positions so far: ${known.join('; ') || 'none yet'}.`);
    lines.push(`Not confirmed yet: ${unconfirmed.join(', ') || 'all positions are confirmed'}.`);

    const feedbackBox = document.getElementById('guess-feedback');
    if (feedbackBox) feedbackBox.textContent = lines.join('\n');
}
async function Format_Result_and_display() {
    /* load the result from local storage and apply to the previous row and then move to the next row */
    var result = JSON.parse(localStorage.getItem("result") || "[]");
    var result_known_positions = JSON.parse(localStorage.getItem("result_known_positions") || "{}");
    var result_unknown_positions = JSON.parse(localStorage.getItem("result_unknown_positions") || "[]");
    var known_unused_letters = JSON.parse(localStorage.getItem("known_unused_letters") || "[]");
    var guess_statuses = JSON.parse(localStorage.getItem('guess_statuses') || '[]');
    // Learning reference for console debugging: Codecademy (2020), Learn JavaScript with Codecademy!, 30:38–31:14. https://www.youtube.com/watch?v=O8PlcR-4GRQ&t=1838s (Accessed: 26 October 2026).
    console.log(result_known_positions)
    console.log(result_unknown_positions)
    /* get previous guess row */
    var previous_row = document.getElementById(`row-${current_guess_number}`);
    updateGuessFeedback(previous_row, current_guess_number, guess_statuses, result_known_positions, result[0] === "correct");

    /* Prioritized style application using an if-else chain to prevent duplicate letters from overwriting each other */
    // Supporting explanation: JavaScript.info (2022) Loops: while and for. https://javascript.info/while-for (Accessed: 26 October 2026).
    for (let i = 0; i < 5; i++) {
        let character = previous_row.children[i];
        let lowerChar = (character.value || '').toLowerCase();

        if (result_known_positions[i]) {
            // 1. Green / Correct Position (Highest Priority)
            // MDN Web Docs (2026) HTMLElement: style property. Available at: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style (Accessed: 26 October 2026).
            // MDN Web Docs (2026) background-image. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/background-image (Accessed: 26 October 2026).
            character.style.backgroundImage = 'url("Tick Square.png")';
            // MDN Web Docs (2026) background-size. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/background-size (Accessed: 26 October 2026).
            character.style.backgroundSize = 'cover';
            // MDN Web Docs (2026) color. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/color (Accessed: 26 October 2026).
            character.style.color = 'white';
        } else if (result_unknown_positions.includes(character.value) || result_unknown_positions.includes(lowerChar)) {
            // 2. Yellow / Present in Word but Wrong Position
            character.style.backgroundImage = 'url("Question Square.png")';
            character.style.backgroundSize = 'cover';
            character.style.color = 'white';
        } else if (known_unused_letters.includes(character.value) || known_unused_letters.includes(lowerChar)) {
            // 3. Red / Absent from Word (Lowest Priority)
            character.style.backgroundImage = 'url("Cross Square.png")';
            character.style.backgroundSize = 'cover';
            character.style.color = 'white';
        }

        /* remove the empty class from the character box */
        // MDN Web Docs (2024) DOMTokenList: remove() method. Available at: https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove (Accessed: 14 October 2026).
        character.classList.remove("empty");
        /* disable the character box so that the user cannot type in it */
        // MDN Web Docs (2025) HTMLInputElement: disabled property. Available at: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/disabled (Accessed: 14 October 2026).
        character.disabled = true;
    }

    /* move to the next row */
    current_guess_number++;
    current_row = document.getElementById(`row-${current_guess_number}`);

    if (current_guess_number <= 6) {
        close_input_row();
    }

    if (result[0] === "correct") {
        /* disable all the character boxes so that the user cannot type in them */
        for (let i = 1; i <= 6; i++) {
            let row = document.getElementById(`row-${i}`);
            if (row) {
                let inputs = row.querySelectorAll('.character');
                inputs.forEach((input) => {
                    input.disabled = true;
                });
            }
        }
    } else if (current_guess_number > 6) {
        display_message("Game Over", "The word was: " + localStorage.getItem("random_word"));
        /* disable all the character boxes so that the user cannot type in them */
        for (let i = 1; i <= 6; i++) {
            let row = document.getElementById(`row-${i}`);
            if (row) {
                let inputs = row.querySelectorAll('.character');
                inputs.forEach((input) => {
                    input.disabled = true;
                });
            }
        }
    }
    
    handleFlashAndInput();
    if (current_row && current_row.children[0]) {
        // MDN Web Docs (2025) HTMLElement: focus() method. Available at: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus (Accessed: 30 September 2026).
        current_row.children[0].focus();
    }
    attachGuessSubmitHandler();
}



async function flashCurrentGuess() {
    isFlashing = true; // Set to true when the flash starts
    
    const current_row = document.getElementById(`row-${current_guess_number}`);
    if (!current_row) return;

    while (isFlashing) { // The loop will now exit if isFlashing becomes false
        for (let i = 0; i < 5; i++) {
            let character = current_row.children[i];
            if (character) character.value = "_";
        }
        
        // Supporting explanation: JavaScript.info (2025) Async/await. https://javascript.info/async-await (Accessed: 26 October 2026).
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!isFlashing) break; // Check again after the wait

        for (let i = 0; i < 5; i++) {
            let character = current_row.children[i];
            if (character) character.value = " ";
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Clean up: Clear the underscores/spaces when the flash stops
    for (let i = 0; i < 5; i++) {
        let character = current_row.children[i];
        if (character && character.value === " " || character.value === "_") {
            character.value = "";
        }
    }
}


// Begin Writing Guess and Submit on Enter Key Press
/*
        <div class="row hover-to-red" guess_number="5" role="link" tabindex="0" id="row-5">
            <span class="character empty"> </span>
            <span class="character empty"> </span>
            <span class="character empty"> </span>
            <span class="character empty"> </span>
            <span class="character empty"> </span>
        </div>
User should be able to type letters into the current guess row, and when they press Enter, the guess should be submitted. 

*/
function normaliseWordList(rawList) {
    if (Array.isArray(rawList)) {
        return rawList;
    }

    if (rawList && Array.isArray(rawList.words)) {
        return rawList.words;
    }

    return [];
}

function handleGuess(guess) {
    const rawWordList = JSON.parse(localStorage.getItem("wordList") || "[]");
    const wordList = normaliseWordList(rawWordList);

    if (!wordList.length) {
        display_message("Word list unavailable", "Word list is not available yet. Please refresh and try again.");
        return false;
    }

    const lowerGuess = (guess || '').toLowerCase();
    if (!wordList.includes(lowerGuess)) {
        display_message("Invalid word", "Please try again.");
        
        const current_row = document.getElementById(`row-${current_guess_number}`);
        if (current_row) {
            // FIX: Run the full loop to clear all 5 blocks completely
            for (let i = 0; i < 5; i++) {
                let character = current_row.children[i];
                if (character) {
                    character.value = ""; // Clears the value property if using inputs
                    character.textContent = ""; // Clears text content if using spans
                }
            }
        }
        current_row.children[0].focus();
        return false; // FIX: Moved outside the loop block so it runs after cleanup
    } else {
        GET_guess_result(lowerGuess);
        return true;
    }
}
function ConvertRowtoGuess() {
    const current_row = document.getElementById(`row-${current_guess_number}`);
    if (!current_row) return false;

    let guess = "";
    const inputs = current_row.querySelectorAll('.character');

    inputs.forEach((character) => {
        guess += (character.value || '').toLowerCase();
    });

    if (guess.length !== 5) {
        display_message("Missing letters", "Please fill in all letters before submitting your guess.");
        return false;
    }
    guess = guess.toLowerCase();

    if (typeof GET_guess_result === 'function') {
        return handleGuess(guess);
    } else {
        console.error('GET_guess_result is not available yet.');
        return false;
    }
}

/*
flash guess until the row is being clicked on/items are being types in that word, also once someone had typed a letter into that box move to the next box
*/
function handleFlashAndInput() {
  const currentRow = document.getElementById(`row-${current_guess_number}`);

  if (!currentRow) return;

  const inputs = currentRow.querySelectorAll('.character');

  // STOP THE FLASH WHEN SELECTED:
  // The moment the user clicks or focuses any box in the row, the loop breaks
  currentRow.addEventListener('focusin', () => {
    isFlashing = false;
  });

  currentRow.addEventListener('input', (e) => {
    const index = Array.from(inputs).indexOf(e.target);
    if (e.target.value && inputs[index + 1]) {
      inputs[index + 1].focus();
    }
  });

  currentRow.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
      const lastInput = inputs[inputs.length - 1];
      if (lastInput && lastInput.value) {
        e.preventDefault();
      }
    }
  });

  // Start the flash if the first box is empty
  if (inputs[0] && inputs[0].value === "") {
    flashCurrentGuess();
  }
}

function attachGuessSubmitHandler() {
    const currentRow = document.getElementById(`row-${current_guess_number}`);
    if (!currentRow) return;

    const inputs = Array.from(currentRow.querySelectorAll('.character'));
    const lastInput = inputs[inputs.length - 1];
    if (!lastInput) return;

    lastInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            if (inputs.every(input => input.value !== '')) {
                ConvertRowtoGuess();
            } else {
                display_message("Missing letters", "Please fill in all letters before submitting your guess.");
            }
        }
    });
    /* if all the words have been filled and the user tabs out of the last box, submit the guess */
    // MDN Web Docs (2026) Element: blur event. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event (Accessed: 14 October 2026).
    // MDN Web Docs (2026) EventTarget: addEventListener() method. Available at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener (Accessed: 30 September 2026).
    // MDN Web Docs (2026) Array.prototype.every(). Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every (Accessed: 14 October 2026).
    lastInput.addEventListener('blur', function (e) {
        if (inputs.every(input => input.value !== '')) {
            const guessSubmitted = ConvertRowtoGuess();
            if (guessSubmitted) {
                console.log("Guess submitted on blur (tab out)")
                Format_Result_and_display();
            }
        }
    });
}


// Supporting explanation: JavaScript.info (2026) Functions. https://javascript.info/function-basics (Accessed: 26 October 2026).
function display_message(title, content) {
    const messageContainer = document.getElementById('message-container');
    const messageTitle = document.getElementById('message-title');
    const messageContent = document.getElementById('message-content');

    // Video DOM example: Codecademy (2020), 1:10:22–1:14:14. https://www.youtube.com/watch?v=O8PlcR-4GRQ&t=4222s (Accessed: 26 October 2026). Uses the same general DOM-update concept, not identical code.
    messageTitle.textContent = title;
    messageContent.textContent = content;
    messageContainer.classList.remove('message-container-hidden');
    messageContainer.classList.add('message-container-visible');
}
function close_input_row() {
    for (let i = 1; i <= 6; i++) {
        let row = document.getElementById(`row-${i}`);
        if (!row) continue;
        if (i !== current_guess_number) {
            let inputs = row.querySelectorAll('.character');
            inputs.forEach((input) => {
                input.disabled = true;
            });
        }
    }
    let row = document.getElementById(`row-${current_guess_number}`);
    if (!row) return;
    for (let j=0; j<5; j++) {
        let input = row.children[j];
        input.disabled = false;
    }
}
close_input_row();

handleFlashAndInput();

attachGuessSubmitHandler();


