// old js is 5-letter.js new code for new system is 5-letter-game.js
// This file contains the JavaScript code for the 5-letter game functionality.


//Make Current guess underscore flashing inside the box my default current_guess is 1 
var current_guess_number = 1;
var current_row = document.getElementById(`row-${current_guess_number}`);
let isunknown = false;
let isFlashing = false; 

async function Format_Result_and_display() {
    /* load the result from local storage and apply to the previous row and then move to the next row */
    var result = JSON.parse(localStorage.getItem("result") || "[]");
    var result_known_positions = JSON.parse(localStorage.getItem("result_known_positions") || "{}");
    var result_unknown_positions = JSON.parse(localStorage.getItem("result_unknown_positions") || "[]");
    var known_unused_letters = JSON.parse(localStorage.getItem("known_unused_letters") || "[]");
    /* get previous guess row */
    var previous_row = document.getElementById(`row-${current_guess_number}`);
    /* green class is .known add .known to the character box if the letter is in the correct position, yellow class is .unknown add .unknown to the character box if the letter is in the word but not in the correct position, red class is .absent add .absent to the character box if the letter is not in the word */
    for (let i = 0; i < 5; i++) {
        let character = previous_row.children[i];
        if (result_known_positions[i]) {
            character.classList.add("known");

        } else if (result_unknown_positions.includes(character.value)) {
            character.classList.add("unknown");
        } else if (known_unused_letters.includes(character.value)) {
            character.classList.add("absent");
        }
        /* remove the empty class from the character box */
        character.classList.remove("empty");
        /* disable the character box so that the user cannot type in it */
        character.disabled = true;

    }
    /* move to the next row */
    current_guess_number++;
    current_row = document.getElementById(`row-${current_guess_number}`);
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
        alert("Game Over! The word was: " + localStorage.getItem("random_word"));
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
async function ConvertRowtoGuess() {
    const current_row = document.getElementById(`row-${current_guess_number}`);
    if (!current_row) return;

    let guess = "";
    const inputs = current_row.querySelectorAll('.character');

    inputs.forEach((character) => {
        guess += (character.value || '').toLowerCase();
    });

    if (guess.length !== 5) {
        alert("Please fill in all letters before submitting your guess.");
        return;
    }

    if (typeof GET_guess_result === 'function') {
        GET_guess_result(guess);
    } else {
        console.error('GET_guess_result is not available yet.');
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
                alert('Please fill in all letters before submitting your guess.');
            }
        }
    });
    /* if all the words have been filled and the user tabs out of the last box, submit the guess */
    lastInput.addEventListener('blur', function (e) {
        if (inputs.every(input => input.value !== '')) {
            ConvertRowtoGuess();
            console.log("Guess submitted on blur (tab out)")
            Format_Result_and_display();
        }
    });
}

handleFlashAndInput();
attachGuessSubmitHandler();
