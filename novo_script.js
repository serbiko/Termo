const leftGrids = document.querySelectorAll('.left-grid .grid');
const rightGrids = document.querySelectorAll('.right-grid .grid');
let currentRow = 0;
let currentSquare = 0;
let correctWordLeft = '';
let correctWordRight = '';
let isInputLocked = false;
let usedWords = [];

async function loadRandomWords() {
    const response = await fetch('palavras.txt');
    const text = await response.text();
    const words = text.split('\n').map(word => word.trim()).filter(word => word.length === 5);

    let newWordLeft = '';
    let newWordRight = '';
    
    do {
        newWordLeft = words[Math.floor(Math.random() * words.length)].toUpperCase();
        newWordRight = words[Math.floor(Math.random() * words.length)].toUpperCase();
    } while (usedWords.includes(newWordLeft) || usedWords.includes(newWordRight));

    correctWordLeft = newWordLeft;
    correctWordRight = newWordRight;
    usedWords.push(correctWordLeft, correctWordRight);
    console.log(correctWordLeft, correctWordRight);
}

function resetGame() {
    restartButton.style.display = 'none';
    document.getElementById('message').style.display = 'none';

    leftGrids.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.textContent = '';
            square.classList.remove('rightp', 'rightl', 'wrong');
        });
    });

    rightGrids.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.textContent = '';
            square.classList.remove('rightp', 'rightl', 'wrong');
        });
    });

    const alphabetLetters = document.querySelectorAll('.alphabet-letter');
    alphabetLetters.forEach(letter => {
        letter.classList.remove('rightp', 'rightl', 'wrong');
    });

    currentRow = 0;
    currentSquare = 0;
    enableInput();
    updateRowHighlight();
    loadRandomWords();
}

async function checkWordInDictionary(word) {
    const response = await fetch('dicionario.txt');
    const text = await response.text();
    const words = text.split('\n').map(w => w.trim().toUpperCase());
    return words.includes(word);
}

function showMessageTemporary(messageText) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = messageText;
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 4000);
}

function showMessage(messageText) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = messageText;
    messageElement.style.display = 'block';
    restartButton.style.display = 'block';
}

function focusCurrentSquare() {
    const leftGrid = leftGrids[currentRow];
    const rightGrid = rightGrids[currentRow];
    const leftSquares = leftGrid.querySelectorAll('.square');
    const rightSquares = rightGrid.querySelectorAll('.square');
    
    leftSquares.forEach((square, index) => {
        if (index === currentSquare) {
            square.classList.add('active-square');
        } else {
            square.classList.remove('active-square');
        }
    });

    rightSquares.forEach((square, index) => {
        if (index === currentSquare) {
            square.classList.add('active-square');
        } else {
            square.classList.remove('active-square');
        }
    });

    leftSquares[currentSquare].focus();
    rightSquares[currentSquare].focus();
}

leftGrids.forEach(grid => {
    const squares = grid.querySelectorAll('.square');
    squares.forEach(square => {
        square.addEventListener('mousedown', e => {
            e.preventDefault();
        });
    });
});

rightGrids.forEach(grid => {
    const squares = grid.querySelectorAll('.square');
    squares.forEach(square => {
        square.addEventListener('mousedown', e => {
            e.preventDefault();
        });
    });
});

function isRowFilled(grid) {
    const squares = grid.querySelectorAll('.square');
    return Array.from(squares).every(square => square.textContent !== '');
}

function disableInput() {
    isInputLocked = true;
}

function enableInput() {
    isInputLocked = false;
}

function updateRowHighlight() {
    leftGrids.forEach((grid, index) => {
        if (index === currentRow) {
            grid.classList.add('active');
        } else {
            grid.classList.remove('active');
            const squares = grid.querySelectorAll('.square');
            squares.forEach(square => square.classList.remove('active-square'));
        }
    });

    rightGrids.forEach((grid, index) => {
        if (index === currentRow) {
            grid.classList.add('active');
        } else {
            grid.classList.remove('active');
            const squares = grid.querySelectorAll('.square');
            squares.forEach(square => square.classList.remove('active-square'));
        }
    });
}

function handleKeydown(e) {
    if (isInputLocked) return;

    const leftGrid = leftGrids[currentRow];
    const rightGrid = rightGrids[currentRow];
    const leftSquares = leftGrid.querySelectorAll('.square');
    const rightSquares = rightGrid.querySelectorAll('.square');

    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        if (currentSquare < leftSquares.length) {
            leftSquares[currentSquare].textContent = e.key.toUpperCase();
            rightSquares[currentSquare].textContent = e.key.toUpperCase();

            leftSquares[currentSquare].classList.remove('pop-animation');
            rightSquares[currentSquare].classList.remove('pop-animation');
            void leftSquares[currentSquare].offsetWidth;
            void rightSquares[currentSquare].offsetWidth;
            leftSquares[currentSquare].classList.add('pop-animation');
            rightSquares[currentSquare].classList.add('pop-animation');

            if (currentSquare < 4) {
                currentSquare++;
                focusCurrentSquare();
            } else if (currentSquare === 4) {
                clearHighlight();
            }
        }
    } else if (e.key === 'Backspace') {
        if (currentSquare > 0 && leftSquares[currentSquare].textContent === '') {
            currentSquare--;
        }
        leftSquares[currentSquare].textContent = '';
        rightSquares[currentSquare].textContent = '';
        focusCurrentSquare();
    } else if (e.key === 'Enter') {
        if (isRowFilled(leftGrid) && isRowFilled(rightGrid)) {
            clearHighlight();
            disableInput();
            checkWords(leftGrid, rightGrid);
        }
    }
}

