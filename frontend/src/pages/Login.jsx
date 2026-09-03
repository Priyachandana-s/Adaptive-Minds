import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

        if (email && password) {
      navigate("/semester");
    } else {
      alert("Please enter email and password");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-[420px]">

        <h1 className="text-5xl font-bold text-white text-center mb-2">
          Adaptive Minds
        </h1>

        <p className="text-center text-gray-300 mb-8">
          AI Powered Adaptive Learning Platform
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 mb-4 outline-none"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 mb-6 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-indigo-700 font-semibold p-3 rounded-xl hover:scale-105 transition duration-300"
          >
            Login
          </button>

        </form>

        <p className="text-center text-white mt-6">

          Don’t have an account?

          <Link
            to="/register"
            className="font-bold ml-2 underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Login;