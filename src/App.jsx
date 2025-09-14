import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import TextInput from "./Components/TextInput";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const [message, setMessage] = useState(""); // ! TEXT INPUT ! Necessario, altrimenti il componente non viene inizializzato e viene restituito l'errore "ReferenceError".

  // Piccola simulazione "visiva" dell'input test
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 p-4 space-y-4">
        <p className="text-4xl text-blue-800">Tomorrow dev chat</p>

        <div className="w-full max-w-md">
          <TextInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Scrivi un messaggio..."
          />
        </div>
      </div>
    </>
  );
}

export default App;
