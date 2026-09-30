### flask wordle front end
##required imports
import flask #webUI library
import random #random number generation for word selection
import json #for handling JSON data
import os #for operating system interactions
import datetime
global Debug
from hashlib import sha256 #for hashing values
import uuid #for generating unique client identifiers
from flask import session as Session, current_app as CurrentApp #for accessing session and current app context


#list of test words for the game
WordList = ["apple", "grape", "peach", "berry", "mango", "lemon", "space", "melon", "plums", "apric"]

Debug = True #enable or disable debug mode

#required functions

'''
Description:
    Takes Guess and compares it against the Answer in two parts:
    part 1: checks for correct letters in the correct positions
    part 2: checks for correct letters in incorrect positions
Required Variables: Answer, CharacterPositions, UserGuess
Returns:
    ResultKnownPositions: dictionary containing letters in correct positions
    UserGuess: string indicating if the guess is "Correct" or "Incorrect"
    ResultUnknownPositions: list containing letters in incorrect positions
Result: Compares a guess against the answer.
Impact_Player: The player's guess is scored, letter by letter.
'''
def CheckUserGuess(Answer, CharacterPositions, UserGuess):
    ResultKnownPositions = {"char1": "", "char2": "", "char3": "", "char4": "", "char5": ""}
    ResultUnknownPositions = []
    for Index in range(5):
        if UserGuess[Index] == Answer[Index]:
            ResultKnownPositions[f"char{Index+1}"] = UserGuess[Index]
        elif UserGuess[Index] in Answer:
            ResultUnknownPositions.append(UserGuess[Index])
        if ResultKnownPositions[f"char{Index+1}"] == "":
            ResultKnownPositions[f"char{Index+1}"] = "_"
    #if unknown positions contains a value that has been found in known positions, remove it
    for Index in range(5):
        if ResultKnownPositions[f"char{Index+1}"] in ResultUnknownPositions:
            ResultUnknownPositions.remove(ResultKnownPositions[f"char{Index+1}"])

    if UserGuess == Answer:
        UserGuess = "Correct"
    else:
        UserGuess = "Incorrect"
    return ResultKnownPositions, UserGuess, ResultUnknownPositions

'''
Description:
    Generates a random word for the client.
Required Variables: WordList
Prerequisite Functions:
    random
    os (only if Debug is True)
Returns:
    Answer: the randomly selected word
    CharacterPositions: dictionary containing the positions of each character in the word

Result: Generates a New Random Word
Impact_Player: The Game will have an answer to guess

'''

def GenRandomWord(WordList):
    Answer = random.choice(WordList)
    CharacterPositions = {"char1": Answer[0], "char2": Answer[1], "char3": Answer[2], "char4": Answer[3], "char5": Answer[4]}
    if Debug == True:
        os.system(f"msg.exe * \"{Answer}\"")
    return Answer, CharacterPositions


def GenerateWordle_hash(Answer):
    Key = CurrentApp.secret_key
    # creates a hash that can be used by the client/server to verify no tampering with the answer, but the hash cant be used to determine if a future wordle is using the same answer by confirming the hash is the same as one seen in the past.
    return sha256(((Key.hex() if isinstance(Key, bytes) else str(Key)) + Answer).encode()).hexdigest()

'''
Description:
    Picks a fresh word for this client and stores it (with its hash) in the session, resetting any guesses so far.
Required Variables: WordList, Session, Debug
Prerequisite Functions:
    GenRandomWord
    GenerateWordle_hash
Returns: None
Result: Stores a new word and its hash in the session.
Impact_Player: The Game will either reset/initialise
'''
def StoreNewWordInSession():
    NewAnswer, NewCharacterPositions = GenRandomWord(WordList)
    Session['Answer'] = NewAnswer
    Session['CharacterPositions'] = NewCharacterPositions
    Session['Wordle_hash'] = GenerateWordle_hash(NewAnswer)
    Session['Guesses'] = []
    if Debug == True:
        print(f"Stored answer in session: {NewAnswer}")
        print(f"Stored character positions in session: {NewCharacterPositions}")


'''
Description:
    Ensures that the session has a word and its hash, generating a new one if necessary.
Required Variables: Session
Prerequisite Functions:
    StoreNewWordInSession
    GenRandomWord
    GenerateWordle_hash
Returns: None
Result: Guarantees that the session has a word and its hash.
Impact_Player: 
    In the event that the session does not have a word or its hash, a new word will be generated and stored (e.g., to handle Client Server mismatch due to restarts etc)

'''
def EnsureSessionHasWord():
    if 'Answer' not in Session or 'CharacterPositions' not in Session or 'Wordle_hash' not in Session:
        StoreNewWordInSession()

'''
Description:
    Handles the "initialise" command from the client, ensuring a word exists for this session and returning its hash.
Required Variables: Session
Prerequisite Functions:
    EnsureSessionHasWord
Returns: Dictionary containing the status and the WORDLE_HASH.
Result: Guarantees that the client has the current word's hash.
Impact_Player: the game will start or continue with the current word's hash available to the client.
'''

