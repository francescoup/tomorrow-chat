import IconWrapper from "./IconWrapper";
import { FaMoon, FaSun } from "react-icons/fa";
import logoCompleto from "../assets/img/logoCompleto.png";

export default function Header({ theme, setTheme }) {
  return (
    <div
      className={`w-full h-[88px] px-6 flex items-center justify-between border-b
      ${
        theme === "dark"
          ? "bg-[#20233C] border-gray-700 text-gray-100"
          : "bg-gray-100 border-gray-200 text-gray-800"
      }`}
    >
      {/* inserisco l'immagine prima della scritta  */}
      <div className="flex items-center gap-3">
        <img
          src={logoCompleto}
          alt="Logo palestra"
          className="h-10 w-auto object-contain"
        />
        <h1 className="text-xl font-bold select-none">
          Palestra di TomorrowDevs
        </h1>
      </div>

      <div className="flex items-center gap-2 h-[40px]">
        <IconWrapper
          icon={theme === "dark" ? <FaSun /> : <FaMoon />}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </div>
    </div>
  );
}
