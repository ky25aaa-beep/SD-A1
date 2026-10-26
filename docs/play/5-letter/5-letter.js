// old js is 5-letter.js new code for new system is 5-letter-game.js
// This file contains the JavaScript code for the 5-letter game functionality.


//Make Current guess underscore flashing inside the box my default current_guess is 1 
var current_guess_number = 1;
var current_row = document.getElementById(`row-${current_guess_number}`);
let isunknown = false;


async function Format_Result_and_display() {
    const result = JSON.parse(localStorage.getItem("result") || "[]");
    const result_known_positions = JSON.parse(localStorage.getItem("result_known_positions") || "{}");
    const result_unknown_positions = JSON.parse(localStorage.getItem("result_unknown_positions") || "[]");
    const known_unused_letters = JSON.parse(localStorage.getItem("known_unused_letters") || "[]");
    const guess_statuses = JSON.parse(localStorage.getItem("guess_statuses") || "[]");
    const submitted_guess_number = current_guess_number;
    const previous_row = document.getElementById(`row-${submitted_guess_number}`);
    if (!previous_row) return;

    const statusText = {
        known: "correct and in the correct position",
        unknown: "in the answer but in a different position",
        absent: "not in the answer"
    };
    const feedback = [];

    for (let i = 0; i < 5; i++) {
        const character = previous_row.children[i];
        const letter = (character.value || "").toUpperCase();
        const status = guess_statuses[i] || (result_known_positions[i] ? "known" : (result_unknown_positions.includes(character.value) ? "unknown" : (known_unused_letters.includes(character.value) ? "absent" : "absent")));
        character.classList.remove("known", "unknown", "absent", "empty");
        character.classList.add(status);
        character.setAttribute("aria-label", `Guess ${submitted_guess_number} of 6, letter ${i + 1} of 5, ${letter}: ${statusText[status]}`);
        character.disabled = true;
        feedback.push(`Letter ${i + 1}, ${letter}: ${statusText[status]}`);
    }

    current_guess_number++;
    current_row = document.getElementById(`row-${current_guess_number}`);
    if (current_guess_number <= 6) close_input_row();

    const hasWon = result[0] === "correct";
    const hasLost = !hasWon && submitted_guess_number === 6;
    if (hasWon || hasLost) {
        for (let i = 1; i <= 6; i++) {
            const row = document.getElementById(`row-${i}`);
            if (row) row.querySelectorAll(".character").forEach(input => { input.disabled = true; });
        }
    }

    let announcement = `Guess ${submitted_guess_number} feedback. ${feedback.join(". ")}.`;
    if (hasWon) {
        announcement += " You won the game.";
        display_message("You win", "You found the word.");
    } else if (hasLost) {
        const answer = localStorage.getItem("random_word");
        announcement += ` You used all six guesses. The answer was ${answer}.`;
        display_message("Game Over", `The word was: ${answer}`);
    } else {
        const remaining = 6 - submitted_guess_number;
        announcement += ` ${remaining} guesses remaining.`;

    }

    announceGameStatus(announcement);

    if (!hasWon && !hasLost && current_row && current_row.children[0]) {
        handleFlashAndInput();
        current_row.children[0].focus();
        attachGuessSubmitHandler();
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

/* Move focus to the next letter box as the player types. */
function handleFlashAndInput() {
  const currentRow = document.getElementById(`row-${current_guess_number}`);

  if (!currentRow) return;

  const inputs = currentRow.querySelectorAll('.character');

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

}

function attachGuessSubmitHandler() {
    const currentRow = document.getElementById(`row-${current_guess_number}`);
    if (!currentRow) return;

    const inputs = Array.from(currentRow.querySelectorAll(".character"));
    const lastInput = inputs[inputs.length - 1];
    if (!lastInput || lastInput.dataset.submitHandlerAttached === "true") return;
    lastInput.dataset.submitHandlerAttached = "true";

    lastInput.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;
        event.preventDefault();
        if (!inputs.every(input => input.value !== "")) {
            display_message("Missing letters", "Please fill in all letters before submitting your guess.");
            return;
        }
        if (ConvertRowtoGuess()) Format_Result_and_display();
    });
}

function display_message(title, content) {
    const messageContainer = document.getElementById("message-container");
    const messageTitle = document.getElementById("message-title");
    const messageContent = document.getElementById("message-content");

    messageTitle.textContent = title;
    messageContent.textContent = content;
    messageContainer.classList.remove("message-container-hidden");
    messageContainer.classList.add("message-container-visible");
    const closeButton = document.getElementById("message-close");
    if (closeButton) closeButton.focus();
}

function labelGuessInputs() {
    for (let rowNumber = 1; rowNumber <= 6; rowNumber++) {
        const row = document.getElementById(`row-${rowNumber}`);
        if (!row) continue;
        row.setAttribute("role", "group");
        row.setAttribute("aria-label", `Guess ${rowNumber} of 6`);
        row.removeAttribute("tabindex");
        row.querySelectorAll(".character").forEach((input, index) => {
            input.setAttribute("aria-label", `Guess ${rowNumber} of 6, letter ${index + 1} of 5`);
            input.setAttribute("aria-describedby", "game-instructions");
            input.setAttribute("autocomplete", "off");
            input.setAttribute("autocapitalize", "characters");
            input.setAttribute("spellcheck", "false");
        });
    }
}

function announceGameStatus(message) {
    const statusRegion = document.getElementById("game-status");
    if (statusRegion) statusRegion.textContent = message;
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
labelGuessInputs();
    close_input_row();

handleFlashAndInput();

attachGuessSubmitHandler();





