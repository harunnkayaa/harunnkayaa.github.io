const questions = [
  {
    text: "JavaScript'te hangi veri tipi bulunmaz?",
    options: ["Sayı", "String", "Boolean", "Float"],
    correctAnswer: 4
  },
  {
    text: "'===' operatörünün anlamı nedir?",
    options: ["Eşitlik", "Katı Eşitlik", "Atama", "Karşılaştırma"],
    correctAnswer: 2
  },
  {
    text: "Bir diziye eleman eklemek için hangi yöntem kullanılır?",
    options: [".push()", ".pop()", ".concat()", ".indexOf()"],
    correctAnswer: 1
  },
  {
    text: "'NaN' JavaScript'te ne anlama gelir?",
    options: ["Bir Sayı Değil", "Sayı ve Null", "Null Değil", "Bir Sayı"],
    correctAnswer: 1
  },
  {
    text: "JavaScript'te bir fonksiyon nasıl tanımlanır?",
    options: ["function myFunction()", "def myFunction()", "fun myFunction()", "function: myFunction()"],
    correctAnswer: 1
  },
  {
    text: "Aşağıdaki seçeneklerden hangisi JavaScript'te bir obje içerisindeki anahtar (key) değerlerini döndüren bir yöntemdir?",
    options: ["Object.keys()", "Object.values()", "Object.entries()", "Object.assign()"],
    correctAnswer: 1
  }
  ,
  {
    text: "JavaScript'te `const` ile tanımlanan bir değişkenin değeri değiştirilebilir mi?",
    options: ["Evet", "Hayır"],
    correctAnswer: 2
  },
  {
    text: "JavaScript'te hangi metot bir diziyi ters çevirir?",
    options: [".reverse()", ".sort()", ".concat()", ".shift()"],
    correctAnswer: 1
  },
  {
    text: "JavaScript'te bir sayının tipini öğrenmek için hangi operatör kullanılır?",
    options: ["typeof", "instanceOf", "getType", "isType"],
    correctAnswer: 1
  },
  {
    text: "JavaScript'te bir değişkeni global olarak tanımlamak için hangi anahtar kelime kullanılır?",
    options: ["let", "var", "const", "static"],
    correctAnswer: 2
  }
];

// Soruları localStorage'a kaydedin
localStorage.setItem("questions", JSON.stringify(questions));
