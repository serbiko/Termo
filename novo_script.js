const gridsLeft = document.querySelectorAll('.left-side .grid');
const gridsRight = document.querySelectorAll('.right-side .grid');
let currentRow = 0;
let currentSquare = 0;
let correctWordLeft = '';
let correctWordRight = '';
let isInputLocked = false;
let usedWords = [];
let wordCorrectLeft = false;
let wordCorrectRight = false;
let isLeftInputLocked = false;
let isRightInputLocked = false;
let correctWordsCount = 0; // Variável para contar o número de palavras corretas

async function loadRandomWords() {
    const response = await fetch('palavras.txt');
    const text = await response.text();
    const words = text.split('\n').map(word => word.trim()).filter(word => word.length === 5);

    do {
        correctWordLeft = words[Math.floor(Math.random() * words.length)].toUpperCase();
        correctWordRight = words[Math.floor(Math.random() * words.length)].toUpperCase();
    } while (correctWordLeft === correctWordRight || usedWords.includes(correctWordLeft) || usedWords.includes(correctWordRight));

    usedWords.push(correctWordLeft, correctWordRight);
    console.log('Left:', correctWordLeft, 'Right:', correctWordRight);
}

function resetGame() {
    restartButton.style.display = 'none';
    document.getElementById('message').style.display = 'none';

    gridsLeft.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.textContent = '';
            square.classList.remove('rightp', 'rightl', 'wrong', 'completed');
        });
    });

    gridsRight.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.textContent = '';
            square.classList.remove('rightp', 'rightl', 'wrong', 'completed');
        });
    });

    const alphabetLetters = document.querySelectorAll('.alphabet-letter');
    alphabetLetters.forEach(letter => {
        letter.classList.remove('rightp', 'rightl', 'wrong', 'left-right', 'right-left');
    });

    currentRow = 0;
    currentSquare = 0;
    correctWordsCount = 0; // Reseta o contador de palavras corretas
    wordCorrectLeft = false;
    wordCorrectRight = false;
    isLeftInputLocked = false;
    isRightInputLocked = false;
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
    if (!isLeftInputLocked) {
        const currentGridLeft = gridsLeft[currentRow];
        const squaresLeft = currentGridLeft.querySelectorAll('.square');
        squaresLeft.forEach((square, index) => {
            if (index === currentSquare) {
                square.classList.add('active-square');
            } else {
                square.classList.remove('active-square');
            }
        });
        squaresLeft[currentSquare].focus();
    }

    if (!isRightInputLocked) {
        const currentGridRight = gridsRight[currentRow];
        const squaresRight = currentGridRight.querySelectorAll('.square');
        squaresRight.forEach((square, index) => {
            if (index === currentSquare) {
                square.classList.add('active-square');
            } else {
                square.classList.remove('active-square');
            }
        });
        squaresRight[currentSquare].focus();
    }
}

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
    gridsLeft.forEach((grid, index) => {
        if (!isLeftInputLocked && index === currentRow) {
            grid.classList.add('active');
        } else {
            grid.classList.remove('active');
            const squares = grid.querySelectorAll('.square');
            squares.forEach(square => square.classList.remove('active-square'));
        }
    });

    gridsRight.forEach((grid, index) => {
        if (!isRightInputLocked && index === currentRow) {
            grid.classList.add('active');
        } else {
            grid.classList.remove('active');
            const squares = grid.querySelectorAll('.square');
            squares.forEach(square => square.classList.remove('active-square'));
        }
    });
}

function addClickAndTouchEventListener(element, callback) {
    let touchEventFired = false;

    element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchEventFired = true;
        callback();
    });

    element.addEventListener('click', (e) => {
        if (!touchEventFired) {
            e.preventDefault();
            callback();
        }
        touchEventFired = false;
    });
}

function updateAlphabet(letter, className, side) {
    const alphabetLetter = Array.from(document.querySelectorAll('.alphabet-letter'))
        .find(el => el.textContent === letter);

    if (alphabetLetter) {
        if (side === 'left') {
            // Atualiza apenas a metade esquerda
            if (className === 'rightp' && !alphabetLetter.classList.contains('rightp-left')) {
                alphabetLetter.classList.remove('rightl-left', 'wrong-left');
                alphabetLetter.classList.add('rightp-left');
            } else if (className === 'rightl' && !alphabetLetter.classList.contains('rightp-left') && !alphabetLetter.classList.contains('rightl-left')) {
                alphabetLetter.classList.add('rightl-left');
            } else if (className === 'wrong' && !alphabetLetter.classList.contains('rightp-left') && !alphabetLetter.classList.contains('rightl-left')) {
                alphabetLetter.classList.add('wrong-left');
            }
        } else if (side === 'right') {
            // Atualiza apenas a metade direita
            if (className === 'rightp' && !alphabetLetter.classList.contains('rightp-right')) {
                alphabetLetter.classList.remove('rightl-right', 'wrong-right');
                alphabetLetter.classList.add('rightp-right');
            } else if (className === 'rightl' && !alphabetLetter.classList.contains('rightp-right') && !alphabetLetter.classList.contains('rightl-right')) {
                alphabetLetter.classList.add('rightl-right');
            } else if (className === 'wrong' && !alphabetLetter.classList.contains('rightp-right') && !alphabetLetter.classList.contains('rightl-right')) {
                alphabetLetter.classList.add('wrong-right');
            }
        }
    }
}



