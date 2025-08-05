import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// Import both real and mock APIs
import * as realApi from "../services/api_fixed";

// Choose which API to use - should match the setting in Home.jsx
const USE_MOCK_API = false; // Use real API to fetch from backend
const api = USE_MOCK_API ? mockApi : realApi;

import Header from "../components/Header";
import Disclaimer from "../components/Disclaimer";

function Submodules() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [submodules, setSubmodules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch course info
        const coursesData = await api.fetchCourses();
        const courseData = coursesData.find((c) => c._id === courseId);

        if (!courseData) {
          setError("Course not found");
          return;
        }

        setCourse(courseData);

        // Fetch submodules
        const submodulesData = await api.fetchSubmodules(courseId);
        setSubmodules(submodulesData);
      } catch (err) {
        setError("Failed to load course data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col relative">
        <Header />
        <Disclaimer />
        <main className="flex-1 flex items-center">
          <div className="text-center text-gray-400">
            Loading course content...
          </div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col relative">
        <Header />
        <Disclaimer />
        <main className="flex-1 flex items-center">
          <div className="text-center text-gray-400">
            {error || "Course not found."}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col relative">
      <Header />
      <Disclaimer />
      <main className="flex-1 flex flex-col items-center px-2 md:px-8 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-gray-800 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/30 border border-gray-700 px-4 md:px-8 py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-300">
              {course.name} Submodules
            </h2>
            {submodules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  No submodules available for this course.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {submodules.map((sub) => (
                  <Link
                    key={sub._id}
                    to={`/course/${courseId}/submodule/${sub._id}`}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-2xl p-8 shadow-md shadow-black/20 border border-gray-600 transition-all duration-200 flex items-center justify-between group min-h-[120px]"
                  >
                    <span className="font-semibold text-xl md:text-2xl group-hover:text-gray-100 transition">
                      {sub.name}
                    </span>
                    <span className="text-gray-400 group-hover:text-gray-200 transition text-2xl">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-10 text-center">
              <Link
                to="/"
                className="text-gray-400 hover:text-gray-200 underline"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Submodules;
