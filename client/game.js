const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const choicesContainer = Array.from(
  document.getElementsByClassName("choice-container")
);
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = false;
let score = {};
let questionCounter = 0;
let availableQuestions = [];

//CONSTANTS
const CORRECT_BONUS = 1;
let TOTAL_QUESTION = 0;
const QUESTION_CHAPTER_RATIO = 0.25;

let questions = [];

window.addEventListener(
  "keydown",
  function (event) {
    event.preventDefault();

    if (event.key !== undefined) {
      if (event.key === "Tab") {
        this.document.getElementById("nextBtn").click();
      } else if (event.key === "Backspace") {
        this.document.getElementById("resetBtn").click();
      }
    }
  },
  true
);

const NUMBER_OF_CHAPTERS = 16;

fetch(
  "https://app-b1805835.herokuapp.com/questions?ratio=" + QUESTION_CHAPTER_RATIO
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    const result = loadedQuestions;
    TOTAL_QUESTION = loadedQuestions.length;
    questions = result.map((data) => {
      const formattedQuestion = {
        question: data.question,
      };

      const answerChoices = [...data.incorrect_answers];

      formattedQuestion.answer = data.answer;

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

startGame = () => {
  questionCounter = 0;
  score = {};
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= TOTAL_QUESTION) {
    return window.location.assign("/end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${TOTAL_QUESTION}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / TOTAL_QUESTION) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  for (let i = 1; i <= 4; i++) {
    if (currentQuestion[`choice${i}`] === undefined) {
      choicesContainer[i - 1].className = "hidden";
    } else {
      choicesContainer[i - 1].className = "choice-container";
    }
  }

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

let selectedChoice;
let classToApply;

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(TOTAL_QUESTION - availableQuestions.length);
    }

    selectedChoice.parentElement.classList.add(classToApply);
  });
});

resetQuestion = () => {
  acceptingAnswers = true;
  selectedChoice.parentElement.className = "choice-container";
};

nextQuestion = () => {
  if (selectedChoice !== undefined) {
    selectedChoice.parentElement.classList.remove(classToApply);
    getNewQuestion();
  } else {
    alert("Please select an answer");
  }
};

countCorrect = (obj) => {
  let i = 0;
  for (const key in obj) {
    i += obj[key];
  }
  return i;
};

incrementScore = (index) => {
  score[index] = 1;
  scoreText.innerText = countCorrect(score);
};
