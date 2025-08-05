import React from "react";
import { Link } from "react-router-dom";

function Modules({ courses, loading, error }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {courses.map((course) => (
        <Link
          key={course._id}
          to={`/course/${course._id}`}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl p-4 md:p-6 shadow-md shadow-black/20 border border-gray-600 transition-all duration-300 flex flex-col min-h-[120px]"
        >
          <span className="font-semibold text-xl group-hover:text-gray-100 transition mb-2">
            {course.name}
          </span>
          <p className="text-gray-400 text-sm flex-1 mb-2">
            {course.description}
          </p>
          <div className="flex justify-end">
            <span className="text-gray-400 hover:text-gray-200 transition text-xl">
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Modules;