function lockLeftSide() {
    isLeftInputLocked = true;
    gridsLeft.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.add('completed');
        });
    });
}

function lockRightSide() {
    isRightInputLocked = true;
    gridsRight.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.add('completed');
        });
    });
}

async function checkWord(gridLeft, gridRight) {
    const squaresLeft = gridLeft.querySelectorAll('.square');
    const squaresRight = gridRight.querySelectorAll('.square');
    let guessLeft = '';
    let guessRight = '';

    squaresLeft.forEach(square => {
        guessLeft += square.textContent;
    });

    squaresRight.forEach(square => {
        guessRight += square.textContent;
    });

    const wordExistsLeft = await checkWordInDictionary(guessLeft);
    const wordExistsRight = await checkWordInDictionary(guessRight);

    if (!wordExistsLeft || !wordExistsRight) {
        showMessageTemporary("Palavra não encontrada no dicionário");
        enableInput();
        return;
    }

    let correctWordArrayLeft = correctWordLeft.split('');
    let guessArrayLeft = guessLeft.split('');
    let correctCountLeft = 0;

    let correctWordArrayRight = correctWordRight.split('');
    let guessArrayRight = guessRight.split('');
    let correctCountRight = 0;

    let usedIndexesLeft = [];
    let usedIndexesRight = [];

    if (!isLeftInputLocked) {
        guessArrayLeft.forEach((letter, i) => {
            if (letter === correctWordArrayLeft[i]) {
                setTimeout(() => {
                    squaresLeft[i].classList.add('rightp');
                    updateAlphabet(letter, 'rightp', 'left');
                }, i * 500);
                correctWordArrayLeft[i] = null;
                guessArrayLeft[i] = null;
                correctCountLeft++;
            }
        });

        guessArrayLeft.forEach((letter, i) => {
            if (letter !== null && correctWordArrayLeft.includes(letter)) {
                let index = correctWordArrayLeft.indexOf(letter);
                if (!usedIndexesLeft.includes(index)) {
                    setTimeout(() => {
                        squaresLeft[i].classList.add('rightl');
                        updateAlphabet(letter, 'rightl', 'left');
                    }, i * 500);
                    correctWordArrayLeft[index] = null;
                    usedIndexesLeft.push(index);
                }
            } else if (letter !== null) {
                setTimeout(() => {
                    squaresLeft[i].classList.add('wrong');
                    updateAlphabet(letter, 'wrong', 'left');
                }, i * 500);
            }
        });
    }

    if (!isRightInputLocked) {
        guessArrayRight.forEach((letter, i) => {
            if (letter === correctWordArrayRight[i]) {
                setTimeout(() => {
                    squaresRight[i].classList.add('rightp');
                    updateAlphabet(letter, 'rightp', 'right');
                }, i * 500);
                correctWordArrayRight[i] = null;
                guessArrayRight[i] = null;
                correctCountRight++;
            }
        });

        guessArrayRight.forEach((letter, i) => {
            if (letter !== null && correctWordArrayRight.includes(letter)) {
                let index = correctWordArrayRight.indexOf(letter);
                if (!usedIndexesRight.includes(index)) {
                    setTimeout(() => {
                        squaresRight[i].classList.add('rightl');
                        updateAlphabet(letter, 'rightl', 'right');
                    }, i * 500);
                    correctWordArrayRight[index] = null;
                    usedIndexesRight.push(index);
                }
            } else if (letter !== null) {
                setTimeout(() => {
                    squaresRight[i].classList.add('wrong');
                    updateAlphabet(letter, 'wrong', 'right');
                }, i * 500);
            }
        });
    }

    disableInput();

    setTimeout(() => {
        let leftWordCorrect = correctCountLeft === correctWordLeft.length;
        let rightWordCorrect = correctCountRight === correctWordRight.length;

        if (leftWordCorrect && !isLeftInputLocked) {
            showMessageTemporary("🎉 Você acertou a palavra da esquerda!");
            lockLeftSide();
            correctWordsCount++; // Incrementa o contador
        }

        if (rightWordCorrect && !isRightInputLocked) {
            showMessageTemporary("🎉 Você acertou a palavra da direita!");
            lockRightSide();
            correctWordsCount++; // Incrementa o contador
        }

        if (correctWordsCount === 2) {
            showMessage("🎉 Parabéns! Você acertou ambas as palavras!");
            disableInput();
            clearHighlight();
            restartButton.style.display = 'block';
        } else if (currentRow < gridsLeft.length - 1) {
            currentRow++;
            currentSquare = 0;
            updateRowHighlight();
            focusCurrentSquare();
            enableInput();
        } else if (correctWordsCount < 2) {
            disableInput();
            showMessage(`😢 Não foi dessa vez. As palavras corretas eram: ${correctWordLeft} e ${correctWordRight}`);
            restartButton.style.display = 'block';
        }
    }, Math.max(squaresLeft.length, squaresRight.length) * 400 + 500);
}

