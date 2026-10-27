
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      navigate("/semester");
    } else {
      alert("Please enter email and password");
    }
  };

  const handleForgotPassword = () => {
    setResetEmail(email);
    setResetMessage("");
    setShowForgotPassword(true);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      setResetMessage("Please enter your registered email address.");
      return;
    }

    try {
      setResetLoading(true);
      setResetMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email: resetEmail.trim().toLowerCase() }
      );

      setResetMessage(
        response.data.message || "Please check your email for further instructions."
      );
    } catch (error) {
      setResetMessage(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FF] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#DCD6FF] rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E5DDFF] rounded-full blur-3xl opacity-70"></div>
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-[#E0F2FE] rounded-full blur-2xl opacity-60"></div>

      {/* Main card */}
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-[0_20px_60px_rgba(79,70,229,0.12)] overflow-hidden border border-[#E8E8F5] flex flex-col md:flex-row">
        {/* Left branding section */}
        <div className="md:w-[48%] bg-gradient-to-br from-[#5B4BDB] via-[#6D5CE7] to-[#8B7CF6] p-10 md:p-14 text-white flex flex-col justify-between min-h-[520px]">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-lg">
                🧠
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Adaptive Minds
                </h1>
                <p className="text-xs text-white/70">
                  Learn • Practice • Improve
                </p>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Learn smarter.
              <br />
              Grow faster.
            </h2>

            <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-md">
              Your personalized learning journey powered by AI.
              Learn at your own pace and build stronger skills.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-3 mt-10">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-xs font-medium">Personalized</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-xs font-medium">AI Powered</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-xs font-medium">Track Progress</p>
            </div>
          </div>
        </div>

        {/* Right login section */}
        <div className="md:w-[52%] p-8 md:p-14 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {showForgotPassword ? (
              <>
                <div className="mb-8">
                  <p className="text-sm font-semibold text-[#6D5CE7] mb-2">
                    ACCOUNT RECOVERY 🔐
                  </p>

                  <h2 className="text-3xl font-bold text-[#172554]">
                    Forgot password?
                  </h2>

                  <p className="text-[#64748B] mt-2">
                    Enter your registered email address to request a password
                    reset.
                  </p>
                </div>

                <form onSubmit={handleResetSubmit}>
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#334155] mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] placeholder-[#94A3B8] outline-none transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                    />
                  </div>

                  {resetMessage && (
                    <p
                      role="status"
                      className="text-sm text-[#5B4BDB] mb-4"
                    >
                      {resetMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] text-white font-semibold py-3.5 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
                  >
                    {resetLoading ? "Please wait..." : "Send reset link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetMessage("");
                    }}
                    className="w-full mt-4 text-sm font-semibold text-[#6D5CE7] hover:text-[#4F46E5]"
                  >
                    ← Back to Login
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-sm font-semibold text-[#6D5CE7] mb-2">
                    WELCOME BACK 👋
                  </p>

                  <h2 className="text-3xl font-bold text-[#172554]">
                    Sign in to your account
                  </h2>

                  <p className="text-[#64748B] mt-2">
                    Continue your personalized learning journey.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#334155] mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] placeholder-[#94A3B8] outline-none transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-[#334155] mb-2">
                      Password
                    </label>

                    <input
                      type="password"
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] placeholder-[#94A3B8] outline-none transition focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                    />
                  </div>

                  <div className="flex justify-end mb-7">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm font-medium text-[#6D5CE7] hover:text-[#4F46E5] transition"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-[#5B4BDB]/20 hover:shadow-xl hover:shadow-[#5B4BDB]/25 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Login →
                  </button>
                </form>

                <p className="text-center text-[#64748B] mt-8">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="font-semibold text-[#5B4BDB] ml-2 hover:text-[#4338CA] transition"
                  >
                    Create account
                  </Link>
                </p>

                <div className="flex items-center justify-center gap-2 mt-10 text-xs text-[#94A3B8]">
                  <span>🔒</span>
                  <span>Your learning journey is secure</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
