import "./App.css";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatApp from "./components/ChatApp";
import InputForm from "./components/InputForm";
import IconWrapper from "./components/IconWrapper";
import Avatar from "./components/Avatar";
import { MdSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import logoAvatar from "./assets/img/logoAvatar.png";

function App() {
  const [messages, setMessages] = useState([
    {
      message:
        "Centralinista: Buongiorno e benvenut* nel servizio di assistenza online h24 della Palestra Team4, come posso aiutarti?",
      isUser: false,
      name: "Centralinista",
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

  // Versione debug del handleSend in App.jsx
  const handleSend = async () => {
    console.log("=== INIZIO HANDLE SEND ===");

    if (!input.trim() || isLoading) {
      console.log("❌ Input vuoto o loading in corso, uscita");
      return;
    }

    const now = new Date();
    const userMessage = {
      message: input,
      isUser: true,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    console.log("📤 Messaggio utente creato:", userMessage);
    setMessages((prev) => {
      console.log("📋 Messaggi prima dell'aggiunta utente:", prev.length);
      const newMessages = [...prev, userMessage];
      console.log("📋 Messaggi dopo aggiunta utente:", newMessages.length);
      return newMessages;
    });

    const currentInput = input;
    setInput("");
    setIsLoading(true);
    console.log("🚀 Invio richiesta al server con input:", currentInput);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          sessionId: "default",
        }),
      });

      console.log("📡 Risposta ricevuta, status:", res.status);
      console.log("📡 Headers risposta:", Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Leggi la risposta come testo prima di fare il parse
      const responseText = await res.text();
      console.log("📄 Testo risposta raw:", responseText);
      console.log("📄 Lunghezza testo risposta:", responseText.length);

      // Prova a fare il parse
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("✅ Parse JSON riuscito");
      } catch (parseError) {
        console.error("❌ Errore parse JSON:", parseError);
        console.log("🔍 Primi 500 caratteri del testo:", responseText.substring(0, 500));
        throw new Error("Risposta non è JSON valido");
      }

      console.log("📦 Data ricevuto (tipo):", typeof data);
      console.log("📦 Data ricevuto (è array?):", Array.isArray(data));
      console.log("📦 Data ricevuto (contenuto):", data);

      // Trasforma in array se necessario
      const responses = Array.isArray(data) ? data : [data];
      console.log("📋 Responses array:", responses);
      console.log("📋 Responses length:", responses.length);

      // Debug di ogni singola risposta
      responses.forEach((element, index) => {
        console.log(`🔍 Processing response ${index}:`);
        console.log(`   - Tipo:`, typeof element);
        console.log(`   - Contenuto:`, element);
        console.log(`   - Ha agent?`, !!element?.agent);
        console.log(`   - Ha reply?`, !!element?.reply);
        console.log(`   - Agent value:`, element?.agent);
        console.log(`   - Reply value:`, element?.reply);
        console.log(`   - Reply type:`, typeof element?.reply);
        console.log(`   - Reply length:`, element?.reply?.length);
      });

      // Raccogli tutti i messaggi validi
      const newMessages = [];

      responses.forEach((element, index) => {
        console.log(`🔄 Elaborazione risposta ${index}`);

        if (element && element.reply !== undefined && element.reply !== null) {
          console.log(`✅ Risposta ${index}: ha reply valida`);

          const replyText = String(element.reply);
          const cleanReply = replyText.trim();

          console.log(`📝 Reply originale: "${element.reply}"`);
          console.log(`📝 Reply pulita: "${cleanReply}"`);
          console.log(`📏 Lunghezza reply pulita:`, cleanReply.length);

          // Accetta anche reply vuote per la musichetta
          if (cleanReply.length > 0 || element.agent === "Musichetta d'attesa") {
            const botMessage = {
              message: element.reply,
              isUser: false,
              name: element.agent || "Bot",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };

            console.log(`✅ Messaggio ${index} creato:`, botMessage);
            newMessages.push(botMessage);
          } else {
            console.log(`❌ Risposta ${index} scartata: reply vuota`);
          }
        } else {
          console.log(`❌ Risposta ${index} scartata: struttura invalida`);
          console.log(`   - element esistente:`, !!element);
          console.log(`   - reply definita:`, element?.reply !== undefined);
          console.log(`   - reply non null:`, element?.reply !== null);
        }
      });

      console.log(`📊 Messaggi validi raccolti: ${newMessages.length}`);
      console.log(`📋 Messaggi da aggiungere:`, newMessages);

      // Aggiungi i messaggi
      if (newMessages.length > 0) {
        setMessages((prev) => {
          console.log("📋 Messaggi prima dell'aggiunta bot:", prev.length);
          const updated = [...prev, ...newMessages];
          console.log("📋 Messaggi dopo aggiunta bot:", updated.length);
          console.log("📋 Ultimi messaggi nell'array:", updated.slice(-3));
          return updated;
        });
        console.log(`✅ Aggiunti ${newMessages.length} messaggi all'interfaccia`);
      } else {
        console.warn("⚠️ Nessun messaggio valido da aggiungere");
      }
    } catch (err) {
      console.error("💥 Errore nella richiesta:", err);
      console.error("💥 Stack trace:", err.stack);

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
      console.log("🏁 Fine handleSend, setting loading to false");
      setIsLoading(false);
    }
  };

  /*  const handleSend = async () => {
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
*/
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
          <IconWrapper icon={<MdSettings />} />
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
    </div>
  );
}

export default App;
