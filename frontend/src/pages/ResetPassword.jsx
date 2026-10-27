
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("This reset link is invalid or missing its token.");
      return;
    }

    if (password.length < 8) {
      setMessage("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { token, password }
      );

      setSuccess(true);
      setMessage(
        response.data.message || "Password reset successful!"
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to reset your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FF] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#DCD6FF] rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E5DDFF] rounded-full blur-3xl opacity-70"></div>

      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_60px_rgba(79,70,229,0.12)] border border-[#E8E8F5] p-8 md:p-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#6D5CE7] flex items-center justify-center text-2xl">
            🧠
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#172554]">
              Adaptive Minds
            </h1>
            <p className="text-xs text-[#64748B]">
              Learn • Practice • Improve
            </p>
          </div>
        </div>

        {!success ? (
          <>
            <p className="text-sm font-semibold text-[#6D5CE7] mb-2">
              ACCOUNT RECOVERY 🔐
            </p>

            <h2 className="text-3xl font-bold text-[#172554]">
              Reset password
            </h2>

            <p className="text-[#64748B] mt-3 mb-8">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#334155] mb-2">
                  New password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] outline-none focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#334155] mb-2">
                  Confirm new password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F9FF] border border-[#E2E4F0] text-[#172554] outline-none focus:border-[#6D5CE7] focus:ring-4 focus:ring-[#6D5CE7]/10"
                />
              </div>

              {message && (
                <p role="alert" className="text-sm text-red-600 mb-5">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] text-white font-semibold py-3.5 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
              >
                {loading ? "Updating password..." : "Update password"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-[#172554]">
              Password updated!
            </h2>

            <p className="text-[#64748B] mt-3 mb-8">
              {message}
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-[#5B4BDB] to-[#7C6FF2] text-white font-semibold py-3.5 rounded-2xl"
            >
              Return to Login
            </button>
          </>
        )}

        {!success && (
          <p className="text-center mt-8 text-sm text-[#64748B]">
            Remember your password?{" "}
            <Link to="/" className="font-semibold text-[#5B4BDB]">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
