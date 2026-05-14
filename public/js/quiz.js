const toggleSidebar = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");

const questionCounter = document.getElementById("questionCounter");
const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const quizProgressBar = document.getElementById("quizProgressBar");
const progressPercent = document.getElementById("progressPercent");
const answeredQuestions = document.getElementById("answeredQuestions");
const unansweredQuestions = document.getElementById("unansweredQuestions");
const totalQuestions = document.getElementById("totalQuestions");
const timerText = document.getElementById("timerText");
const retryButton = document.getElementById("retryButton");

const finalScore = document.getElementById("finalScore");
const earnedPoints = document.getElementById("earnedPoints");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

const savedUser = localStorage.getItem("gamigame_user");

let student = {
  full_name: "Fahmira",
  username: "fahmira",
  role: "student",
};

if (savedUser) {
  try {
    student = JSON.parse(savedUser);
  } catch (error) {
    console.log("Data user tidak valid");
  }
}

const displayName = student.full_name || student.username || "Siswa";

document.getElementById("studentNameTop").textContent = displayName;
document.querySelector(".avatar").textContent = displayName.charAt(0).toUpperCase();

const questions = [
  {
    question: 'What is the meaning of "wake up" in Indonesian?',
    options: [
      "Tidur malam",
      "Bangun tidur",
      "Pergi ke sekolah",
      "Makan siang",
    ],
    correctAnswer: 1,
  },
  {
    question: "Choose the correct Simple Present sentence.",
    options: [
      "She go to school every day.",
      "She goes to school every day.",
      "She going to school every day.",
      "She gone to school every day.",
    ],
    correctAnswer: 1,
  },
  {
    question: 'What is the meaning of "have breakfast"?',
    options: [
      "Sarapan",
      "Mengerjakan PR",
      "Bermain game",
      "Tidur",
    ],
    correctAnswer: 0,
  },
  {
    question: "Complete the sentence: I ___ English every day.",
    options: [
      "studies",
      "study",
      "studying",
      "studied",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which question is correct?",
    options: [
      "Do you practice English every day?",
      "Does you practice English every day?",
      "Are you practice English every day?",
      "Is you practice English every day?",
    ],
    correctAnswer: 0,
  },
  {
    question: 'What is the Indonesian meaning of "do homework"?',
    options: [
      "Membaca buku",
      "Pergi tidur",
      "Mengerjakan PR",
      "Mandi pagi",
    ],
    correctAnswer: 2,
  },
  {
    question: "Choose the correct negative sentence.",
    options: [
      "I do not play games before studying.",
      "I does not play games before studying.",
      "I am not play games before studying.",
      "I not play games before studying.",
    ],
    correctAnswer: 0,
  },
  {
    question: "Complete the conversation: A: How are you today? B: ___",
    options: [
      "I am fine, thank you.",
      "I wake up at five.",
      "I go to school.",
      "I do homework.",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which sentence talks about a daily routine?",
    options: [
      "I usually wake up at 5 a.m.",
      "I went to Bali last year.",
      "I am watching TV now.",
      "I will study tomorrow.",
    ],
    correctAnswer: 0,
  },
  {
    question: "Complete the sentence: He ___ breakfast at six o'clock.",
    options: [
      "have",
      "has",
      "having",
      "had",
    ],
    correctAnswer: 1,
  },
];

let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let timeLeft = 600;
let timerInterval;

totalQuestions.textContent = questions.length;
unansweredQuestions.textContent = questions.length;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const startTimer = () => {
  timerText.textContent = formatTime(timeLeft);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1000);
};

const updateSummary = () => {
  const answered = userAnswers.filter((answer) => answer !== null).length;
  const unanswered = questions.length - answered;
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  answeredQuestions.textContent = answered;
  unansweredQuestions.textContent = unanswered;

  quizProgressBar.style.width = `${progress}%`;
  progressPercent.textContent = `${progress}%`;

  const progressDegree = Math.round((progress / 100) * 360);

  document.querySelector(".progress-circle").style.background =
    `conic-gradient(#6366f1 0deg ${progressDegree}deg, #e5e7eb ${progressDegree}deg 360deg)`;
};

const renderQuestion = () => {
  const currentQuestion = questions[currentQuestionIndex];

  questionCounter.textContent = `Soal ${currentQuestionIndex + 1} dari ${questions.length}`;
  questionText.textContent = currentQuestion.question;
  answerList.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const optionElement = document.createElement("button");
    optionElement.type = "button";
    optionElement.className = "answer-option";

    if (userAnswers[currentQuestionIndex] === index) {
      optionElement.classList.add("selected");
    }

    optionElement.innerHTML = `
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span class="answer-text">${option}</span>
    `;

    optionElement.addEventListener("click", () => {
      userAnswers[currentQuestionIndex] = index;
      renderQuestion();
      updateSummary();
    });

    answerList.appendChild(optionElement);
  });

  previousButton.disabled = currentQuestionIndex === 0;

  if (currentQuestionIndex === questions.length - 1) {
    nextButton.innerHTML = `
      Selesai
      <i class="bi bi-check-circle"></i>
    `;
    nextButton.classList.remove("btn-primary");
    nextButton.classList.add("btn-success");
  } else {
    nextButton.innerHTML = `
      Selanjutnya
      <i class="bi bi-arrow-right"></i>
    `;
    nextButton.classList.remove("btn-success");
    nextButton.classList.add("btn-primary");
  }

  updateSummary();
};

previousButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
});

nextButton.addEventListener("click", () => {
  const currentAnswer = userAnswers[currentQuestionIndex];

  if (currentAnswer === null) {
    alert("Pilih salah satu jawaban terlebih dahulu.");
    return;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

const getDecisionTreeRecommendation = (score) => {
  if (score >= 85) {
    return {
      title: "Rekomendasi: Materi Pengayaan",
      message:
        "Skor kamu sangat baik. Sistem Decision Tree merekomendasikan materi pengayaan: Daily Conversation Practice.",
    };
  }

  if (score >= 60) {
    return {
      title: "Rekomendasi: Latihan Tambahan",
      message:
        "Skor kamu cukup baik. Sistem Decision Tree merekomendasikan latihan tambahan pada Simple Present Tense.",
    };
  }

  return {
    title: "Rekomendasi: Ulangi Materi Dasar",
    message:
      "Skor kamu masih perlu ditingkatkan. Sistem Decision Tree merekomendasikan untuk mengulang materi Vocabulary: Daily Activities.",
  };
};

const finishQuiz = () => {
  clearInterval(timerInterval);

  const totalCorrect = userAnswers.reduce((score, answer, index) => {
    if (answer === questions[index].correctAnswer) {
      return score + 1;
    }

    return score;
  }, 0);

  const scorePercent = Math.round((totalCorrect / questions.length) * 100);
  const pointResult = totalCorrect * 10;
  const recommendation = getDecisionTreeRecommendation(scorePercent);

  finalScore.textContent = `${totalCorrect}/${questions.length}`;
  earnedPoints.textContent = `+${pointResult} Poin`;

  resultTitle.textContent = recommendation.title;
  resultMessage.textContent = recommendation.message;

  const previousPoints = Number(localStorage.getItem("gamigame_points") || 1250);
  localStorage.setItem("gamigame_points", previousPoints + pointResult);

  localStorage.setItem(
    "gamigame_last_quiz_result",
    JSON.stringify({
      quiz_title: "Daily Conversation Practice Quiz",
      score: scorePercent,
      correct: totalCorrect,
      total: questions.length,
      points: pointResult,
      recommendation: recommendation.title,
    })
  );

  const modalElement = document.getElementById("resultModal");
  const resultModal = new bootstrap.Modal(modalElement);
  resultModal.show();
};

retryButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  userAnswers = Array(questions.length).fill(null);
  timeLeft = 600;

  const modalElement = document.getElementById("resultModal");
  const resultModal = bootstrap.Modal.getInstance(modalElement);
  resultModal.hide();

  clearInterval(timerInterval);
  startTimer();
  renderQuestion();
});

renderQuestion();
startTimer();