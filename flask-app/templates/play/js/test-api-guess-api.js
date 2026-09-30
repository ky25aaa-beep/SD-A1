async function initialiseGame() {
	const response = await fetch("/api", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			api_v2_data: {
				cmd: "initialise"
			}
		})
	});

	if (!response.ok) {
		throw new Error(`Initialise failed with status ${response.status}`);
	}

	return response.json();
}

async function guessWord(wordleHash, guessWord) {
	const response = await fetch("/api", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			api_v2_data: {
				cmd: "get_Guess_Result",
				GUESS: guessWord,
				WORDLE_HASH: wordleHash
			}
		})
	});

	if (!response.ok) {
		throw new Error(`Guess failed with status ${response.status}`);
	}

	return response.json();
}

async function runGuessApiTest() {
	try {
		const initResult = await initialiseGame();
		const wordleHash = initResult?.WORDLE_HASH;
        console.log(initResult);
		if (!wordleHash) {
			throw new Error("WORDLE_HASH was not returned by initialise.");
		}

		const guessResult = await guessWord(wordleHash, "guess");

		console.log("Initialise response:", initResult);
		console.log('Guess response for "guess":', guessResult);
	} catch (error) {
		console.error("API test failed:", error);
	}
}

runGuessApiTest();
