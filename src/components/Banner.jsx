import React, { useState } from "react";

function Banner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="w-full max-w-xl mx-auto mt-4 mb-2 px-4 py-3 bg-gray-800 border-l-4 border-gray-700 rounded-xl shadow-lg shadow-black/30 text-gray-200 animate-slidein relative">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-gray-100 text-base flex items-center gap-2">
          <span>📰</span> News
        </span>
        <button
          className="text-gray-400 hover:text-gray-200 px-2 py-1 rounded transition"
          onClick={() => setVisible(false)}
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
      <div className="text-sm text-gray-300">
        Welcome to the ADSA Model Lab! Answers are not verified. Access keys
        will be added soon.
      </div>
    </div>
  );
}

export default Banner;
