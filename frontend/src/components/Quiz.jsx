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

  useEffect(() => {
    fetch(
      `http://localhost:5000/csvquestions?subject=${selectedSubject}&topic=${selectedTopic}&difficulty=${selectedDifficulty}`
    )
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      });
  }, [selectedSubject, selectedTopic, selectedDifficulty]);

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

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">
          🎉 Assessment Completed
        </h1>

        <h2 style={{ textAlign: "center", marginTop: "20px" }}>
          Score: {calculateScore()} / {questions.length}
        </h2>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "20px",
          }}
        >
          🤖 AI Recommendation
        </p>

        <h2
          style={{
            textAlign: "center",
            color: "#4338ca",
            marginTop: "15px",
          }}
        >
          Recommended Level: {prediction}
        </h2>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">
        Adaptive Minds Quiz
      </h1>

      <h3 className="question-count">
        Question {currentIndex + 1} of {questions.length}
      </h3>

      <p className="question">
        {currentQuestion.Question}
      </p>

      {[
        currentQuestion.Option1,
        currentQuestion.Option2,
        currentQuestion.Option3,
        currentQuestion.Option4,
      ].map((option, index) => (
        <label className="option" key={index}>
          <input
            type="radio"
            name="answer"
            checked={selectedOption === option}
            onChange={() => {
              setSelectedOption(option);

              const updatedAnswers = [...answers];
              updatedAnswers[currentIndex] = option;
              setAnswers(updatedAnswers);
            }}
          />

          {option}
        </label>
      ))}

      <button
        className="next-btn"
        onClick={() => {
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption("");
          } else {
            const score = calculateScore();

            fetch("http://localhost:5000/predict", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                quizScore: score * 20,
                accuracy: score * 20,
                timeSpent: 45,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                setPrediction(data.recommendation);
                setQuizCompleted(true);
              });
          }
        }}
      >
        {currentIndex === questions.length - 1
          ? "Submit Quiz"
          : "Next →"}
      </button>
    </div>
  );
}

export default Quiz;