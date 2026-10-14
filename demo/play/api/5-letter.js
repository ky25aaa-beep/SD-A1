//simplify code use plain js functions and remove unnecessary code

//generate a random 5 letter word from the list of words
const wordList = ["apple", "grape", "peach", "berry", "mango", "lemon", "melon", "cherry", "plum", "guava"];


function GET_Random_Word() {
    var temp_random_number = Math.floor(Math.random() * wordList.length);
    return wordList[temp_random_number];
}

function initialiseGame() {
    //generate a random 5 letter word from the list of words
    var random_word = GET_Random_Word();

    localStorage.setItem("random_word", random_word);
    var random_word_hash = btoa(random_word);
    localStorage.setItem("random_word_hash", random_word_hash);
    //create blank result array and blank result_known_positions object and blank result_unknown_positions array and store them in local storage
    var result = [];
    var result_known_positions = {};
    var result_unknown_positions = [];
    var known_unused_letters = []
    var prev_guesses = []
    localStorage.setItem("prev_guesses", (prev_guesses))
    localStorage.setItem("result", (result));
    localStorage.setItem("result_known_positions", (result_known_positions));
    localStorage.setItem("result_unknown_positions", (result_unknown_positions));
    localStorage.setItem("result_unknown_positions", (result_unknown_positions));

    return random_word;

}

function GET_guess_result(guess) {
    /* if guess storage is blank initialise game */
    if (!localStorage.getItem("random_word")) {
        initialiseGame();
    }

    // Check hash matches answer if it does check answer and return result
    var random_word_hash_storage = localStorage.getItem("random_word_hash");
    var random_word_hash = atob(random_word_hash_storage);
    if (random_word_hash == random_word_hash_storage) {
        //check guess and return result
        if (guess == random_word) {
            var result = ["correct"]
            var result_known_positions = { 0: guess.charAt(0), 1: guess.charAt(1), 2: guess.charAt(2), 3: guess.charAt(3), 4: guess.charAt(4) }
            var result_unknown_positions = {}
            localStorage.setItem("result", (result));
            localStorage.setItem("result_known_positions", (result_known_positions));
            localStorage.setItem("result_unknown_positions", (result_unknown_positions));

        } else {
            //compare letters and get unknown_positions (orange letters), known_positions (green), known_unused_letters (grey)
            //get grey letters
            for (let i = 0; i < guess.length; i++) {
                if (!random_word.includes(guess.charAt(i))) {
                    var known_unused_letters = localStorage.getItem("known_unused_letters");
                    known_unused_letters = known_unused_letters + guess.charAt(i);
                    localStorage.setItem("known_unused_letters", (known_unused_letters));
                } else if (random_word.includes(guess.charAt(i))) {
                    //get unknown_positions (orange letters)
                    var result_unknown_positions = localStorage.getItem("result_unknown_positions");
                    result_unknown_positions = result_unknown_positions + guess.charAt(i);
                    localStorage.setItem("result_unknown_positions", (result_unknown_positions));

                }
                if (guess.charAt(i) === random_word.charAt(i)) {
                    //get known_positions (green letters)
                    var result_known_positions = localStorage.getItem("result_known_positions");
                    result_known_positions = result_known_positions + guess.charAt(i);
                    localStorage.setItem("result_known_positions", (result_known_positions));
                    //if it is in correct position, if it is add it to known_positions(andif it exists in unknown_positions remove it)
                    var result_unknown_positions = localStorage.getItem("result_unknown_positions");
                    result_unknown_positions = result_unknown_positions.replace(guess.charAt(i), '');
                    localStorage.setItem("result_unknown_positions", (result_unknown_positions));
                }
            };
        }
    }
}