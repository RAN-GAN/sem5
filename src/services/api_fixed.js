// API service to interact with the backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const response = await fetch(`${API_URL}/courses`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Fetch courses with detailed information (including submodules)
export const fetchCoursesWithDetails = async () => {
  try {
    const response = await fetch(`${API_URL}/courses?detailed=true`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching detailed courses:", error);
    throw error;
  }
};

// Fetch a specific course
export const fetchCourse = async (courseId) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

// Fetch a specific submodule
export const fetchSubmodule = async (submoduleId) => {
  try {
    const response = await fetch(`${API_URL}/submodules/${submoduleId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching submodule:", error);
    throw error;
  }
};

// Admin API functions (require authentication)
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    "x-auth-token": token || "",
  };
};

// Create a new course
export const createCourse = async (courseData) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/courses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update a course
export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/courses/${courseId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/courses/${courseId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// Create a new submodule
export const createSubmodule = async (courseId, submoduleData) => {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/courses/${courseId}/submodules`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(submoduleData),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating submodule:", error);
    throw error;
  }
};

// Update a submodule
export const updateSubmodule = async (submoduleId, submoduleData) => {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/submodules/${submoduleId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(submoduleData),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating submodule:", error);
    throw error;
  }
};

// Delete a submodule
export const deleteSubmodule = async (submoduleId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/submodules/${submoduleId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting submodule:", error);
    throw error;
  }
};

// Get dashboard data
export const fetchDashboardData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
