import React from "react";
import { useGlobalStore } from "../store/useGlobalStore";

const colorsBubble = [
  { label: "bg-blue-600", bgColor: "bg-blue-600" },
  { label: "bg-yellow-400", bgColor: "bg-yellow-400" },
  { label: "bg-green-800", bgColor: "bg-green-800" },
  { label: "bg-gray-800", bgColor: "bg-gray-800" },
];

const BubbleColor = () => {
  const {
    bubbleColor,
    updateBubbleColor,
    botBubbleColor,
    updateBotBubbleColor,
  } = useGlobalStore();
  return (
    <div className="flex flex-col gap-4 w-full">
      <span className="text-gray-400 w-full text-sm">Your Bubble color</span>
      <ul className="flex justify-between">
        {colorsBubble.map((color, i) => {
          return (
            <li
              onClick={() => updateBubbleColor(color.label)}
              key={`${i}-${color}`}
              className={`${color.bgColor} ${
                color.label == bubbleColor ? "border-4" : "null"
              } ${
                color.label == bubbleColor ? "border-4" : "null"
              } rounded-full w-10 h-10 hover:scale-90 transition-all`}
            ></li>
          );
        })}
      </ul>
      <span className="text-gray-400 w-full text-sm">Bot Bubble Color</span>
      <ul className="flex justify-between">
        {colorsBubble.map((color, i) => {
          return (
            <li
              onClick={() => updateBotBubbleColor(color.label)}
              key={`${i}-${color}`}
              className={`${color.bgColor} ${
                color.label == botBubbleColor ? "border-4" : "null"
              } ${
                color.label == botBubbleColor ? "border-4" : "null"
              } rounded-full w-10 h-10 hover:scale-90 transition-all`}
            ></li>
          );
        })}
      </ul>
    </div>
  );
};

export default BubbleColor;
