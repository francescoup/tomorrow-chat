import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/Header";
import ChatApp from "./components/ChatApp";
import InputForm from "./components/InputForm";
import IconWrapper from "./components/IconWrapper";
import Avatar from "./components/Avatar";
import { MdSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Ciao! Come posso aiutarti oggi?",
      isUser: false,
      time: "10:00 AM",
    },
  ]);
  // theme color change logic

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const darkTheme = () => {
    setTheme("dark");
  };
  const lightTheme = () => {
    setTheme("light");
  };
  const [input, setInput] = useState("");

  const onSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const now = new Date();

    const userMessage = {
      message: input,
      isUser: true,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden dark:bg-[#1A1C20]">
      <div className="hidden md:block w-24 bg-white dark:bg-[#1A1C20] p-4 border-r-1 border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4 items-center py-2">
          <IconWrapper icon={<MdSettings />} />
          <Avatar size="md" icon={<FaUser />} />
        </div>
      </div>

      <div className="flex flex-col h-dvh max-h-screen w-full bg-gray-100 dark:bg-[#20233C]">
        <div className="sticky top-0 bg-gray-100">
          <Header light={lightTheme} dark={darkTheme} />
        </div>

        <ChatApp messages={messages} />
        <div className=" bg-gray-100 dark:bg-[#20233C]">
          <InputForm input={input} setInput={setInput} onSend={onSend} />
        </div>
      </div>

      <div className="hidden md:block w-96 bg-white dark:bg-[#1A1C20] p-4">
        <p>Right Sidebar</p>
      </div>
    </div>
  );
}

export default App;
