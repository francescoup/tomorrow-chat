export default function BubbleChat({
  isUser, // true se il messaggio è dell'utente, false se è del bot
  time,
  children,
}) {
  return (
    <div
      className={`max-w-xs rounded-2xl p-3 shadow ${
        isUser ? "bg-blue-500 text-white" : "bg-white  text-gray-800"
      }`}
    >
      {children}
      <p
        className={`mt-1 text-xs ${
          isUser ? "text-blue-100 flex justify-end" : "text-gray-500"
        }`}
      >
        {time}
      </p>
    </div>
  );
}
