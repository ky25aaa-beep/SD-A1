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

$(".character .empty").keyup(function () {
    if (this.value.length == this.maxLength) {
      var $next = $(this).next('.character .empty');
      if ($next.length)
          $(this).next('.character .empty').focus();
      else
          $(this).blur();
    }
});