import { useEffect, useState } from "react";
import Quiz from "./components/Quiz";
function App() {

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {

  fetch("http://localhost:5000/subjects")
    .then((response) => response.json())
    .then((data) => {
      setSubjects(data);
    });

}, []);

  useEffect(() => {

  if (selectedSubject === "") return;

  fetch(`http://localhost:5000/topics?subjectId=${selectedSubject}`)
    .then((response) => response.json())
    .then((data) => {
      setTopics(data);
    });

}, [selectedSubject]);

   if (quizStarted) {
    return <Quiz />;
  }
  return (
    <div>
      <h1>Adaptive Minds</h1>
      <h2>AI Based Adaptive Learning Platform</h2>


      <h3>Subjects</h3>

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
      {subject.name}
    </option>
  ))}
</select>

<h3>Topics</h3>

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

<br /><br />

<button onClick={() => setQuizStarted(true)}>
  Start Quiz
</button>

    </div>
  );
}

export default App;