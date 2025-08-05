import Header from "../components/Header";
import Disclaimer from "../components/Disclaimer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import * as realApi from "../services/api_fixed";

const api = realApi;

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        const data = await api.fetchCourses();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col relative">
      <Header />
      <Disclaimer />
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-gray-800 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/30 border border-gray-700 px-8 md:px-12 py-12">
            <h3 className="text-3xl md:text-2xl font-bold mb-10 text-center text-gray-300">
              Explore Courses
            </h3>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading courses...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/course/${course._id}`}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-2xl p-6 shadow-md shadow-black/20 border border-gray-600 transition-all duration-300 flex items-center justify-between group min-h-[120px]"
                  >
                    <span className="font-semibold text-xl md:text-2xl group-hover:text-gray-100 transition">
                      {course.name}
                    </span>
                    <span className="text-gray-400 group-hover:text-gray-200 transition text-2xl">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
