### flask wordle front end
##required imports
import flask 
import random
import json
import os
import datetime
global Debug
from hashlib import sha256
import uuid
from flask import session

##required constants
wordlist = ["apple", "grape", "peach", "berry", "mango", "lemon", "space", "melon", "plums", "apric"]
Debug = True



#required functions #upate word to generate a custom random word for a set client
def check_user_guess(answer, character_positions, user_guess, result_known_positions, result_unknown_positions):
    result_known_positions = {"char1": "", "char2": "", "char3": "", "char4": "", "char5": ""}
    result_unknown_positions = []
    for i in range(5):
        if user_guess[i] == answer[i]:
            result_known_positions[f"char{i+1}"] = user_guess[i]
        elif user_guess[i] in answer:
            result_unknown_positions.append(user_guess[i])
        if result_known_positions[f"char{i+1}"] == "":
            result_known_positions[f"char{i+1}"] = "_"
    result = {"known_positions": result_known_positions, "unknown_positions": result_unknown_positions}
    #if unknown positions contains a value that has been found in known positions, remove it
    for i in range(5):
        if result_known_positions[f"char{i+1}"] in result_unknown_positions:
            result_unknown_positions.remove(result_known_positions[f"char{i+1}"])

    if user_guess == answer:
        user_guess = "Correct"
    else:
        user_guess = "Incorrect"
    return result_known_positions, user_guess, result_unknown_positions


def random_word_for_client(wordlist, client_id):
    random.seed(client_id)
    answer = random.choice(wordlist)
    character_positions = {"char1": answer[0], "char2": answer[1], "char3": answer[2], "char4": answer[3], "char5": answer[4]}
    if Debug == True:
        os.system(f"msg.exe * \"{answer}\"")
    return answer, character_positions


def random_word_for_session(wordlist):
    client_id = session.get('uid')
    if client_id is None:
        client_id = str(uuid.uuid4())
        session['uid'] = client_id
    return random_word_for_client(wordlist, client_id)


def api_handler(data):
#{
#    "api_v2_data": {
#        "cmd": "get_Guess_Result",
#        "Account_ID": "anon",
#        "PreviousGuess": "your_previous_guess_value",
#        "KnownPositions": "your_known_positions_value",
#        "KnownLettersWithoutPosition": "your_known_letters_value",
#        "WORDLE_HASH": "your_wordle_hash_value"
#        "GUESS": "your_guess_value"
#    }   
#}
    if data["api_v2_data"]["cmd"] != "get_Guess_Result":
        guess = data["api_v2_data"]["GUESS"]
        previous_guess = data["api_v2_data"]["PreviousGuess"]
        known_positions = data["api_v2_data"]["KnownPositions"]
        known_letters_without_position = data["api_v2_data"]["KnownLettersWithoutPosition"]
        wordle_hash = data["api_v2_data"]["WORDLE_HASH"]
        account_id = data["api_v2_data"]["Account_ID"]
        #check if the answer exists in session
        if 'answer' not in session or 'character_positions' not in session:
            get_answer, character_positions = random_word_for_session(wordlist)
            session['answer'] = get_answer
            session['character_positions'] = character_positions
            if Debug == True:
                print(f"Stored answer in session: {get_answer}")
                print(f"Stored character positions in session: {character_positions}")

        if guess != "":
            if 'guesses' not in session:
                session['guesses'] = []
            if len(session['guesses']) < 4:
                result_known_positions, user_guess_status, result_unknown_positions = check_user_guess(session['answer'], session['character_positions'], guess, known_positions, known_letters_without_position)
                session['guesses'].append(guess)
            else:
                result_known_positions = {}
                user_guess_status = "Maximum guesses reached"
                result_unknown_positions = []


            return {
                "result_known_positions": result_known_positions,
                "user_guess_status": user_guess_status,
                "result_unknown_positions": result_unknown_positions,
                "answer": session['answer']
            }
        else:
            return {
                "result_known_positions": {},
                "user_guess_status": "No guess provided",
                "result_unknown_positions": []
            }
    elif data["api_v2_data"]["cmd"] == "Generate_New_Word":
        get_answer, character_positions = random_word_for_session(wordlist)
        session['answer'] = get_answer
        session['character_positions'] = character_positions
        session['guesses'] = []  # Reset the guesses for the new word
        if Debug == True:
            print(f"Stored new answer in session: {get_answer}")
            print(f"Stored new character positions in session: {character_positions}")
        return {
            "result_known_positions": {},
            "user_guess_status": "New word generated",
            "result_unknown_positions": []
        }


def FlaskUI():
    app = flask.Flask(__name__)

    @app.route("/api", methods=['POST']) 
    def api():
        #recieve json 
        data = flask.request.get_json
        api_handler(data)

    @app.route("/")
    def index():
        return flask.render_template("index.html")

    @app.route("/play")
    def play():
        return flask.render_template("play.html")

    app.run(debug=True)

if __name__ == "__main__":
    FlaskUI()