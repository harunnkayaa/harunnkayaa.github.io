const gameBoard = document.getElementById("game-board");
const statusDisplay = document.getElementById("status");
const questionSection = document.createElement("div"); // Soru kutusu oluşturuluyor
document.body.appendChild(questionSection);
const player1CardsContainer = document.getElementById("player1-cards");
const player2CardsContainer = document.getElementById("player2-cards");
const player1Buttons = document.getElementById("player1-buttons");
const player2Buttons = document.getElementById("player2-buttons");

// Tahta ve oyuncu başlangıç konumları
const grid = [];
const player1Pos = { row: 8, col: 4 };
const player2Pos = { row: 0, col: 4 };
let currentPlayer = 1; // 1: Oyuncu 1, 2: Oyuncu 2
let extraMoveActive = false; // Ekstra hamle kontrolü

// Kart türleri
const cardEffects = ["Engel Kaldırma Hakkı", "Ekstra Hamle Hakkı", "Hamle Yapamama Cezası"];

// Tahta oluştur
for (let row = 0; row < 9; row++) {
  grid[row] = [];
  for (let col = 0; col < 9; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
    grid[row][col] = cell;
  }
}

// Oyuncuları tahtaya yerleştir
function placePlayer(player, pos) {
  grid[pos.row][pos.col].classList.add(player);
}
placePlayer("player1", player1Pos);
placePlayer("player2", player2Pos);

// Oyuncunun hedefe ulaşıp ulaşmadığını kontrol et
function checkWin() {
  if (player1Pos.row === 0) {
    alert("Oyuncu 1 (Mavi) kazandı!");
    resetGame();
    return true;
  }
  if (player2Pos.row === 8) {
    alert("Oyuncu 2 (Kırmızı) kazandı!");
    resetGame();
    return true;
  }
  return false;
}

// Oyunu sıfırlama
function resetGame() {
  // Tahtayı temizle
  grid.forEach(row => row.forEach(cell => {
    cell.className = "cell";
  }));

  // Oyuncuları başlangıç pozisyonlarına yerleştir
  player1Pos.row = 8;
  player1Pos.col = 4;
  player2Pos.row = 0;
  player2Pos.col = 4;
  placePlayer("player1", player1Pos);
  placePlayer("player2", player2Pos);

  // Kartları yeniden aktif hale getir
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("disabled");
  });

  // Soru alanını temizle
  questionSection.textContent = "";

  // Oyuncu sırasını başa al
  currentPlayer = 1;
  extraMoveActive = false;
  statusDisplay.textContent = "Sıra: Oyuncu 1 (Mavi)";

  toggleButtons();
}

// Oyuncuyu hareket ettirme
function movePlayer(pos, direction) {
  let newRow = pos.row;
  let newCol = pos.col;

  if (direction === "up") newRow--;
  if (direction === "down") newRow++;
  if (direction === "left") newCol--;
  if (direction === "right") newCol++;

  if (
    newRow >= 0 &&
    newRow < 9 &&
    newCol >= 0 &&
    newCol < 9 &&
    !grid[newRow][newCol].classList.contains("barrier")
  ) {
    grid[pos.row][pos.col].classList.remove(currentPlayer === 1 ? "player1" : "player2");
    pos.row = newRow;
    pos.col = newCol;
    grid[pos.row][pos.col].classList.add(currentPlayer === 1 ? "player1" : "player2");

    if (!checkWin()) {
      if (extraMoveActive) {
        extraMoveActive = false; // Ekstra hamle hakkı kullanıldıktan sonra sona erdirilir
      } else {
        switchPlayer();
      }
    }
  }
}

// Oyuncuların hareket edebilip edemeyeceğini kontrol etme
function canPlayersMove() {
  return (
    canMove(player1Pos, currentPlayer === 2) &&
    canMove(player2Pos, currentPlayer === 1)
  );
}

function canMove(pos, forOpponent = false) {
  const visited = new Set();
  return dfs(pos.row, pos.col, visited, forOpponent);
}

