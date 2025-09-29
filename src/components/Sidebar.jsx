import React from "react";
import { twMerge } from "tailwind-merge";
import FontSize from "./FontSize";
import BubbleColor from "./BubbleColor";
import FontColors from "./FontColors";

const Sidebar = ({ isOpen = false, closeSidebar = () => {} }) => {
  return (
    <>
      {/* Overlay (cliccabile per chiudere) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={twMerge(
          `fixed z-50 bg-white dark:bg-[#1A1C21] shadow-lg transition-transform duration-300
           w-full h-2/3 bottom-0 right-0
           transform translate-y-full 
           md:top-0 md:bottom-auto md:h-full md:w-80 md:translate-y-0 md:translate-x-full`,
          isOpen ? "translate-y-0 md:translate-x-0" : ""
        )}
      >
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-xl text-gray-800 dark:text-gray-200 text-center font-semibold mb-4">Settings</h2>

          <FontSize />
          <BubbleColor />
          <FontColors />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
