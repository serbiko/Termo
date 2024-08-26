const grids = document.querySelectorAll('.grid');
let currentRow = 0;
let currentSquare = 0;
let correctWord = ''; // Palavra correta para comparação
let isInputLocked = false; // Variável para controlar o bloqueio de entrada

// Função para carregar palavras de 5 letras do arquivo palavras.txt
async function loadRandomWord() {
    const response = await fetch('palavras.txt');
    const text = await response.text();
    const words = text.split('\n').map(word => word.trim()).filter(word => word.length === 5);
    correctWord = words[Math.floor(Math.random() * words.length)].toUpperCase(); // Seleciona uma palavra aleatória
    console.log(correctWord);
}

// Função para verificar se a palavra existe no dicionário
async function checkWordInDictionary(word) {
    const response = await fetch('dicionario.txt');
    const text = await response.text();
    const words = text.split('\n').map(w => w.trim().toUpperCase());
    return words.includes(word);
}

// Função para exibir mensagem temporária
function showMessageTemporary(messageText) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = messageText;
    messageElement.style.display = 'block'; // Mostra a mensagem

    setTimeout(() => {
        messageElement.style.display = 'none'; // Oculta a mensagem após 4 segundos
    }, 4000);
}

// Função para destacar o quadrado atual
function focusCurrentSquare() {
    const currentGrid = grids[currentRow];
    const squares = currentGrid.querySelectorAll('.square');
    squares.forEach((square, index) => {
        if (index === currentSquare) {
            square.classList.add('active-square'); // Adiciona destaque ao quadrado ativo
        } else {
            square.classList.remove('active-square'); // Remove o destaque dos outros quadrados
        }
    });
    squares[currentSquare].focus(); // Foca no quadrado atual
}

// Função para verificar se a linha está completamente preenchida
function isRowFilled(grid) {
    const squares = grid.querySelectorAll('.square');
    return Array.from(squares).every(square => square.textContent !== '');
}

// Função para desabilitar a entrada
function disableInput() {
    isInputLocked = true; // Bloqueia a entrada
}

// Função para habilitar a entrada
function enableInput() {
    isInputLocked = false; // Desbloqueia a entrada
}

// Função para atualizar a cor da linha ativa
function updateRowHighlight() {
    grids.forEach((grid, index) => {
        if (index === currentRow) {
            grid.classList.add('active'); // Destaca os quadrados da linha ativa
        } else {
            grid.classList.remove('active'); // Remove o destaque dos quadrados de outras linhas
            const squares = grid.querySelectorAll('.square');
            squares.forEach(square => square.classList.remove('active-square')); // Remove a borda preta da linha anterior
        }
    });
}

// Evento de clique para focar no quadrado clicado, apenas se estiver na linha ativa
grids.forEach((grid, rowIndex) => {
    const squares = grid.querySelectorAll('.square');
    squares.forEach((square, squareIndex) => {
        square.addEventListener('click', () => {
            if (rowIndex === currentRow && !isInputLocked) {  // Só permite clicar na linha ativa e se a entrada não estiver bloqueada
                currentSquare = squareIndex;
                focusCurrentSquare();
            }
        });
    });
});

// Função para capturar as teclas digitadas
function handleKeydown(e) {
    if (isInputLocked) return; // Bloqueia a entrada se a variável de controle estiver ativada

    const currentGrid = grids[currentRow];
    const squares = currentGrid.querySelectorAll('.square');

    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) { // Aceita apenas letras
        if (currentSquare < squares.length) {
            squares[currentSquare].textContent = e.key.toUpperCase(); // Preenche o quadrado com a letra
            if (currentSquare < 4) {
                currentSquare++;
                focusCurrentSquare(); // Move o foco para o próximo quadrado
            } else if (currentSquare === 4) {
                clearHighlight(); // Remove o destaque quando os 5 quadrados estão preenchidos
            }
        }
    } else if (e.key === 'Backspace') { // Apaga o conteúdo do quadrado atual e volta para o anterior
        if (currentSquare === 4 && squares[currentSquare].textContent !== '') {
            squares[currentSquare].textContent = ''; // Apaga o conteúdo do quadrado atual
            focusCurrentSquare(); // Restaura o foco ao quadrado 4
        } else if (currentSquare > 0 && squares[currentSquare].textContent === '') {
            currentSquare--;
            squares[currentSquare].textContent = '';
            focusCurrentSquare(); // Restaura o foco ao quadrado atual
        } else if (currentSquare === 0 && squares[currentSquare].textContent !== '') {
            squares[currentSquare].textContent = ''; // Limpa o primeiro quadrado
        }
    } else if (e.key === 'Enter') { // Passa para a próxima linha ao pressionar Enter, se a linha estiver preenchida
        if (isRowFilled(currentGrid)) {
            clearHighlight(); // Remove o destaque antes de verificar a palavra
            checkWord(currentGrid); // Verifica se a palavra está correta
        }
    } else if (e.key === 'ArrowLeft') { 
        if (isRowFilled(currentGrid) && !currentGrid.querySelector('.active-square')) {
            currentSquare = 4; // Move para o último quadrado
            focusCurrentSquare(); // Restaura o foco no último quadrado
        } else if (currentSquare > 0) {
            currentSquare--;
            focusCurrentSquare(); // Move o foco para o quadrado anterior
        }
    } else if (e.key === 'ArrowRight') { 
        if (isRowFilled(currentGrid) && !currentGrid.querySelector('.active-square')) {
            currentSquare = 0; // Move para o primeiro quadrado
            focusCurrentSquare(); // Restaura o foco no primeiro quadrado
        } else if (currentSquare < squares.length - 1) {
            currentSquare++;
            focusCurrentSquare(); // Move o foco para o próximo quadrado
        }
    }
}

