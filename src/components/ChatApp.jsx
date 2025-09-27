import EventButton from "./EventButton";
import BubbleChat from "./BubbleChat";
import Avatar from "./Avatar";
import InputForm from "./InputForm";
import { FaUser } from "react-icons/fa";
import { RiOpenaiFill } from "react-icons/ri";
import TextInput from "./TextInput";
import LoaderBubble from "./LoaderBubble";
import { useRef } from "react";
import { useEffect } from "react";
import logoAvatar from "../assets/img/logoAvatar.png";

export default function ChatApp({ messages, loading }) {
  const endChat = useRef(null);
  useEffect(() => {
    endChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 flex ${
            msg.isUser ? "justify-end" : "justify-start"
          }`}
        >
          {!msg.isUser && (
            <div className=" mr-2">
              {/* <Avatar icon={<RiOpenaiFill />} size="sm" /> */}
              <Avatar src={logoAvatar} size="sm" />
            </div>
          )}
          <BubbleChat isUser={msg.isUser} time={msg.time}>
            {msg.message}
          </BubbleChat>
          {msg.isUser && (
            <div className=" ml-2">
              <Avatar icon={<FaUser />} />
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="mb-4 flex justify-start">
          <div className="mr-2">
            <Avatar icon={logoAvatar} size="sm" />
            {/*  <Avatar icon={<RiOpenaiFill />} size="sm" /> */}
          </div>
          <LoaderBubble />
        </div>
      )}
      <div ref={endChat}></div>
    </div>
  );
}
