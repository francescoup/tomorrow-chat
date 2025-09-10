import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
        <p className="text-4xl text-blue-800">Tomorrow dev chat</p>
      </div>
    </>
  );
}

export default App;
