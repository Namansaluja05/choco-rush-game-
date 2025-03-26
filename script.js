const board = document.getElementById("game-board");
const chocoTypes = ["images/choco1.png", "images/choco2.png", "images/choco3.png", "images/choco4.png"];
const boardSize = 8;
let chocolates = [];
let selectedChoco = null;

function createBoard() {
    chocolates = [];
    board.innerHTML = "";
    for (let i = 0; i < boardSize * boardSize; i++) {
        const choco = document.createElement("div");
        choco.classList.add("choco");
        const randomChoco = chocoTypes[Math.floor(Math.random() * chocoTypes.length)];
        choco.style.backgroundImage = `url(${randomChoco})`;
        choco.dataset.type = randomChoco;
        choco.dataset.index = i;
        choco.addEventListener("click", selectChoco);
        board.appendChild(choco);
        chocolates.push(choco);
    }
}

function selectChoco(event) {
    const choco = event.target;
    if (!selectedChoco) {
        selectedChoco = choco;
        choco.classList.add("selected");
    } else {
        if (isAdjacent(selectedChoco, choco)) {
            swapChoco(selectedChoco, choco, true);
            selectedChoco.classList.remove("selected");
            selectedChoco = null;
        } else {
            selectedChoco.classList.remove("selected");
            selectedChoco = null;
        }
    }
}

function isAdjacent(choco1, choco2) {
    const index1 = parseInt(choco1.dataset.index);
    const index2 = parseInt(choco2.dataset.index);
    const diff = Math.abs(index1 - index2);
    return (diff === 1 && Math.floor(index1 / boardSize) === Math.floor(index2 / boardSize)) || diff === boardSize;
}

function swapChoco(choco1, choco2, validate) {
    const tempType = choco1.dataset.type;
    choco1.dataset.type = choco2.dataset.type;
    choco2.dataset.type = tempType;

    choco1.style.backgroundImage = `url(${choco1.dataset.type})`;
    choco2.style.backgroundImage = `url(${choco2.dataset.type})`;

    if (validate) {
        setTimeout(() => {
            if (!checkMatches()) {
                swapChoco(choco1, choco2, false);
            }
        }, 300);
    }
}

function checkMatches() {
    let matched = new Set();
    for (let i = 0; i < chocolates.length; i++) {
        if (i % boardSize < boardSize - 2 &&
            chocolates[i].dataset.type === chocolates[i + 1].dataset.type &&
            chocolates[i].dataset.type === chocolates[i + 2].dataset.type) {
            matched.add(i); matched.add(i + 1); matched.add(i + 2);
        }
        if (i < boardSize * (boardSize - 2) &&
            chocolates[i].dataset.type === chocolates[i + boardSize].dataset.type &&
            chocolates[i].dataset.type === chocolates[i + boardSize * 2].dataset.type) {
            matched.add(i); matched.add(i + boardSize); matched.add(i + boardSize * 2);
        }
    }
    if (matched.size > 0) {
        removeMatches([...matched]);
        return true;
    }
    return false;
}

function removeMatches(matched) {
    matched.forEach(index => {
        chocolates[index].style.opacity = "0";
        chocolates[index].dataset.type = "";
    });
    setTimeout(dropChocolates, 300);
}

function dropChocolates() {
    for (let col = 0; col < boardSize; col++) {
        let emptySpaces = [];
        for (let row = boardSize - 1; row >= 0; row--) {
            let index = row * boardSize + col;
            if (chocolates[index].dataset.type === "") {
                emptySpaces.push(index);
            } else if (emptySpaces.length > 0) {
                let newIndex = emptySpaces.shift();
                chocolates[newIndex].dataset.type = chocolates[index].dataset.type;
                chocolates[newIndex].style.backgroundImage = chocolates[index].style.backgroundImage;
                chocolates[newIndex].style.opacity = "1";
                chocolates[index].dataset.type = "";
                chocolates[index].style.backgroundImage = "none";
                emptySpaces.push(index);
            }
        }
    }
    setTimeout(refillBoard, 200);
}

function refillBoard() {
    for (let i = 0; i < boardSize * boardSize; i++) {
        if (chocolates[i].dataset.type === "") {
            const newType = chocoTypes[Math.floor(Math.random() * chocoTypes.length)];
            chocolates[i].dataset.type = newType;
            chocolates[i].style.backgroundImage = `url(${newType})`;
            chocolates[i].style.opacity = "1";
        }
    }
    setTimeout(() => {
        if (checkMatches()) {
            removeMatches();
        }
    }, 300);
}

createBoard();