function handleKeydown(e) {
    if (isInputLocked) return;

    const currentGridLeft = gridsLeft[currentRow];
    const squaresLeft = currentGridLeft.querySelectorAll('.square');
    const currentGridRight = gridsRight[currentRow];
    const squaresRight = currentGridRight.querySelectorAll('.square');

    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        // Verifica se o lado esquerdo ou direito está travado
        if (!isLeftInputLocked) {
            squaresLeft[currentSquare].textContent = e.key.toUpperCase();
            squaresLeft[currentSquare].classList.remove('pop-animation');
            void squaresLeft[currentSquare].offsetWidth;
            squaresLeft[currentSquare].classList.add('pop-animation');
        }
        if (!isRightInputLocked) {
            squaresRight[currentSquare].textContent = e.key.toUpperCase();
            squaresRight[currentSquare].classList.remove('pop-animation');
            void squaresRight[currentSquare].offsetWidth;
            squaresRight[currentSquare].classList.add('pop-animation');
        }

        if (currentSquare < 4) {
            currentSquare++;
            focusCurrentSquare();
        } else if (currentSquare === 4) {
            clearHighlight();
        }
    } else if (e.key === 'Backspace') {
        if (currentSquare > 0 && squaresLeft[currentSquare].textContent === '' && squaresRight[currentSquare].textContent === '') {
            currentSquare--;
        }
        if (!isLeftInputLocked) {
            squaresLeft[currentSquare].textContent = '';
        }
        if (!isRightInputLocked) {
            squaresRight[currentSquare].textContent = '';
        }
        focusCurrentSquare();
    } else if (e.key === 'Enter') {
        // Verifica se as linhas estão preenchidas e o lado não está travado
        if (!isLeftInputLocked && isRowFilled(currentGridLeft) && !isRightInputLocked && isRowFilled(currentGridRight)) {
            clearHighlight();
            disableInput();
            checkWord(currentGridLeft, currentGridRight);
        } else if (!isLeftInputLocked && isRowFilled(currentGridLeft)) {
            clearHighlight();
            disableInput();
            checkWord(currentGridLeft, currentGridRight);
        } else if (!isRightInputLocked && isRowFilled(currentGridRight)) {
            clearHighlight();
            disableInput();
            checkWord(currentGridLeft, currentGridRight);
        }
    } else if (e.key === 'ArrowLeft') {
        if (!squaresLeft[currentSquare].classList.contains('active-square') && !squaresRight[currentSquare].classList.contains('active-square')) {
            // Se o destaque sumiu, reaparece no último índice ao pressionar a seta para a esquerda
            currentSquare = 4;
            focusCurrentSquare();
        } else if (currentSquare > 0) {
            currentSquare--;
            focusCurrentSquare();
        }
    } else if (e.key === 'ArrowRight') {
        if (!squaresLeft[currentSquare].classList.contains('active-square') && !squaresRight[currentSquare].classList.contains('active-square')) {
            // Se o destaque sumiu, reaparece no primeiro índice ao pressionar a seta para a direita
            currentSquare = 0;
            focusCurrentSquare();
        } else if (currentSquare < 4) {
            currentSquare++;
            focusCurrentSquare();
        }
    }
}


gridsLeft.forEach((grid, rowIndex) => {
    const squares = grid.querySelectorAll('.square');
    squares.forEach((square, squareIndex) => {
        square.addEventListener('click', () => {
            if (rowIndex === currentRow && !isInputLocked) {
                currentSquare = squareIndex;
                focusCurrentSquare();
            }
        });
    });
});

gridsRight.forEach((grid, rowIndex) => {
    const squares = grid.querySelectorAll('.square');
    squares.forEach((square, squareIndex) => {
        square.addEventListener('click', () => {
            if (rowIndex === currentRow && !isInputLocked) {
                currentSquare = squareIndex;
                focusCurrentSquare();
            }
        });
    });
});

document.addEventListener('keydown', handleKeydown);

document.querySelectorAll('.alphabet-letter').forEach(button => {
    addClickAndTouchEventListener(button, () => {
        const letter = button.textContent;
        handleKeydown({ key: letter });
    });
});

addClickAndTouchEventListener(document.getElementById('backspace'), () => {
    handleKeydown({ key: 'Backspace' });
});

addClickAndTouchEventListener(document.getElementById('enter'), () => {
    handleKeydown({ key: 'Enter' });
});

function clearHighlight() {
    gridsLeft.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('active-square');
        });
    });

    gridsRight.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('active-square');
        });
    });
}

updateRowHighlight();
focusCurrentSquare();
loadRandomWords();
restartButton.addEventListener('click', resetGame);