function checkWords(leftGrid, rightGrid) {
    const leftSquares = leftGrid.querySelectorAll('.square');
    const rightSquares = rightGrid.querySelectorAll('.square');
    let leftGuess = '';
    let rightGuess = '';

    leftSquares.forEach(square => {
        leftGuess += square.textContent;
    });

    rightSquares.forEach(square => {
        rightGuess += square.textContent;
    });

    checkWordInDictionary(leftGuess).then(leftExists => {
        if (!leftExists) {
            showMessageTemporary("Palavra à esquerda não encontrada no dicionário");
            enableInput();
        } else {
            checkWordInDictionary(rightGuess).then(rightExists => {
                if (!rightExists) {
                    showMessageTemporary("Palavra à direita não encontrada no dicionário");
                    enableInput();
                } else {
                    handleWordCheck(leftSquares, leftGuess, correctWordLeft, 'left');
                    handleWordCheck(rightSquares, rightGuess, correctWordRight, 'right');
                    handleEndGame();
                }
            });
        }
    });
}

function handleWordCheck(squares, guess, correctWord, side) {
    let correctWordArray = correctWord.split('');
    let guessArray = guess.split('');
    let correctCount = 0;
    let usedIndexes = [];

    guessArray.forEach((letter, i) => {
        if (letter === correctWordArray[i]) {
            setTimeout(() => {
                squares[i].classList.add('rightp');
                updateAlphabet(letter, 'rightp', side);
            }, i * 500);
            correctWordArray[i] = null;
            guessArray[i] = null;
            correctCount++;
        }
    });

    guessArray.forEach((letter, i) => {
        if (letter !== null && correctWordArray.includes(letter)) {
            let index = correctWordArray.indexOf(letter);
            if (!usedIndexes.includes(index)) {
                setTimeout(() => {
                    squares[i].classList.add('rightl');
                    updateAlphabet(letter, 'rightl', side);
                }, i * 500);
                correctWordArray[index] = null;
                usedIndexes.push(index);
            }
        } else if (letter !== null) {
            setTimeout(() => {
                squares[i].classList.add('wrong');
                updateAlphabet(letter, 'wrong', side);
            }, i * 500);
        }
    });
}

function updateAlphabet(letter, className, side) {
    const alphabetLetter = Array.from(document.querySelectorAll('.alphabet-letter'))
        .find(el => el.textContent === letter);

    if (alphabetLetter) {
        if (className === 'rightp') {
            if (side === 'left') {
                alphabetLetter.style.borderLeftColor = '#3aa394';
            } else {
                alphabetLetter.style.borderRightColor = '#3aa394';
            }
        } else if (className === 'rightl') {
            if (side === 'left') {
                alphabetLetter.style.borderLeftColor = '#d3ad69';
            } else {
                alphabetLetter.style.borderRightColor = '#d3ad69';
            }
        } else if (className === 'wrong') {
            if (side === 'left') {
                alphabetLetter.style.borderLeftColor = '#312a2c';
            } else {
                alphabetLetter.style.borderRightColor = '#312a2c';
            }
        }
    }
}

function handleEndGame() {
    const allLeftCorrect = Array.from(leftGrids).every(grid => {
        const squares = grid.querySelectorAll('.square');
        return Array.from(squares).every(square => square.classList.contains('rightp'));
    });

    const allRightCorrect = Array.from(rightGrids).every(grid => {
        const squares = grid.querySelectorAll('.square');
        return Array.from(squares).every(square => square.classList.contains('rightp'));
    });

    if (allLeftCorrect && allRightCorrect) {
        showMessage("🎉 Parabéns! Você acertou ambas as palavras!");
        disableInput();
        clearHighlight();
    } else if (currentRow < leftGrids.length - 1) {
        currentRow++;
        currentSquare = 0;
        updateRowHighlight();
        focusCurrentSquare();
        enableInput();
    } else {
        disableInput();
        showMessage(`😢 Não foi dessa vez. As palavras corretas eram: ${correctWordLeft} e ${correctWordRight}`);
    }
}

function clearHighlight() {
    leftGrids.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('active-square');
        });
    });

    rightGrids.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('active-square');
        });
    });
}

document.addEventListener('keydown', handleKeydown);
focusCurrentSquare();
loadRandomWords();

restartButton.addEventListener('click', resetGame);
