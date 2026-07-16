import { useEffect, useState } from "react";
function Quiz() {

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
  fetch("http://localhost:5000/questions")
    .then((response) => response.json())
    .then((data) => {
      setQuestions(data);
    });
}, []);  


  if (questions.length === 0) {
  return <h2>Loading Questions...</h2>;
}
  const currentQuestion = questions[currentIndex];

  function calculateScore() {
  let score = 0;

  questions.forEach((question, index) => {
    if (answers[index] === question.correct_answer) {
      score++;
    }
  });

  return score;
}

  if (quizCompleted) {
  return (
    <div>
      <h1>🎉 Quiz Completed</h1>

      <h2>
        Your Score: {calculateScore()} / {questions.length}
      </h2>

      <p>Thank you for taking the quiz.</p>
    </div>
  );
}

  return (
    <div>

      <h1>Adaptive Minds Quiz</h1>

      <h3>
        Question {currentIndex + 1} of {questions.length}
      </h3>

      <p>{currentQuestion.question}</p>

      {[
  currentQuestion.option1,
  currentQuestion.option2,
  currentQuestion.option3,
  currentQuestion.option4,
].map((option, index) => (

        <div key={index}>

          <button
            onClick={() => {
              setSelectedOption(option);

              const updatedAnswers = [...answers];
              updatedAnswers[currentIndex] = option;
              setAnswers(updatedAnswers);
            }}
            style={{
              backgroundColor:
                selectedOption === option ? "lightgreen" : "white"
            }}
          >
            {option}
          </button>

          <br />
          <br />

        </div>
      ))}

      <h3>Selected Answers</h3>

      <pre>
        {JSON.stringify(answers, null, 2)}
      </pre>

      <br />

      <button
        onClick={() => {
          if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption("");
          } else {
            setQuizCompleted(true);
          }
        }}
      >
        {currentIndex === questions.length - 1
          ? "Submit Quiz"
          : "Next"}
      </button>

    </div>
  );
}

export default Quiz;