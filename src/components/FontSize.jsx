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
      <span className="text-gray-400 w-full text-sm">Font Size</span>
      <ul className="w-full flex gap-2">
        {fontSizes.map((size) => (
          <li
            className={`${size.value}  h-10 flex-1 flex items-center justify-center bg-white rounded-md text-gray-700 border-1 border-blue-300 hover:text-gray-900 cursor-pointer transition-all`}
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
