import "./Quiz.css";
import { useEffect, useState } from "react";

function Quiz({
  selectedSubject,
  selectedTopic,
  selectedDifficulty,
}) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer
  const [timeSpent, setTimeSpent] = useState(0);

  // Load questions
  useEffect(() => {
    fetch(
      `http://localhost:5000/csvquestions?subject=${selectedSubject}&topic=${selectedTopic}&difficulty=${selectedDifficulty}`
    )
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => {
        console.error("Error loading questions:", error);
      });
  }, [selectedSubject, selectedTopic, selectedDifficulty]);

  // Timer
  useEffect(() => {
    if (questions.length === 0 || quizCompleted) {
      return;
    }

    const timer = setInterval(() => {
      setTimeSpent((previousTime) => previousTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length, quizCompleted]);

  if (questions.length === 0) {
    return <h2>Loading Questions...</h2>;
  }

  const currentQuestion = questions[currentIndex];

  function calculateScore() {
    let score = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.CorrectAnswer) {
        score++;
      }
    });

    return score;
  }

  function getPerformanceMessage(score) {
    const percentage = (score / questions.length) * 100;

    if (percentage === 100) {
      return "Excellent performance! 🎯";
    } else if (percentage >= 80) {
      return "Great job! Keep it up! 👏";
    } else if (percentage >= 60) {
      return "Good effort! A little more practice will help. 👍";
    } else if (percentage >= 40) {
      return "Keep practicing. You are improving! 💪";
    } else {
      return "Don't worry. Keep learning and try again! 🌱";
    }
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  // =========================
  // RESULT PAGE
  // =========================

  if (quizCompleted && !showReview) {
    const finalScore = calculateScore();

    const accuracy = Math.round(
      (finalScore / questions.length) * 100
    );

    return (
      <div className="quiz-container">
        <h1 className="quiz-title">
          🎉 Assessment Completed
        </h1>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          <h2>
            Score: {finalScore} / {questions.length}
          </h2>

          <h2 style={{ marginTop: "15px" }}>
            Accuracy: {accuracy}%
          </h2>

          <h2 style={{ marginTop: "15px" }}>
            Time Spent: {formatTime(timeSpent)}
          </h2>

          <p
            style={{
              marginTop: "20px",
              fontSize: "20px",
            }}
          >
            {getPerformanceMessage(finalScore)}
          </p>

          <p
            style={{
              marginTop: "25px",
              fontSize: "20px",
            }}
          >
            🤖 AI Recommendation
          </p>

          <h2
            style={{
              color: "#4338ca",
              marginTop: "15px",
            }}
          >
            Recommended Level: {prediction}
          </h2>

          <button
            className="next-btn"
            style={{ marginTop: "25px" }}
            onClick={() => setShowReview(true)}
          >
            Review Answers
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // ANSWER REVIEW PAGE
  // =========================

  if (quizCompleted && showReview) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">
          📝 Answer Review
        </h1>

        {questions.map((question, index) => {
          const userAnswer = answers[index];

          const isCorrect =
            userAnswer === question.CorrectAnswer;

          return (
            <div
              key={index}
              style={{
                marginTop: "25px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >
              <h3>Question {index + 1}</h3>

              <p
                style={{
                  fontSize: "17px",
                  marginTop: "10px",
                }}
              >
                {question.Question}
              </p>

              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  color: isCorrect ? "green" : "red",
                }}
              >
                {isCorrect
                  ? "✅ Correct"
                  : "❌ Wrong"}
              </p>

              <p style={{ marginTop: "10px" }}>
                <strong>Your Answer:</strong>{" "}
                {userAnswer || "Not answered"}
              </p>

              {!isCorrect && (
                <p style={{ marginTop: "10px" }}>
                  <strong>Correct Answer:</strong>{" "}
                  {question.CorrectAnswer}
                </p>
              )}

              <p
                style={{
                  marginTop: "10px",
                  fontStyle: "italic",
                }}
              >
                <strong>Explanation:</strong>{" "}
                {question.Explanation}
              </p>
            </div>
          );
        })}

        <button
          className="next-btn"
          style={{ marginTop: "25px" }}
          onClick={() => setShowReview(false)}
        >
          ← Back to Result
        </button>
      </div>
    );
  }

  // =========================
  // QUIZ PAGE
  // =========================

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">
        Adaptive Minds Quiz
      </h1>

      {/* Timer */}

      <div
        style={{
          textAlign: "right",
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        ⏱️ Time: {formatTime(timeSpent)}
      </div>

      <h3 className="question-count">
        Question {currentIndex + 1} of {questions.length}
      </h3>

      {/* Progress Bar */}

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${
              ((currentIndex + 1) /
                questions.length) *
              100
            }%`,
          }}
        ></div>
      </div>

      {/* Error Message */}

      {errorMessage && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
        >
          ⚠️ {errorMessage}
        </p>
      )}

      {/* Question */}

      <p className="question">
        {currentQuestion.Question}
      </p>

      {/* Options */}

      {[
        currentQuestion.Option1,
        currentQuestion.Option2,
        currentQuestion.Option3,
        currentQuestion.Option4,
      ].map((option, index) => (
        <label
          className={`option ${
            selectedOption === option
              ? "selected"
              : ""
          }`}
          key={index}
        >
          <input
            type="radio"
            name="answer"
            checked={selectedOption === option}
            onChange={() => {
              setSelectedOption(option);
              setErrorMessage("");

              const updatedAnswers = [...answers];

              updatedAnswers[currentIndex] =
                option;

              setAnswers(updatedAnswers);
            }}
          />

          {option}
        </label>
      ))}

      {/* Next / Submit Button */}

      <button
        className="next-btn"
        disabled={isSubmitting}
        onClick={() => {
          if (isSubmitting) {
            return;
          }

          if (!selectedOption) {
            setErrorMessage(
              "Please select an answer before continuing."
            );

            return;
          }

          setErrorMessage("");

          if (
            currentIndex <
            questions.length - 1
          ) {
            setCurrentIndex(
              currentIndex + 1
            );

            setSelectedOption(
              answers[currentIndex + 1] || ""
            );
          } else {
            setIsSubmitting(true);

            const score = calculateScore();

            fetch(
              "http://localhost:5000/predict",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  quizScore: score * 20,
                  accuracy: score * 20,

                  // Temporary value.
                  // We will replace this with
                  // actual timeSpent in Step 4.
                  timeSpent: timeSpent,
                }),
              }
            )
              .then((response) =>
                response.json()
              )
              .then((data) => {
                setPrediction(
                  data.recommendation
                );

                setQuizCompleted(true);
                setIsSubmitting(false);
              })
              .catch((error) => {
                console.error(
                  "Prediction Error:",
                  error
                );

                setIsSubmitting(false);

                setErrorMessage(
                  "Something went wrong while generating your recommendation."
                );
              });
          }
        }}
      >
        {currentIndex ===
        questions.length - 1
          ? isSubmitting
            ? "Submitting..."
            : "Submit Quiz"
          : "Next →"}
      </button>
    </div>
  );
}

export default Quiz;