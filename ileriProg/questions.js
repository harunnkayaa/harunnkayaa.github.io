const questions = [
  {
    text: "Dünyanın en yüksek dağı hangisidir?",
    options: ["Everest", "K2", "Kangchenjunga", "Lhotse"],
    correctAnswer: 1
  },
  {
    text: "Hangi gezegen Güneş Sistemi'nde en büyüktür?",
    options: ["Mars", "Venüs", "Jüpiter", "Satürn"],
    correctAnswer: 3
  },
  {
    text: "Hangi ülke Avrupa Birliği'nin resmi dillerinden birine sahip değildir?",
    options: ["Norveç", "Almanya", "Fransa", "Belçika"],
    correctAnswer: 1
  },
  {
    text: "İlk olimpiyat oyunları hangi şehirde düzenlenmiştir?",
    options: ["Atina", "Roma", "Paris", "Londra"],
    correctAnswer: 1
  },
  {
    text: "Hangi ülke en çok nüfusa sahiptir?",
    options: ["Hindistan", "Çin", "ABD", "Rusya"],
    correctAnswer: 2
  },
  {
    text: "Hangisi bir Shakespeare oyunudur?",
    options: ["Macbeth", "Faust", "Ulysses", "Don Kişot"],
    correctAnswer: 1
  },
  {
    text: "Türk Lirası'nın simgesi hangi yıl kullanılmaya başlandı?",
    options: ["2008", "2012", "2016", "2020"],
    correctAnswer: 2
  },
  {
    text: "Hangi şehir iki kıta üzerinde bulunur?",
    options: ["Kahire", "İstanbul", "Moskova", "Sidney"],
    correctAnswer: 2
  },
  {
    text: "Mona Lisa tablosu hangi müzede sergilenmektedir?",
    options: ["Vatikan Müzesi", "Louvre Müzesi", "Metropolitan Müzesi", "Prado Müzesi"],
    correctAnswer: 2
  },
  {
    text: "Türkiye Cumhuriyeti’nin ilk başbakanı kimdir?",
    options: ["İsmet İnönü", "Fethi Okyar", "Refik Saydam", "Celal Bayar"],
    correctAnswer: 1
  },
  {
    text: "En uzun nehir hangisidir?",
    options: ["Amazon Nehri", "Nil Nehri", "Yangtze Nehri", "Mississippi Nehri"],
    correctAnswer: 2
  },
  {
    text: "Eiffel Kulesi hangi şehirde bulunur?",
    options: ["Londra", "Berlin", "Paris", "Roma"],
    correctAnswer: 3
  },
  {
    text: "Türk mutfağına ait olan hangisidir?",
    options: ["Paella", "Sushi", "Kebap", "Tacos"],
    correctAnswer: 3
  },
  {
    text: "İstiklal Marşı’nın şairi kimdir?",
    options: ["Nazım Hikmet", "Mehmet Akif Ersoy", "Tevfik Fikret", "Yahya Kemal Beyatlı"],
    correctAnswer: 2
  },
  {
    text: "Ay hangi gezegenin uydusudur?",
    options: ["Mars", "Venüs", "Dünya", "Jüpiter"],
    correctAnswer: 3
  },
  {
    text: "Hangi elementin kimyasal sembolü 'O'dur?",
    options: ["Oksijen", "Altın", "Gümüş", "Demir"],
    correctAnswer: 1
  },
  {
    text: "Roma İmparatorluğu hangi yılda ikiye bölündü?",
    options: ["27 MÖ", "395", "476", "1453"],
    correctAnswer: 2
  },
  {
    text: "Hangi hayvan dünyanın en hızlı koşucusudur?",
    options: ["Çita", "At", "Tavşan", "Köpek"],
    correctAnswer: 1
  },
  {
    text: "Hangisi bir yazılım dili değildir?",
    options: ["Python", "HTML", "JavaScript", "SQL"],
    correctAnswer: 2
  },
  {
    text: "Hangi kıta en fazla ülkeye sahiptir?",
    options: ["Afrika", "Asya", "Avrupa", "Güney Amerika"],
    correctAnswer: 1
  }
];

// Soruları localStorage'a kaydedin
localStorage.setItem("questions", JSON.stringify(questions));
