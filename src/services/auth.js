// API service to interact with the backend
const getApiUrl = () => {
  // Check if we have an environment variable set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Auto-detect based on current domain
  const currentHost = window.location.hostname;

  // If running on GitHub Pages or production domain
  if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
    // Use your actual backend URL for production
    return "https://guestmanagement.onrender.com";
  }

  // Default to localhost for development
  return "http://localhost:5000";
};

const API_URL = getApiUrl();

// Login function
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();

    // Store the token in localStorage
    localStorage.setItem("authToken", data.token);

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("authToken");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

// Get the stored token
export const getToken = () => {
  return localStorage.getItem("authToken");
};

// Validate token with backend
export const validateToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_URL}/api/auth/validate`, {
      headers: {
        "x-auth-token": token,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};
