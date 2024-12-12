const gameBoard = document.getElementById("game-board");
const statusDisplay = document.getElementById("status");
const questionSection = document.getElementById("question-section");
const player1CardsContainer = document.getElementById("player1-cards");
const player2CardsContainer = document.getElementById("player2-cards");

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

// Oyuncu sırasını değiştirme
function switchPlayer() {
  if (extraMoveActive) {
    extraMoveActive = false; // Ekstra hamle tamamlandıktan sonra sıfırlanır
    return;
  }
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  statusDisplay.textContent = `Sıra: Oyuncu ${currentPlayer} (${
    currentPlayer === 1 ? "Mavi" : "Kırmızı"
  })`;
}

// Engel koyma
gameBoard.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("cell") &&
    !e.target.classList.contains("barrier")
  ) {
    // Engel koymadan önce kontrol
    e.target.classList.add("barrier");
    if (!canPlayersMove()) {
      alert("Bu engeli koymak oyuncuları sıkıştırır! Lütfen başka bir yere koyun.");
      e.target.classList.remove("barrier");
    } else {
      switchPlayer();
    }
  }
});

// Oyuncuların hareket edebilip edemeyeceğini kontrol etme
function canPlayersMove() {
  return canReachTarget(player1Pos) && canReachTarget(player2Pos);
}
// Oyuncuların hareket edebilip edemeyeceğini kontrol etme
function canPlayersMove() {
    return canMove(player1Pos) && canMove(player2Pos);
  }
  
  // Bir oyuncunun herhangi bir yere hareket edebilip edemeyeceğini kontrol etme
  function canMove(pos) {
    const visited = new Set();
    return dfs(pos.row, pos.col, visited);
  }
  
  // DFS ile oyuncunun hareket edebileceği yolları kontrol et
  function dfs(row, col, visited) {
    const key = `${row}-${col}`;
    if (visited.has(key)) return false; // Daha önce ziyaret edilen hücreleri tekrar kontrol etme
    visited.add(key);
  
    // Eğer oyuncu hedef çizgisine ulaştıysa
    if ((currentPlayer === 1 && row === 0) || (currentPlayer === 2 && row === 8)) {
      return true;
    }
  
    // Tüm yönlere bak: yukarı, aşağı, sol, sağ
    const directions = [
      { row: -1, col: 0 }, // yukarı
      { row: 1, col: 0 },  // aşağı
      { row: 0, col: -1 }, // sola
      { row: 0, col: 1 },  // sağa
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
        if (dfs(newRow, newCol, visited)) {
          return true;
        }
      }
    }
  
    return false; // Hiçbir yere hareket edilemiyorsa
  }
  
  // Engel koyma
  gameBoard.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("cell") &&
      !e.target.classList.contains("barrier")
    ) {
      // Engel koymadan önce kontrol
      e.target.classList.add("barrier");
      if (!canPlayersMove()) {
        alert("Bu engeli koymak oyuncuları sıkıştırır! Lütfen başka bir yere koyun.");
        e.target.classList.remove("barrier");
      } else {
        switchPlayer();
      }
    }
  });
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
  switchPlayer();
}

// Kart etkilerini uygulama
function applyCardEffect(effect) {
  if (effect === "Engel Kaldırma Hakkı") {
    gameBoard.addEventListener("click", removeBarrier, { once: true });
  } else if (effect === "Ekstra Hamle Hakkı") {
    extraMoveActive = true;
  } else if (effect === "Hamle Yapamama Cezası") {
    switchPlayer();
  }
}

// Engel kaldırma
function removeBarrier(e) {
  if (e.target.classList.contains("barrier")) {
    e.target.classList.remove("barrier");
    switchPlayer();
  }
}

// Klavye ile hareket kontrolü
document.addEventListener("keydown", (e) => {
  const pos = currentPlayer === 1 ? player1Pos : player2Pos;
  if (currentPlayer === 1) {
    if (e.key === "ArrowUp") movePlayer(pos, "up");
    if (e.key === "ArrowDown") movePlayer(pos, "down");
    if (e.key === "ArrowLeft") movePlayer(pos, "left");
    if (e.key === "ArrowRight") movePlayer(pos, "right");
  } else if (currentPlayer === 2) {
    if (e.key === "w") movePlayer(pos, "up");
    if (e.key === "s") movePlayer(pos, "down");
    if (e.key === "a") movePlayer(pos, "left");
    if (e.key === "d") movePlayer(pos, "right");
  }
});

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

    if (!extraMoveActive) {
      switchPlayer(); // Eğer ekstra hamle etkisi yoksa oyuncu sırası değişir
    }
  }
}
