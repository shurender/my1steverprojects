let randomNumber = Math.floor(Math.random() * 100) + 1;
const guessInput = document.getElementById('guess');
const submitGuessButton = document.getElementById('submit-guess');
const messageParagraph = document.getElementById('message');
const resetGameButton = document.getElementById('reset-game');

submitGuessButton.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleGuess();
    }
});

resetGameButton.addEventListener('click', function() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    messageParagraph.textContent = '';
    guessInput.value = '';
    guessInput.disabled = false;
    submitGuessButton.style.display = 'inline';
    resetGameButton.style.display = 'none';
});

function handleGuess() {
    const userGuess = parseInt(guessInput.value);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        messageParagraph.textContent = 'Please enter a number between 1 and 100.';
    } else if (userGuess === randomNumber) {
        messageParagraph.textContent = 'Congratulations! You guessed the correct number!';
        endGame();
    } else if (userGuess < randomNumber) {
        messageParagraph.textContent = 'Too low! Try again.';
    } else {
        messageParagraph.textContent = 'Too high! Try again.';
    }
}

function endGame() {
    guessInput.disabled = true;
    submitGuessButton.style.display = 'none';
    resetGameButton.style.display = 'inline';
}
