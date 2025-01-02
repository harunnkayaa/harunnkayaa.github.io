const gameBoard = document.getElementById("game-board");
const statusDisplay = document.getElementById("status");
const questionSection = document.createElement("div"); // Soru kutusu oluşturuluyor
document.body.appendChild(questionSection);
const player1CardsContainer = document.getElementById("player1-cards");
const player2CardsContainer = document.getElementById("player2-cards");
const player1Buttons = document.getElementById("player1-buttons");
const player2Buttons = document.getElementById("player2-buttons");
const playerNameInputs = document.getElementById("player-name-inputs");
const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const startGameButton = document.getElementById("start-game");
//const replayGameButton = document.getElementById("replay-game");
let savedPlayer1Name = "";
let savedPlayer2Name = "";
// Tahta ve oyuncu başlangıç konumları
const grid = [];
const player1Pos = { row: 8, col: 4 };
const player2Pos = { row: 0, col: 4 };
let currentPlayer = 1; // 1: Oyuncu 1, 2: Oyuncu 2
let extraMoveActive = false; // Ekstra hamle kontrolü
let usedQuestions = []; // Kullanılan soruların listesi
let effectInProgress = false; // Etkin kart etkisi kontrolü
let gameStarted = false; // Oyun başlatıldı mı kontrolü
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

startGameButton.addEventListener("click", () => {
  const player1Name = player1NameInput.value.trim() || "Oyuncu 1";
  const player2Name = player2NameInput.value.trim() || "Oyuncu 2";

  // Oyuncu isimlerini güncelle
  document.querySelector("#player1-area h3").textContent = player1Name;
  document.querySelector("#player2-area h3").textContent = player2Name;

  // Giriş ekranını gizle ve oyunu başlat
  playerNameInputs.style.display = "none";
  document.getElementById("game-container").style.display = "flex";

  // Oyuncu sırası durumunu güncelle
  statusDisplay.textContent = `Sıra: ${player1Name} (Mavi)`;

  gameStarted = true; // Oyun başlatıldı
})

// Oyuncuları tahtaya yerleştir
function placePlayer(player, pos) {
  grid[pos.row][pos.col].classList.add(player);
}
placePlayer("player1", player1Pos);
placePlayer("player2", player2Pos);

function checkWin() {
  // Oyuncu 1 (Mavi) için kazanma kontrolü
  if (player1Pos.row === 0 ) { // Oyuncu 1 tam hedef pozisyona ulaştı
    setTimeout(() => {
      alert("Oyuncu 1 (Mavi) kazandı!");
      resetGame();
    }, 100); // Taşı yerleştirdikten sonra bildirim gelir
    return true; // Kazandı, true döndür
  }

  // Oyuncu 2 (Kırmızı) için kazanma kontrolü
  if (player2Pos.row === 8) { // Oyuncu 2 tam hedef pozisyona ulaştı
    setTimeout(() => {
      alert("Oyuncu 2 (Kırmızı) kazandı!");
      resetGame();
    }, 100); // Taşı yerleştirdikten sonra bildirim gelir
    return true; // Kazandı, true döndür
  }

  return false; // Henüz kazanılmadıysa false döndür
}

// Oyunu sıfırlama
function resetGame() {
  // Tahtayı temizle
  grid.forEach(row => row.forEach(cell => (cell.className = "cell")));

  // Oyuncuları başlangıç pozisyonlarına yerleştir
  player1Pos.row = 8;
  player1Pos.col = 4;
  player2Pos.row = 0;
  player2Pos.col = 4;
  placePlayer("player1", player1Pos);
  placePlayer("player2", player2Pos);

  // Kartları yeniden aktif hale getir
  document.querySelectorAll(".card").forEach(card => card.classList.remove("disabled"));

  // Soru alanını temizle ve kullanılan soruları sıfırla
  questionSection.textContent = "";
  usedQuestions = [];

  // Oyuncu sırasını başa al
  currentPlayer = 1;
  extraMoveActive = false;
  effectInProgress = false;

  // Oyuncu alanlarını sıfırla
  document.querySelector("#player1-area h3").textContent = "Oyuncu 1";
  document.querySelector("#player2-area h3").textContent = "Oyuncu 2";

  // İsim giriş alanlarını tekrar görünür yap
  playerNameInputs.style.display = "flex";

  // Durum bilgisini sıfırla
  statusDisplay.textContent = "Sıra: Oyuncu 1 (Mavi)";

  // Oyun başlatıldı durumu sıfırlanır
  gameStarted = false;
}


