const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