// Função para verificar a palavra digitada e compará-la com a palavra correta
async function checkWord(grid) {
    const squares = grid.querySelectorAll('.square');
    let guess = '';

    squares.forEach(square => {
        guess += square.textContent;
    });

    // Verifica se a palavra existe no dicionário
    const wordExists = await checkWordInDictionary(guess);

    if (!wordExists) {
        showMessageTemporary("Palavra não encontrada no dicionário");
        return;
    }

    let correctWordArray = correctWord.split(''); // Converte a palavra correta em array
    let guessArray = guess.split(''); // Converte o palpite em array
    let correctCount = 0; // Contador para letras corretas

    // Primeiro, marque os acertos (verde)
    guessArray.forEach((letter, i) => {
        if (letter === correctWordArray[i]) {
            squares[i].classList.add('rightp'); // Marca como verde
            correctWordArray[i] = null; // Marca esta posição como usada
            guessArray[i] = null; // Marca esta posição como usada no palpite
            correctCount++; // Incrementa o contador de letras corretas
        }
    });

    // Agora, marque os acertos na posição errada (amarelo)
    guessArray.forEach((letter, i) => {
        if (letter !== null && correctWordArray.includes(letter)) {
            squares[i].classList.add('rightl'); // Marca como amarelo
            correctWordArray[correctWordArray.indexOf(letter)] = null; // Marca esta letra como usada
        } else if (letter !== null) {
            squares[i].classList.add('wrong'); // Marca como errado
        }
    });

    // Por último, aplique o flip (rotação) para todas as letras
    squares.forEach((square, i) => {
        setTimeout(() => {
            square.classList.add('flip'); // Aplica a animação flip
        }, i * 500); // Aplica o intervalo de 0.5s entre cada quadrado
    });

    // Bloqueia a entrada enquanto a animação está em execução
    disableInput();

    // Após a animação, decide se o usuário pode avançar ou se o jogo terminou
    setTimeout(() => {
        if (correctCount === correctWord.length) {
            showMessage("🎉 Parabéns! Você acertou a palavra!");
            disableInput(); // Desabilita a entrada se o usuário acertou a palavra
            clearHighlight(); // Remove os destaques de todas as letras
        } else if (currentRow < grids.length - 1) {
            currentRow++; // Avança para a próxima linha
            currentSquare = 0; // Reinicia no primeiro quadrado
            updateRowHighlight(); // Atualiza o destaque da nova linha
            focusCurrentSquare(); // Foca no primeiro quadrado da nova linha
            enableInput(); // Habilita a entrada novamente após liberar a próxima linha
        } else {
            disableInput(); // Desabilita a entrada após a última tentativa
            showMessage(`😢 Não foi dessa vez. A palavra correta era: ${correctWord}`);
        }
    }, squares.length * 500 + 500); // Espera a animação de flip terminar antes de permitir avançar ou encerrar
}

function clearHighlight() {
    grids.forEach(grid => {
        const squares = grid.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('active-square'); // Remove o destaque de todas as letras
        });
    });
}

// Inicializa com a primeira linha destacada e carrega a palavra aleatória
updateRowHighlight();
document.addEventListener('keydown', handleKeydown);
focusCurrentSquare();
loadRandomWord();
