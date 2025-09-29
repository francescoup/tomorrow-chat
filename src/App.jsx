import "./App.css";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatApp from "./components/ChatApp";
import InputForm from "./components/InputForm";
import IconWrapper from "./components/IconWrapper";
import Avatar from "./components/Avatar";
import Sidebar from "./components/Sidebar";
import { MdSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import logoAvatar from "./assets/img/logoAvatar.png";
import { useGlobalStore } from "./store/useGlobalStore";

function App() {
  const [messages, setMessages] = useState([
    {
      message:
        "Buongiorno e benvenut* nel servizio di assistenza online h24 della Palestra Team4, come posso aiutarti?",
      isUser: false,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // theme color change logic
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const { sidebar, updateSidebar } = useGlobalStore();
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const now = new Date();
    const userMessage = {
      message: input,
      isUser: true,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          sessionId: "default", // potresti generare un ID unico per sessione
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Received data:", data);

      if (Array.isArray(data)) {
        data.forEach((element) => {
          if (element && element.reply && element.reply.trim() !== "") {
            const botMessage = {
              message: element.reply,
              isUser: false,
              name: element.agent || "Bot",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
            setMessages((prev) => [...prev, botMessage]);
          }
        });
      } else {
        if (data && data.reply && data.reply.trim() !== "") {
          const botMessage = {
            message: data.reply,
            isUser: false,
            name: data.agent || "Bot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      }
    } catch (err) {
      console.error("Errore nella richiesta:", err);
      const errorMessage = {
        message: "Errore nel server. Riprova più tardi.",
        isUser: false,
        name: "Sistema",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-100 dark:bg-[#1A1C20] transition-all">
      <div className="hidden md:block w-24 bg-white dark:bg-[#1A1C20] p-4 border-r-1 border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4 items-center py-2">
          <IconWrapper icon={<MdSettings />} onClick={updateSidebar} />
          {/* <Avatar size="md" icon={<FaUser />} /> */}
          <Avatar size="md" src={logoAvatar} />
        </div>
      </div>

      <div className="flex flex-col h-dvh max-h-screen w-full bg-gray-100 dark:bg-[#20233C]">
        <div className="sticky top-0 bg-gray-100">
          <Header theme={theme} setTheme={setTheme} />
        </div>

        <ChatApp messages={messages} loading={isLoading} />
        <div className=" bg-gray-100 dark:bg-[#20233C]">
          <InputForm
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="hidden md:block w-96 bg-white dark:bg-[#1A1C21] p-4">
        <p>Chat History</p>
      </div>
      <Sidebar isOpen={sidebar} closeSidebar={updateSidebar} />
    </div>
  );
}

export default App;
