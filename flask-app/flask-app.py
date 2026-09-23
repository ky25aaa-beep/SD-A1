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

# Description
'''
Required Variables: Answer, UserGuess, CharacterPositions
Optional Variables: ResultKnownPositions, ResultUnknownPositions

Takes Guess and compares it against the Answer in two parts:
part 1: checks for correct letters in the correct positions
part 2: checks for correct letters in incorrect positions
Returns:
    ResultKnownPositions: dictionary containing letters in correct positions
    UserGuess: string indicating if the guess is "Correct" or "Incorrect"
    ResultUnknownPositions: list containing letters in incorrect positions
'''
def CheckUserGuess(Answer, CharacterPositions, UserGuess, ResultKnownPositions, ResultUnknownPositions):
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
    Generates a random word for the client based on their unique ID.
Required Variables: WordList, Client_id
Returns:
    Answer: the randomly selected word
    CharacterPositions: dictionary containing the positions of each character in the word
'''

def GenRandomWord(WordList):
    Client_id = Session.get('Uid')
    if Client_id is None:
        Client_id = str(uuid.uuid4())
        Session['Uid'] = Client_id
    random.seed(Client_id)
    Answer = random.choice(WordList)
    CharacterPositions = {"char1": Answer[0], "char2": Answer[1], "char3": Answer[2], "char4": Answer[3], "char5": Answer[4]}
    if Debug == True:
        os.system(f"msg.exe * \"{Answer}\"")
    return Answer, CharacterPositions




def GenerateWordle_hash(Answer):
    Key = CurrentApp.secret_key
    # creates a hash that can be used by the client/server to verify no tampering with the answer, but the hash cant be used to determine if a future wordle is using the same answer by confirming the hash is the same as one seen in the past.
    return sha256(((Key.hex() if isinstance(Key, bytes) else str(Key)) + Answer).encode()).hexdigest()


def Handler_api(Data):
    print("Received:", Data)
    if Data["api_v2_data"]["cmd"] == "initialise":
        if 'Answer' not in Session or 'Wordle_hash' not in Session:
            NewAnswer, NewCharacterPositions = GenRandomWord(WordList)
            Session['Answer'] = NewAnswer
            Session['CharacterPositions'] = NewCharacterPositions
            Session['Wordle_hash'] = GenerateWordle_hash(NewAnswer)
            if Debug == True:
                print(f"Stored answer in session: {NewAnswer}")
        return {"status": "initialised", "WORDLE_HASH": Session['Wordle_hash']}
    elif Data["api_v2_data"]["cmd"] == "get_Guess_Result":
        Guess = Data["api_v2_data"]["GUESS"]
        PreviousGuess = Data["api_v2_data"]["PreviousGuess"]
        KnownPositions = Data["api_v2_data"]["KnownPositions"]
        KnownLettersWithoutPosition = Data["api_v2_data"]["KnownLettersWithoutPosition"]
        ClientWordle_hash = Data["api_v2_data"]["WORDLE_HASH"]
        Account_id = Data["api_v2_data"]["Account_ID"]
        #check if the answer exists in session
        if 'Answer' not in Session or 'CharacterPositions' not in Session or 'Wordle_hash' not in Session:
            NewAnswer, NewCharacterPositions = GenRandomWord(WordList)
            Session['Answer'] = NewAnswer
            Session['CharacterPositions'] = NewCharacterPositions
            Session['Wordle_hash'] = GenerateWordle_hash(NewAnswer)
            if Debug == True:
                print(f"Stored answer in session: {NewAnswer}")
                print(f"Stored character positions in session: {NewCharacterPositions}")

        # verify the client's hash matches what the server has for this session -
        # only block when the client claims to already have a hash and it's wrong
        if ClientWordle_hash and ClientWordle_hash != Session['Wordle_hash']:
            return {
                "error": "State mismatch - word may have changed, syncing",
                "WORDLE_HASH": Session['Wordle_hash']
            }

        if Guess != "":
            if 'Guesses' not in Session:
                Session['Guesses'] = []
            if len(Session['Guesses']) < 4:
                ResultKnownPositions, UserGuessStatus, ResultUnknownPositions = CheckUserGuess(Session['Answer'], Session['CharacterPositions'], Guess, KnownPositions, KnownLettersWithoutPosition)
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
        else:
            return {
                "result_known_positions": {},
                "user_guess_status": "No guess provided",
                "result_unknown_positions": [],
                "WORDLE_HASH": Session['Wordle_hash']
            }
    elif Data["api_v2_data"]["cmd"] == "Generate_New_Word":
        NewAnswer, NewCharacterPositions = GenRandomWord(WordList)
        Session['Answer'] = NewAnswer
        Session['CharacterPositions'] = NewCharacterPositions
        Session['Guesses'] = []  # Reset the guesses for the new word
        Session['Wordle_hash'] = GenerateWordle_hash(NewAnswer)
        if Debug == True:
            print(f"Stored new answer in session: {NewAnswer}")
            print(f"Stored new character positions in session: {NewCharacterPositions}")
        return {
            "result_known_positions": {},
            "user_guess_status": "New word generated",
            "result_unknown_positions": [],
            "WORDLE_HASH": Session['Wordle_hash']
        }



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
        return flask.render_template("play.html")

    App.run(debug=True)

if __name__ == "__main__":
    FlaskUI()