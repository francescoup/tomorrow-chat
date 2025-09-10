import { useState } from "react";
//import components
import SendButton from "./SendButton";

export default function ChatInput({ onSend, sending = false }) {
  const [text, setText] = useState("");
  const handleSendClick = () => alert("sono il bottone importato");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendClick();
      }}
    >
      <div className="border-b border-gray-900/10">
        <h2 className="text-base/7 font-semibold text-gray-900">
          Chiedi a ChatBot Team4
        </h2>
        <div className="{mt-2}">
          <textarea
            id="askChatBot"
            name="askChatBot"
            rows="3"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          ></textarea>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <SendButton onClick={handleSendClick}>Invia</SendButton>
      </div>
    </form>
  );
}
