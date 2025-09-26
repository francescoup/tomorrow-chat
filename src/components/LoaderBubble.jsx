import React from "react";

const LoaderBubble = () => (
  <div className="inline-block bg-gray-100 dark:bg-[#292B3B] rounded-2xl px-2 py-1 min-w-[40px] min-h-[24px] shadow-sm">
    <div className="flex items-end h-4 gap-1">
      <span className="block w-1.5 h-1.5 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:0s]"></span>
      <span className="block w-1.5 h-1.5 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="block w-1.5 h-1.5 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  </div>
);

export default LoaderBubble;