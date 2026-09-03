import React from "react";
import { useParams } from "react-router-dom";

function NotesPage() {

  const { subjectName } = useParams();

  const topics = [
    {
      title: "Introduction",
      content:
        "Learn the fundamentals and core concepts of the subject."
    },
    {
      title: "Important Concepts",
      content:
        "Understand important theoretical and practical concepts."
    },
    {
      title: "Examples & Applications",
      content:
        "Real-world examples and practical applications."
    },
    {
      title: "Practice Questions",
      content:
        "Prepare for quizzes and coding practice."
    }
  ];

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-3">
        📘 {subjectName} Notes
      </h1>

      <p className="text-gray-400 mb-10">
        AI organized topic-wise study materials
      </p>

      <div className="space-y-6">

        {topics.map((topic, index) => (

          <div
            key={index}
            className="bg-slate-900 p-8 rounded-3xl shadow-xl hover:scale-[1.02] transition duration-300"
          >

            <h2 className="text-3xl font-bold mb-4 text-indigo-400">
              {topic.title}
            </h2>

            <p className="text-gray-300 text-lg leading-8">
              {topic.content}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}

export default NotesPage;