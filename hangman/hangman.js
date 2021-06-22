/* 1. Define a word
 * 2. convert word to an array
 * 3. create function that checks if chosen letter is in an array (maybe need to make lowercase)  XX  
 * 4. if yes, then a. remove letter as option to click b. show letter instead of ___ XX
 * 5. create function that displays letter XX
 * 6. create a count of how many guesses XX
 * 7. each guess has an image associated with it ------------
 * 8. display the correct letter when you click the right letter 
 * 
 *a. checks if there is a match
 if match -> total guesses inc 
 if no match -> add one to wrong guesses
 * 
 * 
 */
//global variables
const ALPHABET = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let currentWord = "niggardly";
let currentWordArray = [];
let removedLetters = "";
let currentGuesses = 0;
let wrongGuesses = 0;
let correctIndexes = [];



//DOM references
let keyboardRef = document.getElementById("keyboard");
let wordRef = document.getElementById("word");
let guessRef = document.getElementById("guessesRemaining");

wordRef.innerText = currentWord;


//converts the current word to an array
function convertWordToArray(word)
{
    
    for (let i=0;i<word.length;i++)
    {
        currentWordArray.push(word.charAt(i))
    }   
}

convertWordToArray(currentWord)


//checks if the letter guess is present in array
function checkForLetter(letter,array)
{
    let savedIndex = [];
    for (let i=0;i<array.length;i++)
    {
        if (array[i]==letter)
        {
            savedIndex.push(i);
            correctIndexes.push(i);
        }
    }
    return savedIndex;
}

//called when keyboard is pressed
function buttonPress(letter)
{
    let criticalIndexes = checkForLetter(letter,currentWordArray);
    if (removedLetters == "")
    {
        removedLetters += letter;
    }
    else 
    {
        removedLetters += `, ${letter}`
    }
    if (criticalIndexes.length == 0)
    {
        wrongGuesses++;
        currentGuesses++;
        guessRef.innerText = `Guesses Remaining:${6-wrongGuesses}`
    }
    else 
    {
        currentGuesses++;
        displayWord();
        if (correctIndexes.length == currentWordArray.length)
        {
            guessRef.innerText = `You have sucessfully guessed the word with ${6-wrongGuesses} guesses remaining!`
        }

    }

    displayKeyboard(removedLetters);
}


//function that displays keyboard. if there are removed letters, they will not be displayed 
function displayKeyboard(removedLetters)
{
    let output = "";
    for (let i=0;i<ALPHABET.length;i++)
    {
        let status = "";
        if (removedLetters.includes(ALPHABET[i])==true)
        {
            status = "disabled";
        }
        output += `
        <button onclick="buttonPress('${ALPHABET[i]}')" class="keyboard" ${status}>${ALPHABET[i]}</button>
        `
    }
    
    keyboardRef.innerHTML = output;
    //console.log(output)
}


function displayWord()
{
    let output = "";
    output += `<p>`
    for (let i = 0; i < currentWordArray.length; i++)
    {
        if (correctIndexes.includes(i))
        {
            output += `${currentWordArray[i]}    `;
        }
        else 
        {
            output +="  ***  "
        }
    }
    output += `</p>`
    wordRef.innerHTML = output;
}


displayKeyboard("");
guessRef.innerText = `Guesses Remaining: 6`
displayWord();