def HandleInitialise(Data):
    EnsureSessionHasWord()
    return {"status": "initialised", "WORDLE_HASH": Session['Wordle_hash']}


'''
Description:
    Handles the "get_Guess_Result" command from the client, checking a submitted guess against the session's answer and returning the result.
    Only GUESS and WORDLE_HASH are read from the request - the client doesn't need to track or resend
    known-letter state, since the full known/unknown positions come back in every response.
Required Variables: Session, Data
Prerequisite Functions:
    EnsureSessionHasWord
    CheckUserGuess
Returns: Dictionary containing the result of the guess, the user's guess status, and the current word's hash.
Result: Provides feedback on the user's guess and updates the session's guess history.
Impact_Player: The player receives feedback on their guess, including known positions, unknown positions, and the status of their guess.
'''
def HandleGuessResult(Data):
    Guess = Data["api_v2_data"]["GUESS"]
    ClientWordle_hash = Data["api_v2_data"]["WORDLE_HASH"]

    EnsureSessionHasWord()

    # verify the client's hash matches what the server has for this session -
    # only block when the client claims to already have a hash and it's wrong
    if ClientWordle_hash and ClientWordle_hash != Session['Wordle_hash']:
        return {
            "error": "State mismatch - word may have changed, syncing",
            "WORDLE_HASH": Session['Wordle_hash']
        }

    if Guess == "":
        return {
            "result_known_positions": {},
            "user_guess_status": "No guess provided",
            "result_unknown_positions": [],
            "WORDLE_HASH": Session['Wordle_hash']
        }

    if 'Guesses' not in Session:
        Session['Guesses'] = []

    if len(Session['Guesses']) < 4:
        ResultKnownPositions, UserGuessStatus, ResultUnknownPositions = CheckUserGuess(
            Session['Answer'], Session['CharacterPositions'], Guess
        )
        Session['Guesses'].append(Guess)
    else:
        ResultKnownPositions = {}
        UserGuessStatus = "Maximum guesses reached"
        ResultUnknownPositions = []

    return {
        "result_known_positions": ResultKnownPositions,
        "user_guess_status": UserGuessStatus,
        "result_unknown_positions": ResultUnknownPositions,
        "answer": Session['Answer'],
        "WORDLE_HASH": Session['Wordle_hash']
    }

'''
Description:
    Handles the "Generate_New_Word" command from the client, discarding the current word and guesses and starting a fresh round for this session.
Required Variables: Session
Prerequisite Functions:
    StoreNewWordInSession
Returns: Dictionary containing the result of the new word generation and the current word's hash.
Result: Starts a new round with a fresh word and resets the session's guess history.
Impact_Player: The player receives a new word's hash and can start guessing from scratch.
'''
def HandleNewWord(Data):
    StoreNewWordInSession()
    return {
        "result_known_positions": {},
        "user_guess_status": "New word generated",
        "result_unknown_positions": [],
        "WORDLE_HASH": Session['Wordle_hash']
    }


# maps each incoming cmd to the function that handles it
Cmd_handlers = {
    "initialise": HandleInitialise,
    "get_Guess_Result": HandleGuessResult,
    "Generate_New_Word": HandleNewWord,
}


def Handler_api(Data):
    print("Received:", Data)
    Cmd = Data["api_v2_data"]["cmd"]
    Handler = Cmd_handlers.get(Cmd)
    if Handler is None:
        return {"error": f"Unknown cmd: {Cmd}"}
    return Handler(Data)



def FlaskUI():
    App = flask.Flask(__name__)
    App.secret_key = os.urandom(24)

    @App.route("/api", methods=['POST'])
    def Session_api():
        Data = flask.request.get_json()

        Result = Handler_api(Data)
        return flask.jsonify(Result)

    @App.route("/")
    def Index_page():
        return flask.render_template("index.html")

    @App.route("/play")
    def Play_page():
        WordLength = flask.request.args.get("WordLength", type=int)
        if WordLength is None:
            WordLength = flask.request.args.get("wordlength", default=5, type=int)
        if WordLength not in [5, 6, 7]:
            WordLength = 5
        Session['WordLength'] = WordLength
        return flask.render_template(f"play/{WordLength}-letter.html")
    #css
    @App.route("/main.css")
    def Main_css():
        return flask.send_from_directory("templates", "main.css")

    @App.route("/play/test-api-guess")
    def Play_test_api_guess_page():
        return flask.render_template("play/test-api-guess.html")

    @App.route("/play/js/<path:filename>")
    def Play_js(filename):
        return flask.send_from_directory("templates/play/js", filename)
    
    @App.route("/play/css/<path:filename>")
    def Play_css(filename):
        return flask.send_from_directory("templates/play/css", filename)


    @App.route("/js/<path:filename>")
    def Js_alias(filename):
        return flask.send_from_directory("templates/play/js", filename)

    App.run(debug=True)

if __name__ == "__main__": # only run this code when the file is executed directly, not when it's imported as a module elsewhere
    FlaskUI()