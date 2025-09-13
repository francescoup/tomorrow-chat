/*import { useState } from "react";
 import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg"; */
import Avatar from "./assets/Components/Avatar";
import "./App.css";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
        <p className="text-4xl text-blue-800">
          Tomorrow dev chat
          <Avatar
            name="Mario Rossi"
            src="./react.svg"
            size="lg"
            rounded="full"
            status="online"
          ></Avatar>
          <Avatar
            name="Mario Rossi"
            size="md"
            rounded="xl"
            status="away"
          ></Avatar>
        </p>
      </div>
    </>
  );
}

export default App;
