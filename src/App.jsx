import { Component, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

//import components

import SendButton from "./components/SendButton";
import ChatInput from "./components/ChatInput";

function App() {
  const [count, setCount] = useState(0);

  function handleSendClick() {
    alert("Il bottone invia funziona");
  }

  return (
    <>
      <div className="card mt-2 flex items-center gap-x-3">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div className="border-b border-gray-900/10 mt-6">
        <SendButton onClick={handleSendClick}>Invia</SendButton>
        <hr className="mt-6 py-6"></hr>
        <ChatInput></ChatInput>
      </div>
    </>
  );
}

export default App;
