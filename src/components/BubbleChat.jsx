export default function BubbleChat({
  isUser, // true se il messaggio è dell'utente, false se è del bot
  time,
  children,
}) {
  return (
    <div
      className={`max-w-lg rounded-2xl p-3 shadow 
        ${
          isUser
            ? // USER (light + dark)
              "bg-blue-500 text-white dark:bg-[#4283D4] dark:text-white"
            : // AI (light + dark)
              "bg-white  text-gray-800 dark:bg-[#292B3B] dark:text-white dark:border dark:border-gray-700"
        }`}
    >
      {/* testo messaggio */}
      <div className="whitespace-pre-wrap break-words">{children}</div>

      {/* timestamp */}
      <p
        className={`mt-1 text-xs ${
          isUser
            ? "text-blue-100 flex justify-end dark:text-blue-100"
            : "text-gray-500 dark:text-gray-300"
        }`}
      >
        {time}
      </p>
    </div>
  );
}
