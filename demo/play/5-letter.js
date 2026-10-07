// old js is 5-letter.js new code for new system is 5-letter-game.js
// This file contains the JavaScript code for the 5-letter game functionality.


//Make Current guess underscore flashing inside the box my default current_guess is 1 
var current_guess_number = 1;
var current_row = document.getElementById(`row-${current_guess_number}`);

async function flashCurrentGuess() {
    while (true) {
        for (let i = 0; i < 5; i++) {
            let character = current_row.children[i];
            character.value = "_";
            //
        }
        //wait for 500ms
        await new Promise(resolve => setTimeout(resolve, 500));
        for (let i = 0; i < 5; i++) {
            let character = current_row.children[i];
            character.value = " ";
            //
        }
        //wait for 500ms
        await new Promise(resolve => setTimeout(resolve, 500));
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
    var current_guess_number = 1;
    var current_row = document.getElementById(`row-${current_guess_number}`);

    var guess = "";
    for (let i = 0; i < 5; i++) {
        let character = current_row.children[i];
        let current_character = character.value;
        guess = guess + current_character;
    }
    alert(guess)
}

/*
flash guess until the row is being clicked on/items are being types in that word, also once someone had typed a letter into that box move to the next box
*/
function handleFlashAndInput() {
    const currentNumber = 1; 

    const currentRow = document.getElementById(`row-${currentNumber}`);
    if (currentRow) {
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
                if (lastInput.value) {
                    e.preventDefault();
                    alert("Too many letters press enter to submit guess");
                }
            }
        });
    }
    if (currentRow.children[0].value == "") {
        flashCurrentGuess();
    }else {
    }
}

handleFlashAndInput()
/* 
Using /play/api/5-letter.js

Initialise Game
Generate Random Word
Make Guesses

*/