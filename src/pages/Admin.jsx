import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getToken } from "../services/auth";
import * as realApi from "../services/api_fixed";

const api = realApi;

const fetchCoursesWithDetailsFallback = async () => {
  console.log("Using fallback implementation for fetchCoursesWithDetails");
  // Use the same API URL logic as the other services
  const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    const currentHost = window.location.hostname;
    if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
      return "https://guestmanagement.onrender.com";
    }
    return "http://localhost:5000";
  };

  const response = await fetch(`${getApiUrl()}/courses?detailed=true`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

function Admin() {
  const [courses, setCourses] = useState([]);
  const [activeView, setActiveView] = useState("overview");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingSubmodule, setEditingSubmodule] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [courseForm, setCourseForm] = useState({ name: "", description: "" });
  const [submoduleForm, setSubmoduleForm] = useState({
    name: "",
    content: "",
    summary: "",
  });

  // Fetch courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        console.log("Fetching detailed courses for admin...");

        // Simplified to use the fixed API module
        const detailedCourses = await realApi.fetchCoursesWithDetails();

        console.log("Detailed courses loaded:", detailedCourses);
        setCourses(detailedCourses);
      } catch (error) {
        console.error("Failed to load courses:", error);
        showNotification(error.message || "Failed to load courses", "error");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleAddCourse = async () => {
    if (!courseForm.name.trim()) {
      showNotification("Course name is required", "error");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const newCourse = await api.createCourse(
        {
          name: courseForm.name.trim(),
          description: courseForm.description.trim(),
        },
        token
      );

      setCourses([...courses, newCourse]);
      setCourseForm({ name: "", description: "" });
      showNotification("Course added successfully!");
      setActiveView("overview");
    } catch (error) {
      showNotification(error.message || "Failed to create course", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmodule = async () => {
    if (!selectedCourse) {
      showNotification("Please select a course first", "error");
      return;
    }
    if (!submoduleForm.name.trim() || !submoduleForm.content.trim()) {
      showNotification("Submodule name and content are required", "error");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const newSubmodule = {
        name: submoduleForm.name.trim(),
        content: submoduleForm.content.trim(),
        summary: submoduleForm.summary?.trim() || "",
      };

      // Add the new submodule using the dedicated API
      const result = await api.createSubmodule(
        selectedCourse._id,
        newSubmodule,
        token
      );

      // Refresh the course details to get the updated submodules
      const updatedCourse = await api.fetchCourseDetails(selectedCourse._id);

      // Update the courses list
      setCourses(
        courses.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
      );

      setSubmoduleForm({ name: "", content: "", summary: "" });
      showNotification("Submodule added successfully!");
      setActiveView("overview");
    } catch (error) {
      showNotification(error.message || "Failed to add submodule", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmodule = async () => {
    if (
      !editingSubmodule ||
      !submoduleForm.name.trim() ||
      !submoduleForm.content.trim()
    ) {
      showNotification("Name and content are required", "error");
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      // Update the submodule directly using the API
      const updatedSubmodule = await api.updateSubmodule(
        editingSubmodule._id,
        {
          name: submoduleForm.name.trim(),
          content: submoduleForm.content.trim(),
          summary: submoduleForm.summary?.trim() || "",
        },
        token
      );

      // Refresh the course details to get the updated data
      const updatedCourse = await api.fetchCourseDetails(selectedCourse._id);

      // Update the courses list
      setCourses(
        courses.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
      );

      setEditingSubmodule(null);
      setSubmoduleForm({ name: "", content: "", summary: "" });
      showNotification("Submodule updated successfully!");
      setActiveView("overview");
    } catch (error) {
      showNotification(error.message || "Failed to update submodule", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course and all its submodules?"
      )
    ) {
      try {
        setLoading(true);
        const token = getToken();
        await api.deleteCourse(courseId, token);
        setCourses(courses.filter((course) => course._id !== courseId));
        showNotification("Course deleted successfully!");
      } catch (error) {
        showNotification(error.message || "Failed to delete course", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSubmodule = async (courseId, submoduleId) => {
    if (window.confirm("Are you sure you want to delete this submodule?")) {
      try {
        setLoading(true);
        const token = getToken();

        // Delete the submodule directly using the API
        await api.deleteSubmodule(submoduleId, token);

        // Refresh the course details to get the updated data
        const updatedCourse = await api.fetchCourseDetails(courseId);

        // Update the courses list
        setCourses(
          courses.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
        );

        showNotification("Submodule deleted successfully!");
      } catch (error) {
        showNotification(
          error.message || "Failed to delete submodule",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const startEditSubmodule = (course, submodule) => {
    setSelectedCourse(course);
    setEditingSubmodule(submodule);
    setSubmoduleForm({
      name: submodule.name,
      content: submodule.content,
      summary: submodule.summary || "",
    });
    setActiveView("editSubmodule");
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Content Management System</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {courses.length} Courses
            </span>
            <span className="text-sm text-gray-400">
              {courses.reduce(
                (acc, course) => acc + (course.submodules?.length || 0),
                0
              )}{" "}
              Submodules
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "error"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Actions bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setActiveView("addCourse");
                setCourseForm({ name: "", description: "" });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Course
            </button>
            <button
              onClick={() => {
                if (courses.length === 0) {
                  showNotification(
                    "Please create a course first before adding submodules",
                    "error"
                  );
                  return;
                }
                setActiveView("addSubmodule");
                setSelectedCourse(courses[0]);
                setSubmoduleForm({ name: "", content: "" });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Submodule
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="loader text-blue-500">Loading...</div>
          </div>
        )}

        {/* Add Course Form */}
        {activeView === "addCourse" && !loading && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Add New Course</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Course Name</label>
                <input
                  type="text"
                  value={courseForm.name}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">
                  Course Description
                </label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Enter course description"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setActiveView("overview")}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCourse}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Save Course
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Submodule Form */}
        {activeView === "addSubmodule" && !loading && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Add New Submodule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">
                  Select Course
                </label>
                <select
                  value={selectedCourse?._id || ""}
                  onChange={(e) => {
                    const course = courses.find(
                      (c) => c._id === e.target.value
                    );
                    setSelectedCourse(course);
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">
                  Submodule Name
                </label>
                <input
                  type="text"
                  value={submoduleForm.name}
                  onChange={(e) =>
                    setSubmoduleForm({ ...submoduleForm, name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter submodule name"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">
                  Submodule Content
                </label>
                <textarea
                  value={submoduleForm.content}
                  onChange={(e) =>
                    setSubmoduleForm({
                      ...submoduleForm,
                      content: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
                  placeholder="Enter submodule content"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">
                  Summary (Optional)
                </label>
                <textarea
                  value={submoduleForm.summary}
                  onChange={(e) =>
                    setSubmoduleForm({
                      ...submoduleForm,
                      summary: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Enter a brief summary of this submodule"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setActiveView("overview")}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubmodule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Save Submodule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Submodule Form */}
        {activeView === "editSubmodule" && !loading && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Edit Submodule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">
                  Submodule Name
                </label>
                <input
                  type="text"
                  value={submoduleForm.name}
                  onChange={(e) =>
                    setSubmoduleForm({ ...submoduleForm, name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter submodule name"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">
                  Submodule Content
                </label>
                <textarea
                  value={submoduleForm.content}
                  onChange={(e) =>
                    setSubmoduleForm({
                      ...submoduleForm,
                      content: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
                  placeholder="Enter submodule content"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">
                  Summary (Optional)
                </label>
                <textarea
                  value={submoduleForm.summary}
                  onChange={(e) =>
                    setSubmoduleForm({
                      ...submoduleForm,
                      summary: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Enter a brief summary of this submodule"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setActiveView("overview");
                    setEditingSubmodule(null);
                    setSubmoduleForm({ name: "", content: "", summary: "" });
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmodule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Update Submodule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overview */}
        {activeView === "overview" && !loading && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400 mb-4">No courses available</p>
                <button
                  onClick={() => setActiveView("addCourse")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Add Your First Course
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-300">
                          {course.name}
                        </h3>
                        <p className="text-gray-400 mt-1">
                          {course.description || "No description"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-red-500 hover:text-red-400"
                          title="Delete Course"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-400">
                          Submodules ({course.submodules?.length || 0})
                        </h4>
                        <button
                          onClick={() => {
                            setActiveView("addSubmodule");
                            setSelectedCourse(course);
                            setSubmoduleForm({
                              name: "",
                              content: "",
                              summary: "",
                            });
                          }}
                          className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                        >
                          Add Submodule
                        </button>
                      </div>
                      {course.submodules?.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">
                          No submodules available
                        </p>
                      ) : (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {course.submodules?.map((submodule) => (
                            <div
                              key={submodule._id}
                              className="bg-gray-700 rounded-lg p-3 flex justify-between items-center border border-gray-600"
                            >
                              <span className="font-medium text-gray-200">
                                {submodule.name}
                              </span>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    startEditSubmodule(course, submodule)
                                  }
                                  className="text-blue-400 hover:text-blue-300"
                                  title="Edit Submodule"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    ></path>
                                  </svg>
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSubmodule(
                                      course._id,
                                      submodule._id
                                    )
                                  }
                                  className="text-red-400 hover:text-red-300"
                                  title="Delete Submodule"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    ></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
