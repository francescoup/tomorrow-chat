import React from "react";
import { useGlobalStore } from "../store/useGlobalStore";
const fontSizes = [
  { label: "sm", value: "text-sm" },
  { label: "md", value: "text-md" },
  { label: "lg", value: "text-lg" },
  { label: "xl", value: "text-xl" },
];
const FontSize = () => {
  const { titleFont, updateFontTitle } = useGlobalStore();

  return (
    <div className="flex flex-col w-full">
      <span className="mb-2 text-gray-600 dark:text-gray-400 w-full text-sm">Font Size</span>
      <ul className="w-full flex gap-2">
        {fontSizes.map((size) => (
          <li
            className={`${size.value} h-10 flex-1 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-200 border-1 border-blue-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-all`}
            key={size.value}
            onClick={() => updateFontTitle(size.value)}
          >
            {size.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FontSize;
