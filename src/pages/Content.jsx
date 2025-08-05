import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// Import both real and mock APIs
import * as realApi from "../services/api_fixed";

const api =realApi;

import Header from "../components/Header";
import Disclaimer from "../components/Disclaimer";

function Content() {
  const { courseId, submoduleId } = useParams();
  const [submodule, setSubmodule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSubmoduleContent = async () => {
      try {
        setLoading(true);
        const data = await api.fetchSubmodule(submoduleId);
        setSubmodule(data);
      } catch (err) {
        setError("Failed to load submodule content. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSubmoduleContent();
  }, [submoduleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col relative">
        <Header />
        <Disclaimer />
        <main className="flex-1 flex items-center">
          <div className="text-center text-gray-400">Loading content...</div>
        </main>
      </div>
    );
  }

  if (error || !submodule) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col relative">
        <Header />
        <Disclaimer />
        <main className="flex-1 flex items-center">
          <div className="text-center text-gray-400">
            {error || "Content not found."}
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
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-300">
              {submodule.name}
            </h2>
            {submodule.summary && (
              <div className="bg-gray-700/50 rounded-xl p-4 shadow-md shadow-black/10 border border-gray-600/50 mb-4">
                <p className="text-gray-300 text-center text-md md:text-lg italic">
                  {submodule.summary}
                </p>
              </div>
            )}
            <div className="bg-gray-700 rounded-2xl p-8 shadow-md shadow-black/20 border border-gray-600 mb-8">
              <p className="text-gray-300 text-center text-lg md:text-xl leading-relaxed">
                {submodule.content}
              </p>
            </div>
            <div className="flex justify-between">
              <Link
                to={`/course/${courseId}`}
                className="text-gray-400 hover:text-gray-200 underline"
              >
                Back to Submodules
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-gray-200 underline"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Content;
