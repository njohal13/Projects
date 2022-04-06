//https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/
//Import a js file that contains array of words
import { WORDS } from "./words.js";

//Declare variables
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = []; //each guessed letter will go into array so we can compare the letters
let nextLetter = 0; //index of array starting at 0, changes depending on how many letters in guess
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)] //Math.floor changes decimal to integer. Math.random returns a word within the specified length
console.log(rightGuessString)

//build the game board using js function 
function initBoard(){
    let board = document.getElementById('game-board')
     
    //Outer loop which generates 6 rows for 6 guesses
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) { // Number of rows will go up to 6 (number of guesses)
        let row = document.createElement("div")   // Create a row each time the loop runs (i++)
        row.className = "letter-row" // Each row is given the class "letter-row" which is added into the html DOM
       
        //Inner loop which generates 5 boxes in each row. Once row is complete, outer loop runs again, repeats
        for (let j = 0; j < 5; j++) {  //starting at 0, create a box each time up to 5 boxes for each row
            let box = document.createElement("div") // for each box (i++) create a new div
            box.className = "letter-box" // each new div (box) gets the class name "letter-box"
            row.appendChild(box) //nest each box inside the row
        }

        board.appendChild(row) // very last thing the loop does is it nests the row in the game-board
    }
}
initBoard()

//function runs each time a key is pressed
document.addEventListener("keyup", (e) =>{  
    //check if they have guesses left
    if (guessesRemaining === 0){
        return 
    }
    //delete the entered letter when they hit "Backspace" and for all boxes except box 0 (all boxes are empty)
    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !==0){
        deleteLetter() //run this function, we define it later
    return
    }
    // check if the guess is correct when they press "Enter" run the function checkGuess()
    if (pressedKey === "Enter"){
        checkGuess() //run this function, we define it later
        return
    }

    // a regular expression that validates the pressed key with letters a-z and see if it matches
    let found = pressedKey.match(/[a-z]/gi) 
    // if the pressed key is not found (!found) or || they pressed more than 1 key at same time (found.length >1)
    if (!found || found.length > 1){
        // then exit dont run the function
        return
    }else{
        // else its a valid letter, so insert the letter: insertLetter(pressedKey)
        insertLetter(pressedKey) //run this function, we define it later
    }
})

//Lets define our functions from the code above

//insertLetter checks that there's still space in the guess for this letter, 
//finds the appropriate row, and puts the letter in the box.
function insertLetter(pressedKey){
    // check if end of row. Index 0-4 for 5 boxes. 4 is the last box
    // if passed end of row, do not run the function
    if (nextLetter === 5){
        return
    }
    pressedKey = pressedKey.toLowerCase()
    //Grab the current empty row [6-guessesRemaining]
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    //grab the box (child) in the row with the index of [nextLetter]
    let box = row.children[nextLetter]
    //insert pressed key into that box
    box.textContent = pressedKey
    //add class of "filled-box" to that box so we can format it using css
    box.classList.add("filled-box")
    // add pressed key to end of guess in that array
    currentGuess.push(pressedKey)
    // add 1 to our counter that keeps track where we are in the row
    nextLetter += 1

}
//deleteLetter gets the correct row, finds the last box and empties it, 
//and then resets the nextLetter counter.
function deleteLetter(){
    //find the current row we're in, and store it in a variable
    let row = document.getElementsByClassName("letter-row")[6-guessesRemaining]
    //find the current filled box (child element) in the current row
    let box = row.children[nextLetter-1]
    //revert contents of box to empty string ""
    box.textContent = ""
    //remove class of "filled-box" from the dom to get rid of css properties for a filled box
    box.classList.remove("filled-box")
    //remove .pop() last element of array (last letter)
    currentGuess.pop()
    //remove 1 (-=1) from our counter that keeps track where we are
    nextLetter -= 1
}

//
function checkGuess(){
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    //convert array we built into a string and then check against our wordlist. guessString ===?
    let guessString = ''
    //rightGuessString was our variable that has the random word from the wordlist
    //Array. generates an array from the random word
    let rightGuess = Array.from(rightGuessString)

    //loops through for each item (val) in the array currentGuess
    for (const val of currentGuess){
        //add the val to our string guessString
        guessString += val 
    }
    //if they hit enter with not all 5 letters pressed:
    if (guessString.length != 5){
        alert("Not enough letters!")
        return
    }
    //if guess is not (!) included in the WORDS array of random words
    if (!WORDS.includes(guessString)){
        alert("Word not in list!")
        return
    }

    //if their guess is okay
    for (let i= 0; i<5; i++){
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        //check if letter exists in the correct guess and return its index position
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        //if index doesnt exist we get -1. if index is -1 shade grey
        if (letterPosition === -1) {
            letterColor = 'grey'

        // now, letter is definitely in word
        // if letter index and right guess index are the same
        // letter is in the right position 
        }else{
            if(currentGuess[i] === rightGuess[i]){
                letterColor = 'green'
            }else{
                letterColor = 'yellow'
            }
            //Not sure what this does, maybe reset the letter position
            rightGuess[letterPosition] = "#" 
        }
        //250ms delay for shading 
        let delay = 250 * i
        setTimeout(()=> {
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString){
        alert("You guessed right!")
        guessesRemaining = 0
        return
    } else {
        //reduce their amount of guesses remaining
        guessesRemaining -= 1;
        currentGuess =[];
        nextLetter = 0;
        //if they run out of guesses
        if (guessesRemaining === 0) {
            alert("You've run out of guesses! Game over!")
            alert(`The right word was: "${rightGuessString}"`)
        }
    }
}
//shadeKeyBoard receives the letter on the on-screen keyboard we want to shade and 
//the color we want to shade it.
//shades the letters we already guessed green or yellow on the keyboard
function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")){
        //Find the key that matches the given letter
        if (elem.textContent === letter){
            let oldColor = elem.style.backgroundColor
            //if already guessed right before, leave it be
            if (oldColor === 'green') {
                return
            } 
            //If the key is currently yellow, only allow it to become green
            if (oldColor === 'yellow' && color !== 'green') {
                return
            }
            //Else, shade the key passed to the function
            elem.style.backgroundColor = color
            break
        }
    }
}

//Make the On-screen Keyboard Generate Input

//listens for a click on the keyboard container or any of its children (the buttons)
document.getElementById("keboard-cont").addEventListener('click', (e) => {
    const target = e.target 
    //If the clicked element was not a button, we exit the function
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    //else dispatch a key up event corresponding to the clicked key.
    let key = target.textContent

    if (key === "Del"){
        key = "Backspace"
    }
    //create a keyboard event with a key up, when click on virutal keyboard
    //triggers all other events that would happen if had typed on keyboard
    //JS MDN key up event
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})