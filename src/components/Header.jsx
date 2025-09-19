import IconWrapper from "./IconWrapper";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Header({ light, dark }) {
  // Per gestire il cambio tema, per ora sono placeholder
  const handleLight = () => alert("Light mode!");
  const handleDark = () => alert("Dark mode!");

  return (
    <header className="w-full h-[88px] px-6 flex items-center justify-between  border-b border-gray-200 bg-gray-100">
      <h1 className="text-xl font-bold text-gray-800">Tomorrow dev chat</h1>
      <div className="flex gap-3 h-[40px] items-center">
        <IconWrapper icon={<FaSun />} onClick={light} aria-label="Light mode" />
        <IconWrapper icon={<FaMoon />} onClick={dark} aria-label="Dark mode" />
      </div>
    </header>
  );
}
