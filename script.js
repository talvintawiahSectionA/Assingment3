// Define an empty array to hold quiz data
let quizData = [];

// Function to fetch quiz data from API
const fetchQuizData = () => {
  fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy")
    .then((response) => response.json())
    .then((data) => {
      // Check if there's an error in fetching data
      if (data.response_code != 0) {
        console.log("Error, unable to obtain questions from API");
      }
      // Call setUpQuiz function to set up quiz data
      setUpQuiz(data);
      console.log(data);
    })
    .catch((error) => console.log("Error fetching questions from API:", error));
  // Start the quiz after fetching data
  startQuiz();
};

// Function to set up quiz data
const setUpQuiz = (data) => {
  quizData = []; // Clear existing quizData
  data.results.forEach((item) => {
    // Map each item's properties and unescape HTML entities
    const question = unescapeHtml(item.question);
    const correctAnswer = unescapeHtml(item.correct_answer);
    const incorrectAnswers = item.incorrect_answers.map((answer) =>
      unescapeHtml(answer)
    );

    // Push formatted data into quizData array
    quizData.push({
      question: question,
      correctAnswer: correctAnswer,
      possibleAnswers: [...incorrectAnswers, correctAnswer],
    });
  });
};

// DOM elements
const quizContainer = document.getElementById("quiz");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const resultsContainer = document.getElementById("results");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress-bar");

// Variables to track quiz progress and score
let currentQuestionIndex = 0;
let score = 0;

// Function to start the quiz
const startQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  quizContainer.classList.remove("hidden");
  resultsContainer.classList.add("hidden");
  showQuestion();
  resetProgressBar();
};

// Function to display current question and possible answers
const showQuestion = () => {
  const currentQuestion = quizData[currentQuestionIndex];
  questionElement.textContent = currentQuestion["question"];
  answersElement.innerHTML = "";

  currentQuestion["possibleAnswers"].forEach((answer) => {
    const li = document.createElement("li");
    li.textContent = answer;
    li.onclick = selectAnswer;
    answersElement.appendChild(li);
  });
};

// Function to unescape elements from API
const unescapeHtml = (data) => {
  return data
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

// Function to handle user's answer selection
const selectAnswer = (e) => {
  const selectedAnswer = e.target.textContent;
  const correctAnswer = quizData[currentQuestionIndex]["correctAnswer"];

  // Highlight correct and incorrect answers
  Array.from(answersElement.children).forEach((li) => {
    if (li.textContent === correctAnswer) {
      li.classList.add("correct");
    } else {
      li.classList.add("incorrect");
    }
  });

  // Update score if answer is correct
  if (selectedAnswer === correctAnswer) {
    score++;
  }
  // Display next button to proceed to the next question
  nextButton.classList.remove("hidden");
};

//Function to reset progress bar
function resetProgressBar() {
  progressBar.style.width = `0%`;
}

// Function to update progress bar
function updateProgressBar() {
  const percentProgress = ((currentQuestionIndex + 1) / quizData.length) * 100;
  progressBar.style.width = `${percentProgress}%`;
}

// Function to handle next question button click
const nextQuestion = () => {
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    showQuestion();
    updateProgressBar();
  } else {
    // Show quiz results when all questions are answered
    showResults();
  }
};

// Function to display quiz results
const showResults = () => {
  let resultMessage = "";
  quizContainer.classList.add("hidden");
  resultsContainer.classList.remove("hidden");
  let totalScorePercent = score / quizData.length;
  // Determine result message based on score percentage
  if (totalScorePercent > 0.8) {
    resultMessage = "Why are you even taking this test, you're too good";
  } else {
    resultMessage = "HAHAA Not good enough!";
  }
  scoreElement.textContent = `${score} out of ${quizData.length}, ${resultMessage}`;
};

// Event listeners
nextButton.addEventListener("click", nextQuestion); // Listen for next button click
restartButton.addEventListener("click", fetchQuizData); // Listen for restart button click
fetchQuizData(); // Fetch quiz data on initial page load
