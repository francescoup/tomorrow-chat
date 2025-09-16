// import IconWrapper from "./IconWrapper";
// import { FaSun, FaMoon } from "react-icons/fa";

export default function Header() {
  // Per gestire il cambio tema, per ora sono placeholder
  const handleLight = () => alert("Light mode!");
  const handleDark = () => alert("Dark mode!");

  return (
    <header className="w-full h-[88px] px-6 flex items-center justify-between bg-white shadow">
      <h1 className="text-xl font-bold text-gray-800">
        Tomorrow dev chat
      </h1>
      <div className="flex gap-3 h-[40px] items-center">
        {/* iconwrapper commentato per evitare errori prima del merge
        <IconWrapper icon={<FaSun />} onClick={handleLight} aria-label="Light mode" />
        <IconWrapper icon={<FaMoon />} onClick={handleDark} aria-label="Dark mode" /> 
        */}
      </div>
    </header>
  );
}