// DFS ile oyuncunun hareket edebileceği yolları kontrol et
function dfs(row, col, visited, forOpponent) {
  const key = `${row}-${col}`;
  if (visited.has(key)) return false;
  visited.add(key);

  // Eğer oyuncu hedef çizgisine ulaştıysa
  if ((forOpponent && row === 8) || (!forOpponent && row === 0)) {
    return true;
  }

  // Tüm yönlere bak: yukarı, aşağı, sol, sağ
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  for (let dir of directions) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;

    if (
      newRow >= 0 &&
      newRow < 9 &&
      newCol >= 0 &&
      newCol < 9 &&
      !grid[newRow][newCol].classList.contains("barrier") &&
      !visited.has(`${newRow}-${newCol}`)
    ) {
      if (dfs(newRow, newCol, visited, forOpponent)) {
        return true;
      }
    }
  }

  return false;
}

// Oyuncu sırasını değiştirme
function switchPlayer() {
  if (extraMoveActive) {
    extraMoveActive = false; // Ekstra hamle tamamlandıktan sonra sıfırlanır
    return;
  }
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  statusDisplay.textContent = `Sıra: Oyuncu ${currentPlayer} (${currentPlayer === 1 ? "Mavi" : "Kırmızı"})`;

  toggleButtons();
}

// Butonların aktiflik kontrolü
function toggleButtons() {
  const activeButtons = currentPlayer === 1 ? player1Buttons : player2Buttons;
  const inactiveButtons = currentPlayer === 1 ? player2Buttons : player1Buttons;

  activeButtons.querySelectorAll(".button").forEach((button) => (button.disabled = false));
  inactiveButtons.querySelectorAll(".button").forEach((button) => (button.disabled = true));
}

// Engel koyma
gameBoard.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("cell") &&
    !e.target.classList.contains("barrier")
  ) {
    e.target.classList.add("barrier");
    if (!canPlayersMove()) {
      alert("Bu engeli koymak oyuncuları sıkıştırır! Lütfen başka bir yere koyun.");
      e.target.classList.remove("barrier");
    } else {
      switchPlayer();
    }
  }
});

// Engel kaldırma
function removeBarrier(e) {
  if (e.target.classList.contains("barrier")) {
    e.target.classList.remove("barrier");
    switchPlayer();
  }
}

// Kartları oluştur ve oyuncu alanlarına yerleştir
function createCards(playerContainer, player) {
  cardEffects.forEach((effect, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.textContent = `Kart ${index + 1}`;
    cardElement.addEventListener("click", () => selectCard(effect, player, cardElement));
    playerContainer.appendChild(cardElement);
  });
}
createCards(player1CardsContainer, 1);
createCards(player2CardsContainer, 2);

// Kart seçimi
function selectCard(effect, player, cardElement) {
  if (player !== currentPlayer) {
    alert("Sıra sizde değil!");
    return;
  }

  if (cardElement.classList.contains("disabled")) {
    alert("Bu kart zaten kullanıldı!");
    return;
  }

  questionSection.textContent = `Soru: 5 + 3 = ? (Doğru cevap verirseniz '${effect}' etkisi uygulanacak!)`;
  const answer = prompt("5 + 3 = ?");
  if (answer === "8") {
    questionSection.textContent = `Doğru cevap! '${effect}' etkisi uygulanıyor.`;
    applyCardEffect(effect);
  } else {
    questionSection.textContent = "Yanlış cevap! Kart hakkınızı kaybettiniz.";
  }
  cardElement.classList.add("disabled");
  setTimeout(() => { questionSection.textContent = ""; }, 2000); // Soru mesajını temizle
}

// Kart etkilerini uygulama
function applyCardEffect(effect) {
  if (effect === "Engel Kaldırma Hakkı") {
    gameBoard.addEventListener("click", (e) => {
      if (e.target.classList.contains("barrier")) {
        e.target.classList.remove("barrier");
        switchPlayer();
      }
    }, { once: true });
  } else if (effect === "Ekstra Hamle Hakkı") {
    extraMoveActive = true; // Ekstra hamle hakkı aktif edilir
  } else if (effect === "Hamle Yapamama Cezası") {
    switchPlayer();
  }
}

// Buton olaylarını ekle
player1Buttons.addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    movePlayer(player1Pos, e.target.dataset.direction);
  }
});

player2Buttons.addEventListener("click", (e) => {
  if (e.target.classList.contains("button")) {
    movePlayer(player2Pos, e.target.dataset.direction);
  }
});

toggleButtons(); // Başlangıçta doğru butonları aktif yapar
