import IconWrapper from "./IconWrapper";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header({ theme, setTheme }) {
  return (
    <div className={`w-full h-[88px] px-6 flex items-center justify-between border-b
      ${theme === "dark"
        ? "bg-[#20233C] border-gray-700 text-gray-100"
        : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h1 className="text-xl font-bold select-none">Tomorrow dev chat</h1>
      <div className="flex items-center gap-2 h-[40px]">
        <IconWrapper
          icon={theme === "dark" ? <FaSun /> : <FaMoon />}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </div>
    </div>
  );
}