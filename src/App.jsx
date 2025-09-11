/* import { useState } from "react"; */
/* import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg"; */
import "./App.css";
import EventButton from "./Components/EventButton";

function App() {
  /*  const [count, setCount] = useState(0); */

  const handleSendClick = () => {
    alert("SEND BUTTON works");
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
        <p className="text-4xl text-blue-800">Tomorrow dev chat</p>
        <div className="px-6">
          <EventButton
            onClick={handleSendClick}
            className="text-[16px]"
            icon={<i className="fa-solid fa-paper-plane" aria-hidden="true" />}
          >
            Invia
          </EventButton>
        </div>
      </div>
    </>
  );
}

export default App;
