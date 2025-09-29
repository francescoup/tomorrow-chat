import React from "react";
import { useGlobalStore } from "../store/useGlobalStore";

const colorsBubble = [
  { label: "dark:bg-[#4283D4] bg-blue-500", bgColor: "dark:bg-[#4283D4] bg-blue-500" },
  { label: "dark:bg-[#DBA842] bg-yellow-400", bgColor: "dark:bg-[#DBA842] bg-yellow-400" },
  { label: "dark:bg-[#38A84A] bg-[#42DB5B]", bgColor: "dark:bg-[#38A84A]  bg-[#42DB5B]" },
  { label: "dark:bg-[#292B3B] bg-gray-700", bgColor: "dark:bg-[#292B3B] bg-gray-700" },
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
      <span className="text-gray-600 dark:text-gray-400 w-full text-sm">Your Bubble Color</span>
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
      <span className="text-gray-600 dark:text-gray-400 w-full text-sm">Bot Bubble Color</span>
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