// Kullanılmayan rastgele bir soru seç
function getRandomQuestion() {
  const allQuestions = JSON.parse(localStorage.getItem("questions"));
  if (!allQuestions || allQuestions.length === 0) {
    alert("Sorular yüklenemedi. Lütfen questions.js dosyasını kontrol edin.");
    return null;
  }

  const availableQuestions = allQuestions.filter((_, index) => !usedQuestions.includes(index));

  if (availableQuestions.length === 0) {
    alert("Tüm sorular kullanıldı!");
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const questionIndex = allQuestions.indexOf(availableQuestions[randomIndex]);

  usedQuestions.push(questionIndex); // Soruyu kullanılanlar listesine ekle
  return availableQuestions[randomIndex];
}


function movePlayer(pos, direction) {
  if (!gameStarted) {
    alert("Oyun başlatılmadı! Lütfen önce Oyunu Başlat butonuna tıklayın.");
    return; // Oyuncunun hareket etmesine izin vermiyoruz
  }

  let newRow = pos.row;
  let newCol = pos.col;

  if (direction === "up") newRow--;
  if (direction === "down") newRow++;
  if (direction === "left") newCol--;
  if (direction === "right") newCol++;

  // Hedef alanın diğer oyuncunun pozisyonu olup olmadığını kontrol et
  const otherPlayerPos = currentPlayer === 1 ? player2Pos : player1Pos;
  if (newRow === otherPlayerPos.row && newCol === otherPlayerPos.col) {
    alert("Bu alanda diğer oyuncu var! Bu hareketi yapamazsınız.");
    return; // Hareket iptal edilir
  }
  if (
    newRow >= 0 &&
    newRow < 9 &&
    newCol >= 0 &&
    newCol < 9 &&
    !grid[newRow][newCol].classList.contains("barrier")
  ) {
    // Önce taşı önceki yerden kaldır
    grid[pos.row][pos.col].classList.remove(currentPlayer === 1 ? "player1" : "player2");

    // Yeni pozisyonu ayarla
    pos.row = newRow;
    pos.col = newCol;

    // Yeni pozisyona taşıyı yerleştir
    grid[pos.row][pos.col].classList.add(currentPlayer === 1 ? "player1" : "player2");

    // Kazandı kontrolü
    if (checkWin()) {
      return; // Oyuncu kazandıysa başka işlem yapılmaz
    }

    if (extraMoveActive) {
      extraMoveActive = false; // Ekstra hamle hakkı kullanıldıktan sonra sona erdirilir
    } else {
      switchPlayer(); // Sıra değişimi
    }
  }
}


// Oyuncuların hareket edebilip edemeyeceğini kontrol etme
function canPlayersMove() {
  const player1CanMove = canMove(player1Pos, false); // Oyuncu 1 hedefe ulaşabilir mi?
  const player2CanMove = canMove(player2Pos, true);  // Oyuncu 2 hedefe ulaşabilir mi?

  console.log(`Oyuncu 1 hareket edebilir mi: ${player1CanMove}`);
  console.log(`Oyuncu 2 hareket edebilir mi: ${player2CanMove}`);

  return player1CanMove && player2CanMove;
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

  // Oyuncu 1'in hedefi en üst sıra, Oyuncu 2'nin hedefi en alt sıra
  if ((!forOpponent && row === 0) || (forOpponent && row === 8)) {
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
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  const currentPlayerName = currentPlayer === 1 ? player1NameInput.value.trim() || "Oyuncu 1" : player2NameInput.value.trim() || "Oyuncu 2";
  statusDisplay.textContent = `Sıra: ${currentPlayerName} (${currentPlayer === 1 ? "Mavi" : "Kırmızı"})`;

  toggleButtons();
}

// Butonların aktiflik kontrolü
function toggleButtons(enable = true) {
  const activeButtons = currentPlayer === 1 ? player1Buttons : player2Buttons;
  const inactiveButtons = currentPlayer === 1 ? player2Buttons : player1Buttons;
  activeButtons.querySelectorAll(".button").forEach(button => (button.disabled = !enable));
  inactiveButtons.querySelectorAll(".button").forEach(button => (button.disabled = true));
}

// Oyun tahtası üzerine tıklama
gameBoard.addEventListener("click", (e) => {
  if (!gameStarted) {
    alert("Oyun başlatılmadı! Lütfen önce Oyunu Başlat butonuna tıklayın.");
    return; // Oyun başlamadan herhangi bir işlem yapılmaz
  }

  if (e.target.classList.contains("cell")) {
    if (!e.target.classList.contains("barrier")) {
      // Yeni engel ekle
      e.target.classList.add("barrier");

      // Oyuncuların hareket edebilirliğini kontrol et
      if (!canPlayersMove()) {
        alert("Bu engeli koymak oyuncuları sıkıştırır! Lütfen başka bir yere koyun.");
        e.target.classList.remove("barrier");
      } else {
        switchPlayer();
      }
    } else {
      // Zaten siyah olan bir butona tıklanırsa mesaj göster
      //alert("Buraya zaten bir engel yerleştirilmiş.");
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
  if (!gameStarted) {
    alert("Oyun başlatılmadı! Lütfen önce Oyunu Başlat butonuna tıklayın.");
    return; // Oyun başlamadan kart seçimine izin verilmez
  }
  if (player !== currentPlayer) {
    alert("Sıra sizde değil!");
    return;
  }

  if (cardElement.classList.contains("disabled")) {
    alert("Bu kart zaten kullanıldı!");
    return;
  }

  const question = getRandomQuestion();
  if (!question) return;

  let optionsText = question.options.map((option, index) => `${index + 1}: ${option}`).join("\n");
  const answer = prompt(`Soru: ${question.text}\n\n${optionsText}`);

  if (answer === question.correctAnswer.toString()) {
    questionSection.textContent = `Doğru cevap! '${effect}' etkisi uygulanıyor.`;
    applyCardEffect(effect);
  } else {
    questionSection.textContent = "Yanlış cevap! Kart hakkınızı kaybettiniz.";
    switchPlayer();
  }
  cardElement.classList.add("disabled");
  setTimeout(() => { questionSection.textContent = ""; }, 3000); // Soru mesajını temizle
}

// Kart etkilerini uygulama
function applyCardEffect(effect) {
  if (effect === "Engel Kaldırma Hakkı") {
    effectInProgress = true; // Etki başladı
    toggleButtons(false); // Yön butonlarını devre dışı bırak
    //toggleButtons(false);// sadece engel kaldıracak ekstra hamle yapamayacak
    gameBoard.addEventListener("click", (e) => {
      if (e.target.classList.contains("barrier")) {
        
        e.target.classList.remove("barrier");
        effectInProgress = false; // Etki sona erdi
       // switchPlayer();
        switchPlayer();
      }
    }, { once: true });
  } else if (effect === "Ekstra Hamle Hakkı") {
    extraMoveActive = true; // Ekstra hamle hakkı aktif edilir
    toggleButtons(true);
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
