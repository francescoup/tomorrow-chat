import { useGlobalStore } from "../store/useGlobalStore";
import { twMerge } from "tailwind-merge";

export default function BubbleChat({
  isUser, // true se il messaggio è dell'utente, false se è del bot
  time,
  children,
}) {
  const { titleFont, bubbleColor, botBubbleColor, titleColor, botTitleColor } =
    useGlobalStore();

  const baseBubbleClasses = "max-w-lg rounded-2xl p-3 shadow";

  // Colore dinamico in base a chi è il messaggio
  const dynamicBubbleClass = isUser
    ? `text-white dark:bg-[#4283D4] dark:text-white ${bubbleColor} ${titleColor}`
    : `text-gray-800 dark:bg-[#292B3B] dark:text-white dark:border dark:border-gray-700 ${botBubbleColor} ${botTitleColor} `;

  // Composizione finale della classe bubble
  const finalBubbleClasses = twMerge(baseBubbleClasses, dynamicBubbleClass);
  return (
    <div
      className={finalBubbleClasses}
      // className={`max-w-lg rounded-2xl p-3 shadow
      //   ${
      //     isUser
      //       ? // USER (light + dark)
      //         "bg-blue-500 text-white dark:bg-[#4283D4] dark:text-white"
      //       : // AI (light + dark)text-gray-800 dark:bg-[#292B3B] dark:text-white dark:border dark:border-gray-700
      //         "bg-white  "
      //   }`}
    >
      {/* testo messaggio */}
      <div className={twMerge("whitespace-pre-wrap break-words", titleFont)}>
        {children}
      </div>

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
