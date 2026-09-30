#test guessing make guesses and move across the api as the frontend would
import requests
url = "http://127.0.0.1:5000/api"
data = {
    "api_v2_data": {
        "cmd": "initialise",
    }
}
response = requests.post(url, json=data)
print(F"Response INITIALISED: {response.json()}")
data = {
    "api_v2_data": {
        "cmd": "Generate_New_Word",
        "Account_ID": "anon",
        "PreviousGuess": "",
        "KnownPositions": "",
        "KnownLettersWithoutPosition": "",
        "WORDLE_HASH": "",
        "GUESS": "guess"
    }   
}
response = requests.post(url, json=data)
print(F"Response Generate_New_Word: {response.json()}")
data = {
    "api_v2_data": {
        "cmd": "get_Guess_Result",
        "Account_ID": "anon",
        "PreviousGuess": "",
        "KnownPositions": "",
        "KnownLettersWithoutPosition": "",
        "WORDLE_HASH": "",
        "GUESS": f"{guess}"
    }   
}
response = requests.post(url, json=data)
print(F"Response get_Guess_Result: {response.json()}")
#make guess repeat until maximum guesses reached or answer is correct
for i in range(4):
    guess = input("Enter your guess: ")
    data = {
        "api_v2_data": {
            "cmd": "get_Guess_Result",
            "Account_ID": "anon",
            "PreviousGuess": "",
            "KnownPositions": "",
            "KnownLettersWithoutPosition": "",
            "WORDLE_HASH": "",
            "GUESS": f"{guess}"
        }   
    }
    response = requests.post(url, json=data)
    print(F"Response get_Guess_Result: {response.json()}")
    if response.json().get("user_guess_status") == "Maximum guesses reached":
        break


