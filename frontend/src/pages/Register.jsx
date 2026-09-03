import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password
        }
      );

      alert(response.data.message);

      navigate("/");

    } catch (error) {

      alert(error.response?.data?.message || error.message);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-700">

      <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-10 rounded-3xl shadow-2xl w-[420px]">

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Adaptive Minds
        </h1>

        <p className="text-center text-gray-200 mb-8">
          Create your learning account
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-gray-200 mb-4 outline-none"
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-gray-200 mb-4 outline-none"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/30 text-white placeholder-gray-200 mb-6 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-indigo-700 font-semibold p-3 rounded-xl hover:scale-105 transition duration-300"
          >
            Register
          </button>

        </form>

        <p className="text-center text-white mt-6">

          Already have an account?

          <Link
            to="/"
            className="font-bold ml-2 underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Register;