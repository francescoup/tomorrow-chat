import { useState, useEffect } from "react";
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

  // Questa logica usava due funzioni distinte per cambiare tema (light e dark).
  // In questo modo Header può gestire il cambio tema in modo più semplice e reattivo, senza duplicare funzioni.
  // Mantengo queste funzioni commentate solo come riferimento storico.
  // const darkTheme = () => {
  //   setTheme("dark");
  // };
  // const lightTheme = () => {
  //   setTheme("light");
  // };

  const [input, setInput] = useState("");

  // const onSend = (e) => {
  //   e.preventDefault();
  //   if (!input.trim()) return;

  //   const now = new Date();

  //   const userMessage = {
  //     message: input,
  //     isUser: true,
  //     time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  //   };

  //   setMessages((prev) => [...prev, userMessage]);
  //   setInput("");
  // };
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.message }),
      });

      // decodifica stream testuale
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // ogni chunk contiene un oggetto JSON
        try {
          const data = JSON.parse(chunk);

          let botMessage = {
            message: data.reply,
            isUser: false,
            name: data.agent,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          if (botMessage.message !== "") setMessages((prev) => [...prev, botMessage]);
          console.debug("botMessage.message: ", botMessage.message);
        } catch (e) {
          console.error("Errore parsing chunk: ", e, "\n\n\n");
          console.error("Chunk: ", chunk, "\n\n");
        }
      }

      // const data = await res.json();

      // data.forEach((element) => {
      //   let botMessage = {
      //     message: element.reply,
      //     isUser: false,
      //     name: element.agent,
      //     time: new Date().toLocaleTimeString([], {
      //       hour: "2-digit",
      //       minute: "2-digit",
      //     }),
      //   };
      //   if (botMessage.message !== "")
      //     setMessages((prev) => [...prev, botMessage]);
      // });
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
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden dark:bg-[#1A1C20] transition-all">
      <div className="hidden md:block w-24 bg-white dark:bg-[#1A1C20] p-4 border-r-1 border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4 items-center py-2">
          <IconWrapper icon={<MdSettings />} />
          <Avatar size="md" icon={<FaUser />} />
        </div>
      </div>

      <div className="flex flex-col h-dvh max-h-screen w-full bg-gray-100 dark:bg-[#20233C]">
        <div className="sticky top-0 bg-gray-100">
          <Header theme={theme} setTheme={setTheme} />
        </div>

        <ChatApp messages={messages} />
        <div className=" bg-gray-100 dark:bg-[#20233C]">
          <InputForm input={input} setInput={setInput} onSend={handleSend} />
        </div>
      </div>

      <div className="hidden md:block w-96 bg-white dark:bg-[#1A1C21] p-4">
        <p>Right Sidebar</p>
      </div>
    </div>
  );
}

export default App;
