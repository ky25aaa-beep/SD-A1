# Project Evaluation

## 1. Evaluation of the finished product

The project is a browser-based five-letter guessing game. It consits of no game-engine or server-side processing and is entirely residing . Its main strength is its simplicity, its just a word game with nothing else, no points, no rewards, no ads, just there to be mentally challenging. The player first enters a guess, recieves per-letter clues, and can use those clues to decide what to try next. The original plan was for three distinct versions of the game five, six, and seven letter games. On 21 October 2026 the scope was reduced to one five-letter game because implementing the guessing version was more complex than expected. This gave the project a more achievable core and allowed the design to focus on access for visually impaired players.

The accessibility work adds labels to the letter inputs, keyboard submission, text descriptions of letter results, live status messages, and focus handling for messages. These choices address the needs of the visually impaired-player persona and reduce dependence on colour. However, the current checks do not establish that a visually impaired player can complete a game independently: keyboard and screen-reader testing is still required. The implementation should be evaluated with the test cases in the README and, if possible, feedback from a screen-reader user.

The game also depends on external services for jQuery and the word list. This reduces the amount of code and data bundled with the project, but makes startup depend on network access and those services remaining available.

### Success against requirements

Complete this table after running the corresponding tests. A requirement should be marked successful only when there is recorded evidence.

| Area | Intended outcome | Current evidence | Evaluation |
|---|---|---|---|
| Core game | Six attempts, valid five-letter guesses, accurate clues, win/loss handling, and a new game | Browser tests T1–T6 and T9 pass in colour mode and T1–T6 pass in accessible mode (README test tables). Repeated-letter logic checked against 10,000 answer/guess pairs with 0 mismatches. Accessible-mode T9 fails: the "empty" board holds placeholder characters ([05](EVIDENCE_IMG/05-accessible-T9-after-reset.png)); colour mode resets cleanly ([06](EVIDENCE_IMG/06-colour-T9-after-reset.png)). | The Core game is defintely there FR8 is currently unverifiable and the coregame tests are all manual and not automatic |
| Keyboard access | The player can use the game without a mouse and can see or identify focus | Typing advances focus and the fifth letter auto-submits. In accessible mode Enter on the Close control does not close the popup ([04](EVIDENCE_IMG/04-accessible-close-ignores-enter.png)); colour mode's button works. Typing straight after clicking into an accessible-mode row drops letters ([01](EVIDENCE_IMG/01-accessible-idle-placeholders.png), [02](EVIDENCE_IMG/02-accessible-dropped-letters.png)); colour mode is unaffected ([03](EVIDENCE_IMG/03-colour-same-typing-ok.png)). | The close control does not close the popup via enter every time sometimes requiring two presses, T7 has been run, and disregarding the double click enter for closing a popup it functions   |
| Screen-reader access | Inputs, clues, errors, remaining attempts, and final outcome are announced clearly | Labels and live regions are present in the source. Colour mode's popup has `role="alert"`; accessible mode's has no `role` or `aria-live`. Idle accessible-mode boxes contain `_` or a space ([01](EVIDENCE_IMG/01-accessible-idle-placeholders.png)). No screen-reader test has been recorded/just tested. | Initially Some Screen Readers read the right box containing Guess feedback is red twice, screenreaders require pausing, user enters then playing again.
 |
| Robustness | A missing word list is explained and the player can recover | The source now announces a word-list loading failure and gives a refresh instruction. T8 has not yet been run. | Cannot Be tested offline using github pages, but if the code were to be deployed to an app in the future it could be tested. |
| Extra feature | At least one feature extends the core game | Accessible mode (`docs/play/no-colour/no-colour.html` and `no-colour.js`): symbol key, written feedback panel and per-input labels, shown in the README screenshots `README_IMG/TESTING/access-mode.png`, `access-guess.png` and `access-win.png`. | This features is mostly effective, and it works well using chrome on windows, it is untested on other distributions or mobile devices. |

## 2. Development process and decisions

The project scope changed from three word lengths to one five-letter game. The decision traded breadth for a more complete version of the main interaction and time to consider accessibility. In the final reflection, describe what prompted the change, when it was made, and whether the remaining time was used effectively.

A code issue was identified in repeated-letter feedback. The display previously depended on lists of letter values, which could give duplicate letters the same style even when only one matching answer letter remained. The chosen approach stores the evaluator's status for each of the five positions and uses those statuses in the display and accessible description. The check with answer `apple` and guess `allee` produced `known, unknown, absent, absent, known`; syntax checks for both changed JavaScript files passed. These checks establish the algorithm example and parse validity only. They do not demonstrate that the complete game or its assistive-technology behavior works.

The implementation separates page interaction (`5-letter.js`) from word-list and evaluation logic (`api/5-letter.js`). This makes responsibilities easier to locate, but the files still share state through browser storage and global functions. A later improvement could replace that shared state with a clearer interface between the game and evaluator, provided the change does not jeopardise the submission deadline.

### Reflection on the process

