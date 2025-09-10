export default function MessagesList({ messages = [] }) {
  {
    !messages?.length && (
      <p className="text-xs/5 text-gray-600">Nessun messaggio ancora</p>
    );

    const ordered = [...messages].sort((a, b) => a.ts - b.ts);

    return (
      <ul className="list-disc flex flex-col gap-2">
        {ordered.map((m) => {
          const mineMessage = m.role === "User";
          const botMessage = m.role === "Bot";
          return (
            <li key={m.id} className={mineMessage ? "self-end" : "selfStart"}>
              <div
                className={
                  mineMessage
                    ? "bg-blue-50 border-blue-200 ml-auto"
                    : "bg-slate-100 border-slate-200"
                }
              >
                {mineMessage.text}
              </div>

              <div className="bg-slate-100 border-slate-200">
                {botMessage.text}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
