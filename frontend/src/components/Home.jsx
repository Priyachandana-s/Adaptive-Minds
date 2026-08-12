import "./Home.css";

function Home({
  subjects,
  topics,
  selectedSubject,
  setSelectedSubject,
  selectedTopic,
  setSelectedTopic,
  selectedDifficulty,
  setSelectedDifficulty,
  startQuiz,
}) {
  return (
    <div className="home">
      <div className="card">
        <h1>🧠 Adaptive Minds</h1>

        <p className="subtitle">
          AI Powered Adaptive Learning Platform
        </p>

        <p className="description">
          Choose your subject and topic to begin your
          personalized adaptive assessment.
        </p>

        <label>Subject</label>

        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setSelectedTopic("");
          }}
        >
          <option value="">Select Subject</option>

          {subjects.map((subject) => (
            <option
              key={subject.id}
              value={subject.id}
            >
              {subject.subject_name || subject.name}
            </option>
          ))}
        </select>

        <label>Topic</label>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">Select Topic</option>

          {topics.map((topic) => (
            <option
              key={topic.id}
              value={topic.id}
            >
              {topic.topic_name}
            </option>
          ))}
        </select>

        <label>Difficulty</label>

        <div className="difficulty">
          <label>
            <input
              type="radio"
              name="difficulty"
              value="Easy"
              checked={selectedDifficulty === "Easy"}
              onChange={(e) =>
                setSelectedDifficulty(e.target.value)
              }
            />
            Easy
          </label>

          <label>
            <input
              type="radio"
              name="difficulty"
              value="Medium"
              checked={selectedDifficulty === "Medium"}
              onChange={(e) =>
                setSelectedDifficulty(e.target.value)
              }
            />
            Medium
          </label>

          <label>
            <input
              type="radio"
              name="difficulty"
              value="Hard"
              checked={selectedDifficulty === "Hard"}
              onChange={(e) =>
                setSelectedDifficulty(e.target.value)
              }
            />
            Hard
          </label>
        </div>

        <button
          disabled={
            !selectedSubject ||
            !selectedTopic ||
            !selectedDifficulty
          }
          onClick={startQuiz}
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}

export default Home;