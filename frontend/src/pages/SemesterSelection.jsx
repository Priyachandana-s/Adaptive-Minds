import React from "react";
import { useNavigate } from "react-router-dom";

function SemesterSelection() {

  const navigate = useNavigate();

  const selectSemester = (semester) => {

    localStorage.setItem("semester", semester);

    navigate("/dashboard");

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex flex-col items-center justify-center text-white">

      <h1 className="text-5xl font-bold mb-4">
        Choose Your Semester
      </h1>

      <p className="text-gray-300 mb-12">
        Personalized learning starts here
      </p>

      <div className="flex gap-10">

        <div
          onClick={() => selectSemester("Semester 3")}
          className="bg-white/10 backdrop-blur-lg border border-white/20 w-[280px] h-[220px] rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition duration-300 shadow-2xl"
        >

          <h2 className="text-3xl font-bold mb-4">
            Semester 3
          </h2>

          <p className="text-gray-300 text-center px-4">
            DSA, DBMS, Digital Electronics & more
          </p>

        </div>

        <div
          onClick={() => selectSemester("Semester 4")}
          className="bg-white/10 backdrop-blur-lg border border-white/20 w-[280px] h-[220px] rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition duration-300 shadow-2xl"
        >

          <h2 className="text-3xl font-bold mb-4">
            Semester 4
          </h2>

          <p className="text-gray-300 text-center px-4">
            OS, CN, Algorithms, Software Engineering
          </p>

        </div>

      </div>

    </div>

  );
}

export default SemesterSelection;