# Primary Target Audience

Current Research into wordle suggests its a formative resource and format within learning. According to  Ritchey, Katherine in Wordle as a Teaching Tool (CITE), She has used wordle as a basis for 4 games she uses to help students advance their skills and knowledge in particular concepts. In addition Linkedin, The Professional networking platform
launched its eighth puzzle game in 2026, The game called Wend challenges players to find hidden words within a letter grid where each letter is used only once (CITE)

Based on this research the target audience for my game are students/academics looking to further their problem solving and analytical skills 
# Initial Game Idea

Wordle

**Wordle** 
# Initial Game, User, and System Requirements 
## Game Requirements 

**UI - User Interface**

Provide a colourised user interface consisting of 
6 rows containing five input boxes per row each initally a light grey colour

**Function - Program Behaviour**

Allow the user to interact with and complete only the current guess row

On word submission colourise the current row to match the states:

1. Letters in the guess that are not in the word should be dark grey 
2. Letters in the guess that are present in the word but in the incorrect position should be amber 
3. Letters present in the guess that are in the correct position should be green
4. The game after colourising should progress to the next  line
5. The game should limit guesses to a total of six 
6. The game should limit guesses to only valid words

## User Persona

### Persona 1: blind student who uses a screen reader

**Name:** Alex (fictional persona)

**Context:** Alex is a student who enjoys short word puzzles and uses a screen reader and keyboard to use websites. Alex wants to play independently without needing visual feedback.

**Goals:**
- Enter a five-letter guess and move through the game using the keyboard.
- Understand which letters are correct, present in another position, or absent.
- Know how many guesses remain and whether the game has been won or lost.

**Needs and accessibility considerations:**
- Each letter input needs a clear label and position in the current guess.
- Game feedback must be available as text to assistive technology and must not depend on colour or an image alone.
- The game should announce guess results, validation errors, and the end of the game to the screen reader.
- Keyboard focus should follow the game flow and remain easy to control.

This is a hypothetical persona to guide design. These needs describe the intended accessibility direction and do not by themselves confirm that every feature is implemented or tested.

### Persona 2: student who enjoys word puzzles

**Name:** Jordan (fictional persona)

**Context:** Jordan is a student who likes short browser games and wants to practise vocabulary, deduction, and problem-solving between study tasks.

**Goals:**
- Understand the rules quickly and start a game without needing extra setup.
- Use clues from each guess to make a better next guess.
- Receive clear feedback and know when the game is complete.

**Needs:**
- Simple instructions and a clear, consistent game layout.
- Immediate feedback after each valid guess.
- A way to start a new game after finishing.

This is also a hypothetical persona and should be treated as a design aid rather than a report of research with a real participant.

## Development Constraints

- **Initial plan (21 October 2026):** develop five-, six-, and seven-letter game versions.
- **Scope change:** implementing the five-letter guessing game proved more complex than expected. The project scope was reduced to one five-letter game, with an adaptation intended to make the experience more accessible to blind players, rather than completing all three word lengths.
- **Time:** the assignment estimates about 36 hours of work and has a submission date in the week commencing 26 October 2026.
- **Platform and technologies:** the application must be browser-based and use HTML5, CSS, and JavaScript. Other technologies require tutor approval.
- **Project requirements:** the work must be managed in a Git-based repository, include a deployed application, and implement at least one feature beyond the core game.

## System