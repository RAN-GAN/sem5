import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, isAuthenticated } from "../services/auth";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginAttempts >= 3) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setLoginAttempts(loginAttempts + 1);
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-gray-200 flex flex-col items-center justify-center">
      <header className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Welcome Back</h1>
        <p className="text-gray-400">Please login to access the admin panel</p>
        <p className="text-gray-300 mt-2">
          (Use username: admin, password: admin123)
        </p>
      </header>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">
          Login
        </h2>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-600 rounded p-3 mb-4 w-full bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-600 rounded p-3 mb-4 w-full bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-gray-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Remember Me
            </label>
            <a href="#" className="text-blue-400 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full transition-transform transform hover:scale-105 duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <footer className="w-full max-w-md text-center mt-8">
        <p className="text-gray-400">
          © 2025 ADSA Model Lab. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Login;
