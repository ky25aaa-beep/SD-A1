// Request to the API endpoint
async function reinitialiseGame() {
  const url = "/api";
  const data = {
    api_v2_data: {
      cmd: "Generate_New_Word"
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

async function StartGame_api() {
  const url = "/api";
  const data = {
    api_v2_data: {
      cmd: "initialise"
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

async function Guess_api(guess, wordle_hash) {
    if (!guess || !wordle_hash) {
        console.error("Missing guess or wordle_hash");
        return;
    }
    const url = "/api";
    const data = {
        api_v2_data: {
            cmd: "get_Guess_Result",
            GUESS: guess,
            WORDLE_HASH: wordle_hash
        }
    };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

function formatKnownPositions(knownPositions) {
  if (!knownPositions || typeof knownPositions !== "object") {
    return "";
  }

  return Object.values(knownPositions).join(", ");
}

function formatUnknownPositions(unknownPositions) {
  if (!Array.isArray(unknownPositions)) {
    return "";
  }

  return unknownPositions.join(", ");
}

//new word (reinitialise)
const ReInitialiseButton = document.getElementById("reinitialiseButton");
ReInitialiseButton.addEventListener("click", async () => {
  var result = await reinitialiseGame();
  wordle_hash = result.WORDLE_HASH;
  //cookie update
  document.cookie = `WordleHash=${wordle_hash}`;
  const KnownPositions = document.getElementById("known");
  const UnknownPositions = document.getElementById("unknown");
  const GuessState = document.getElementById("status");

  KnownPositions.textContent = "";
  UnknownPositions.textContent = "";
  GuessState.textContent = "";

});


//Button Click Event Listener
///newWordButton
const newWordButton = document.getElementById("newWordButton");
newWordButton.addEventListener("click", async () => {
  var result = await StartGame_api();
  wordle_hash = result.WORDLE_HASH;
  //cookie update
  document.cookie = `WordleHash=${wordle_hash}`;

});

const guessButton = document.getElementById("guessButton");
guessButton.addEventListener("click", async () => {
    const guessInput = document.getElementById("guessInput");
    const guess = guessInput.value.trim();
    //get cookie
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
        }
    , {});
    const wordle_hash = cookies.WordleHash;
    const response = await Guess_api(guess, wordle_hash);
    const KnownPositions = document.getElementById("known");
    const UnknownPositions = document.getElementById("unknown");
    const GuessState = document.getElementById("status");

    KnownPositions.textContent = formatKnownPositions(response?.result_known_positions ?? {});
    UnknownPositions.textContent = formatUnknownPositions(response?.result_unknown_positions ?? []);
    GuessState.textContent = response?.user_guess_status || "";
});