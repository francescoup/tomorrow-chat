import { useState } from "react";
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
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const userMessage = {
      message: input,
      isUser: true,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Aggiungi messaggio utente
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.message }),
      });

      const data = await res.json();

      data.forEach((element) => {
        let botMessage = {
          message: element.reply,
          isUser: false,
          name: element.agent,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        if (botMessage.message !== "") setMessages((prev) => [...prev, botMessage]);
      });
    } catch (err) {
      console.error(err);
      const errorMessage = {
        message: "Errore nel server. Riprova più tardi.",
        isUser: false,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="hidden md:block w-24 bg-white p-4 border-r-1 border-gray-200">
        <div className="flex flex-col gap-4 items-center py-2">
          <IconWrapper icon={<MdSettings />} />
          <Avatar size="md" icon={<FaUser />} />
        </div>
      </div>

      <div className="flex flex-col h-dvh max-h-screen w-full bg-gray-100">
        <div className="sticky top-0 bg-gray-100">
          <Header />
        </div>

        <ChatApp messages={messages} />
        <div className=" bg-gray-100">
          <InputForm input={input} setInput={setInput} onSend={handleSend} />
        </div>
      </div>

      <div className="hidden md:block w-96 bg-white p-4">
        <p>Right Sidebar</p>
      </div>
    </div>
  );
}

export default App;
