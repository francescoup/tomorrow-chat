import TextInput from "./TextInput";
import EventButton from "./EventButton";
import { TbSend2 } from "react-icons/tb";

export default function InputForm({ input, setInput, onSend }) {
  return (
    <div className="p-4 rounded-xl shadow bg-white dark:bg-[#18192D] m-4 border-1 border-gray-200 dark:border-gray-700 dark:text-white">
      <div className="flex items-center">
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          onSend={onSend}
        />
        <EventButton onClick={onSend} icon={<TbSend2 />}>
          Invia
        </EventButton>
      </div>
    </div>
  );
}
