// old js is 5-letter.js new code for new system is 5-letter-game.js
// This file contains the JavaScript code for the 5-letter game functionality.


//Make Current guess underscore flashing inside the box my default current_guess is 1 
var current_guess_number = 1;
var current_row = document.getElementById(`row-${current_guess_number}`);
let isunknown = false;
let isFlashing = false; 

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
    var current_row = document.getElementById(`row-${current_guess_number}`);

    var guess = "";
    for (let i = 0; i < 5; i++) {
        let character = current_row.children[i];
        let current_character = character.value;
        guess = guess + current_character;
    }
   /* Using /play/api/5-letter.js run GET_guess_result */

    GET_guess_result(guess)
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
      if (lastInput.value) {
        e.preventDefault();
      }
    }
  });

  // Start the flash if the first box is empty
  if (inputs[0] && inputs[0].value === "") {
    flashCurrentGuess();
  }
}

handleFlashAndInput()

while (!isunknown) {
    //get current words last character
    /*  <div class="row" guess_number="1" role="link" tabindex="0" id="row-1">
            <input maxlength="1" class="character empty">
            <input maxlength="1" class="character empty">
            <input maxlength="1" class="character empty">
            <input maxlength="1" class="character empty">
            <input maxlength="1" class="character empty">
        </div>
    */
    var character5_selector = `#row-${current_guess_number} .character:nth-child(5)`;
    var character5 = document.querySelector(character5_selector);
    character5.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
        // if no letters are empty
        if (Array.from(document.querySelectorAll(`#row-${current_guess_number} .character`)).every(input => input.value !== "")) {
            ConvertRowtoGuess();
        } else {
            alert("Please fill in all letters before submitting your guess.");
        }
    }
    })}
