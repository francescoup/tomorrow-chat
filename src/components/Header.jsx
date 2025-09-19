import { useState } from "react";
import IconWrapper from "./IconWrapper";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Header() {
  const [dark, setDark] = useState(false);

  return (
    <header className={`w-full h-[88px] px-6 flex items-center justify-between border-b ${
        dark
          ? "bg-[#20233C] border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h1 className="text-xl font-bold select-none">Tomorrow dev chat</h1>
      <div className="flex items-center gap-2 h-[40px] ">
        <IconWrapper
          icon={dark ? <FaSun className="text-gray-200" /> : <FaMoon className="text-gray-800" />}
          onClick={() => setDark((d) => !d)}
          // la proprietà dark:hover non è funzionante 
          className="bg-transparent hover:bg-gray-400 dark:hover:bg-gray-800"
        />
      </div>
    </header>
  );
}
