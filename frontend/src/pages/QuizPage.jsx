import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Quiz from "../components/Quiz";
import "../components/Quiz.css";

function QuizPage() {
  const { subjectName } = useParams();

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET SUBJECTS
  // =========================================

  useEffect(() => {
    fetch("http://localhost:5000/subjects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load subjects");
        }

        return response.json();
      })
      .then((data) => {
        setSubjects(data);

        // Match subject from URL
        const matchedSubject = data.find(
          (subject) =>
            subject.name?.trim().toLowerCase() ===
            subjectName?.trim().toLowerCase()
        );

        // DBMS / Database Systems special case
        const databaseSubject = data.find(
          (subject) =>
            subjectName?.trim().toLowerCase() === "dbms" &&
            subject.name?.trim().toLowerCase() === "database systems"
        );

        const subject = matchedSubject || databaseSubject;

        if (!subject) {
          setError(`Subject "${subjectName}" was not found.`);
          setLoading(false);
          return;
        }

        setSelectedSubject(String(subject.id));
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to connect to the backend.");
        setLoading(false);
      });
  }, [subjectName]);

  // =========================================
  // GET TOPICS
  // =========================================

  useEffect(() => {
    if (!selectedSubject) {
      return;
    }

    fetch(
      `http://localhost:5000/topics?subjectId=${selectedSubject}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load topics");
        }

        return response.json();
      })
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load topics.");
        setLoading(false);
      });
  }, [selectedSubject]);

  // =========================================
  // START QUIZ
  // =========================================

  if (selectedTopic && selectedDifficulty) {
    return (
      <Quiz
        selectedSubject={selectedSubject}
        selectedTopic={selectedTopic}
        selectedDifficulty={selectedDifficulty}
      />
    );
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="quiz-page">

        <div className="quiz-loading">

          <div className="quiz-loading-icon">
            🧠
          </div>

          <h2>Loading Quiz Setup...</h2>

          <p>
            Preparing your personalized assessment.
          </p>

        </div>

      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="quiz-page">

        <div className="quiz-error">

          <div className="quiz-error-icon">
            ⚠️
          </div>

          <h2>Unable to Start Quiz</h2>

          <p>{error}</p>

        </div>

      </div>
    );
  }

  // =========================================
  // QUIZ SETUP
  // =========================================

  return (
    <div className="quiz-page">

      <div className="quiz-setup-card">

        {/* =================================
            HEADER
        ================================= */}

        <div className="quiz-header">

          <div className="quiz-icon">
            🧠
          </div>

          <div className="quiz-header-content">

            <h1>
              Adaptive Minds Quiz
            </h1>

            <p>
              {subjectName}
            </p>

          </div>

        </div>


        {/* =================================
            INTRO
        ================================= */}

        <div className="quiz-intro">

          <h2>
            Customize Your Quiz
          </h2>

          <p>
            Choose a topic and difficulty level to
            begin your personalized assessment.
          </p>

        </div>


        {/* =================================
            TOPIC
        ================================= */}

        <div className="quiz-field">

          <label htmlFor="topic">
            Select Topic
          </label>

          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) =>
              setSelectedTopic(e.target.value)
            }
          >

            <option value="">
              Choose a topic
            </option>

            {topics.map((topic) => (
              <option
                key={topic.id}
                value={topic.id}
              >
                {topic.topic_name}
              </option>
            ))}

          </select>

        </div>


        {/* =================================
            DIFFICULTY
        ================================= */}

        <div className="quiz-field">

          <label htmlFor="difficulty">
            Select Difficulty
          </label>

          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) =>
              setSelectedDifficulty(e.target.value)
            }
          >

            <option value="">
              Choose difficulty
            </option>

            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>

          </select>

        </div>


        {/* =================================
            DIFFICULTY CARDS
        ================================= */}

        <div className="difficulty-info">

          <div className="difficulty-item">

            <span className="difficulty-dot easy"></span>

            <div>
              <strong>
                Easy
              </strong>

              <small>
                Build your fundamentals
              </small>
            </div>

          </div>


          <div className="difficulty-item">

            <span className="difficulty-dot medium"></span>

            <div>
              <strong>
                Medium
              </strong>

              <small>
                Test your understanding
              </small>
            </div>

          </div>


          <div className="difficulty-item">

            <span className="difficulty-dot hard"></span>

            <div>
              <strong>
                Hard
              </strong>

              <small>
                Challenge your skills
              </small>
            </div>

          </div>

        </div>


        {/* =================================
            STARTING MESSAGE
        ================================= */}

        {selectedTopic && selectedDifficulty && (
          <div className="quiz-starting">

            <span>
              🚀
            </span>

            Preparing your personalized quiz...

          </div>
        )}

      </div>

    </div>
  );
}

export default QuizPage;