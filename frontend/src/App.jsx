import Home from "./components/Home";
import { useEffect, useState } from "react";

import Quiz from "./components/Quiz";
function App() {

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
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
    return (
  <Quiz
    selectedSubject={selectedSubject}
    selectedTopic={selectedTopic}
    selectedDifficulty={selectedDifficulty}
  />
);
  }
  return (
 <Home
  subjects={subjects}
  topics={topics}
  selectedSubject={selectedSubject}
  setSelectedSubject={setSelectedSubject}
  selectedTopic={selectedTopic}
  setSelectedTopic={setSelectedTopic}

  selectedDifficulty={selectedDifficulty}
  setSelectedDifficulty={setSelectedDifficulty}

  startQuiz={() => setQuizStarted(true)}
/>
);
}

export default App;