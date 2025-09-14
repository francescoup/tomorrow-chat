import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  // START - BUBBLE CHAT

  function BubbleChat({ children, fromUser }) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          marginBottom: "8px",
          justifyContent: fromUser ? "flex-end" : "flex-start", // Quì sposto a destra o sinistra la bubble in base a chi sta scrivendo (User = true | Chatbot = false)
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "16px",
            maxWidth: "75%",
            width: "fit-content",
            wordBreak: "break-word",
            textAlign: fromUser ? "right" : "left", // Infine da quì in poi inserisco dello stile che permette di alternare il posizionamento ed i colori in base a chi sta scrivendo
            backgroundColor: fromUser
              ? "rgb(29, 78, 216)"
              : "rgb(199, 210, 254)",
            color: fromUser ? "white" : "black",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // END - BUBBLE CHAT

  // Esempio di conversazione botta e risposta (lo stile nei div del return l'ho inserito giusto per visualizzarlo meglio durante la simulazione su browser)
  return (
    <>
      <div className="h-screen w-screen bg-gray-100 overflow-y-auto">
        <div className="flex flex-col px-4 py-6 gap-2 h-full w-full">
          <BubbleChat fromUser={true}>
            Le tariffe invernali per le piste di Passo Lanciano dove le trovo ?
          </BubbleChat>

          <BubbleChat fromUser={false}>
            Buonasera, il comprensorio di Passo Lanciano non fa partre dei
            comprensori convenzionati con il nostro servizio. Nella seezione
            "comprensori convenzionati" del notro sito trova la lista di tutti i
            comprensori convenzionati con il nostro servizio.
          </BubbleChat>

          <BubbleChat fromUser={true}>
            quindi posso andare a passo lanciano ?
          </BubbleChat>

          <BubbleChat fromUser={false}>
            Se non fa parte dei comprensori presenti nella lista allora vuol
            dire che il nostro servizio lì non funzionerà.
          </BubbleChat>

          <BubbleChat fromUser={true}>
            Passo lanciano fa parte dei vostri comprensori ?
          </BubbleChat>

          <BubbleChat fromUser={false}>
            Purtroppo temo che non fa parte dei nostri comprensori convenzionati
            dato che non lo trovo nella lista.
          </BubbleChat>

          <BubbleChat fromUser={true}>
            ma io ho già pagato il vostro servizio ! cosa me ne faccio se ora
            non posso nemmeno usarlo ?
          </BubbleChat>

          <BubbleChat fromUser={false}>
            Può usarlo su tutti i comprensori convenzionati che vede nella
            lista, per gli altri comprensori (quelli fuori dalla lista) dovrà
            comperare lo skipass classico in biglietteria oppure appoggiarsi ad
            altro servizio.
          </BubbleChat>

          <BubbleChat fromUser={true}>
            Questa è una truffa legalizzata...
          </BubbleChat>
        </div>
      </div>
    </>
  );
}

export default App;
