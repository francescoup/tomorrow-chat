import React from "react";
import { useGlobalStore } from "../store/useGlobalStore";

const colorsText = [
  { label: "text-white", bgColor: "bg-white" },
  { label: "text-gray-800", bgColor: "bg-gray-800" },
];

const FontColors = () => {
  const { botTitleColor, titleColor, updateColorTitle, updateBotColorTitle } =
    useGlobalStore();
  return (
    <div className="flex flex-col gap-4 w-full">
      <span className="text-gray-400 w-full text-sm">Your Message color</span>
      <ul className="flex gap-4">
        {colorsText.map((color, i) => {
          return (
            <li
              onClick={() => updateColorTitle(color.label)}
              key={`${i}-${color}`}
              className={`${color.bgColor} ${
                color.label == titleColor ? "border-4" : "null"
              } ${
                color.label == titleColor ? "border-4" : "null"
              } rounded-full w-10 h-10 border hover:scale-90 transition-all`}
            ></li>
          );
        })}
      </ul>
      <span className="text-gray-400 w-full text-sm">Bot Message Color</span>
      <ul className="flex gap-4">
        {colorsText.map((color, i) => {
          return (
            <li
              onClick={() => updateBotColorTitle(color.label)}
              key={`${i}-${color}`}
              className={`${color.bgColor} ${
                color.label == botTitleColor ? "border-4" : "null"
              } ${
                color.label == botTitleColor ? "border-4" : "null"
              } rounded-full w-10 h-10 border hover:scale-90 transition-all`}
            ></li>
          );
        })}
      </ul>
    </div>
  );
};

export default FontColors;