The most useful planning method was paper and pen, and then prototyping because it enabled the project to get working much quicker. However the better design decision would have been to start documenting and evidencing much sooner to enable the reflective, evaluative and the documentation part of this assignment to be written much faster. A decision I would make earlier next time is to start the github project much sooner and begin documenting it because it meant I was lacking a lot of evidence of early development without css and other stuff.
- The hardest technical problem was colouring/indiicating the individual character cells, especially if a letter was duplicated for instance a guess was "falls" the code would struggle to colourise the first l properly. I tried seperating the known positions and unknown list and many different iterations like colourising sooner and later in the script inevitably the solution was to do a full wrap around of all the characters once all known positions were identified and then colourise known positions first, then unknown, adn then absent.
- My time plan worked partly because while majority of the work was completed on schedule the code did not properly alot time for any mishaps and during the final week my vehicle was stolen and torched and therefore threw of my schedule completely. For Future Development projects I should allow a 20% follow through whereby I aim for 120% of the work needed to be completed by a date by that date and therefore should have a rolling lead of +20% above the minimum to do the project on time 

## 3. Comparison of development approaches

This project uses a direct, browser-based approach with HTML, CSS, and JavaScript. The page structure, styling, and game behavior are kept in separate files, and the evaluator is separate from page interaction. This fits a small individual project because the browser can run the result without a build step. The trade-off is that shared browser storage and global functions make the relationship between the scripts less explicit, and the current project has no recorded automated end-to-end test setup.

An Alternative would be to use a server side programming language for the guesses allowed/remaining tracking, and the guessing and answer generation function. For instance a python http.server api or flask; or PHP.


## 4. Browser technologies and possible improvements

The project uses standard browser technologies: semantic HTML for the page, CSS for layout and visual states, JavaScript for game rules and interaction, browser storage for persisted values, and live regions and accessible names for assistive technology. These features allow a lightweight application without a server-side game engine. Their practical limits include browser differences in focus and input behavior, reliance on external resources, and the need to test the live-region behavior with actual assistive technologies.

### Current and newer browser technologies

The current game uses established browser features: native HTML inputs and buttons, CSS styling, JavaScript event handling, and browser storage. These are a good fit for a small game because they work directly in the browser and keep the project simple. The page also uses accessible names and a live region to expose game state to assistive technology.

A newer option for reliability is a **service worker**. It could cache the page, styles, scripts, and a local copy of the word list, allowing the game to start when the player is offline. That would address the current remote word-list dependency, but it introduces cache updates and offline behavior that would need their own tests. Service workers require a secure context such as HTTPS in deployment; localhost is allowed for development ([MDN, Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)).

Another option is **Web Components**, which could package a guess row and its inputs as a reusable custom element with its own behavior and styles. This could help if the project grew to multiple game modes, but for six identical rows it would add architecture and debugging work without a clear benefit yet ([MDN, Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)).

For this version, native HTML controls and the existing JavaScript are the more proportionate choice. Service-worker caching is the most relevant future technology because it could reduce reliance on the network. Any change should be justified by the user need and verified with keyboard and screen-reader testing, rather than added only because the browser supports it.
Potential improvements include:

- Test with keyboard-only navigation and at least one screen-reader/browser pairing, then fix and retest problems found.
- Consider a single text input or a well-described composite input if testing shows that moving through five separate inputs is cumbersome.
- Provide a local fallback or bundled word list if the network failure test shows that the game cannot recover clearly.
- Add automated checks for repeated letters, accepted and rejected guesses, win/loss conditions, and reset behavior.
- Record browser and device details with the manual test evidence so results can be repeated.

These are recommendations for future work, not claims that the features are implemented.

## 5. Tools and design methods

The project uses Github to edit and manage the source. The README contains a low-fidelity interface sketch, pseudocode, a game-flow diagram, personas, and requirement IDs. 

## 6. JavaScript course reflection and evidence


- **Course/platform:** freeCodeCamp Video
- **Modules completed:** Whole 3 hour video
- **Completion date:** 20-10-2026 to 26-10-2026
- **Evidence :** ![Screenshot of JavaScript course evidence](README_IMG/SCREENSHOT-EVIDENCE-YOUTUBE.png)

Reflect on the course in your own words: **[Which JavaScript ideas from the course did you use in the game? Give one concrete example from the source. What did you still need to learn independently?]**

## 7. References and credits

Credit third-party code, data, images, libraries, and sources used in the evaluation clearly.

- darkermango (n.d.) *5-Letter-Words*. GitHub. Available at: https://github.com/darkermango/5-Letter-words (Accessed: 26 October 2026).
- MDN (n.d.) *Service Worker API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API (Accessed: 20 September 2026).
- MDN (n.d.) *Web Components*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Web_components (Accessed: 26 October 2026).
- OpenJS Foundation (n.d.) *jQuery Core 3.6.0*. Available at: https://code.jquery.com/jquery-3.6.0.min.js (Accessed: 14 October 2026).
- Ritchey, K., Patterson, S., Patterson, B. and Ritchey, N. (2023) ‘Wordle as a Teaching Tool’, *PRIMUS*, 33(8), pp. 901–915. doi: https://doi.org/10.1080/10511970.2023.2193951.
- Smith, H. (2026) ‘Introducing Wend: our eighth LinkedIn game’, *LinkedIn*, 9 June. Available at: https://www.linkedin.com/pulse/introducing-wend-our-eighth-linkedin-game-helen-smith-bpxec (Accessed: 21 October 2026).
- W3C (2024) *Web Content Accessibility Guidelines (WCAG) 2.2*. W3C Recommendation, 12 December. Available at: https://www.w3.org/TR/WCAG22/ (Accessed: 21 October 2026).


