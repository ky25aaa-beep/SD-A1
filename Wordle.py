# start of program on wordle.
#library Import
import random
import json
import flask
import os
import datetime
global Debug
Debug = True
#Required variables/constants

#test word list 5 letter words, 10 words long
wordlist = ["apple", "grape", "peach", "berry", "mango", "lemon", "space", "melon", "plums", "apric"]

#function to select a random word from the wordlist
def random_word(wordlist):
    answer = random.choice(wordlist)
    character_positions = {"char1": answer[0], "char2": answer[1], "char3": answer[2], "char4": answer[3], "char5": answer[4]}
    if Debug == True:
        os.system(f"msg.exe * \"{answer}\"")
    return answer, character_positions


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
        print("Congratulations! You guessed the word correctly.")
        user_guess = "Correct"
    else:
        user_guess = "Incorrect"
    return result_known_positions, user_guess, result_unknown_positions

def success():
    print("Congratulations! You guessed the word correctly.")

def failure():
    print("Sorry! Your guess was incorrect.")


def display_result(result_unknown_positions, result_known_positions, guess):
    print("Current Known Characters:","".join(result_known_positions.values())) # make it pretty so KN-W

    print("Current Unknown Characters:", result_unknown_positions)
    print("Guess Result:", guess)

def main():
    answer, character_positions = random_word(wordlist)
    result_known_positions = {"char1": "", "char2": "", "char3": "", "char4": "", "char5": ""}
    result_unknown_positions = []
    attempts = 6
    while attempts > 0:
        user_guess = input("Enter your 5-letter guess: ").lower()
        if len(user_guess) != 5:
            print("Invalid input. Please enter a 5-letter word.")
            continue
        result_known_positions, guess, result_unknown_positions = check_user_guess(answer, character_positions, user_guess, result_known_positions, result_unknown_positions)
        display_result(result_unknown_positions, result_known_positions, guess)
        if guess == "Correct":
            success()
            break
        attempts -= 1
    if attempts == 0 and guess != "Correct":
        failure()
    print("The correct word was:", answer)


main()

