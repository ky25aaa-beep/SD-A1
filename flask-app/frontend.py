### flask wordle front end
##required imports
import flask 
import random
import json
import os
import datetime
global Debug


##required constants
wordlist = ["apple", "grape", "peach", "berry", "mango", "lemon", "space", "melon", "plums", "apric"]
Debug = True



#required functions 
def random_word(wordlist):
    answer = random.choice(wordlist)
    character_positions = {"char1": answer[0], "char2": answer[1], "char3": answer[2], "char4": answer[3], "char5": answer[4]}
    if Debug == True:
        os.system(f"msg.exe * \"{answer}\"")
    return answer, character_positions


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