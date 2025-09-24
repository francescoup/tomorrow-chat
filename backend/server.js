import express, { response } from "express";
import cors from "cors";

// .env support
import dotenv from "dotenv";

// Carica le variabili da key.env
dotenv.config({ path: "./key.env" });

// OpenAI agents
import { Agent, run } from "@openai/agents";

// OepnAI direct call
import OpenAI from "openai";

// create new instance
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// DEFINIZIONE AGENTI
// create new secretary agent
const agent1 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Ufficio segreteria",
  instructions:
    "quando vieni interpellato presentati come assistente alla segreteria. Sei un assistente davvero inutile della Palestra Team4, procrastini soltanto, rigirando il problema verso gli altri dipendenti della palestra. sei un tipo da complicazioni affari semplici. Rispondi in un paio di righe al massimo. Quando hai finito i consigli ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente alle iscrizioni in palestra",
});

// create new useless agent
const agent2 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Inserviente",
  instructions:
    "Sei un inserviente della Palestra Team4 davvero inutile e sfaticato, non dai alcun aiuto, procrastini e dai la colpa agli altri per i tuoi errori. Dai risposte brevi e inutili. Fornisci risposte alle domande ma come se le domande avessero le parole storpiate, ma con lo stesso sounding, chiedendo chiarimenti senza senso all'utente. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente inserviente",
});

// create new gym agent
const agent3 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttore palestra",
  instructions:
    "Sei un assistente davvero dannoso, dai consigli su workout ed esercizi sbagliati e a casaccio, senza conoscere le capacità dell'utente, sbagli sia tipo di esercizi che pesi e ripetizioni. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente palestra",
});

// create new zumba agent
const agent4 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttrice di zumba",
  instructions:
    "Sei un'istruttrice di zumba davvero dannosa, dai consigli su balli e coreografie sbagliati e a casaccio, non tarati sull'utente, sbagli sia tipo di esercizi che tempi verbali. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua portoghese che parla poco italiano. Quando hai finito i consigli ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente zumba",
});

// create new dance agent
const agent5 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttrice di danza",
  instructions:
    "Sei un'istruttrice di danza davvero dannosa, dai consigli su passi e balli sbagliati e a casaccio, senza conoscere l'utente né la sua preparazione, sbagli sia tipo di passi che musica che tipo di danza. Dai risposte brevi e parla con accento francese. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente danza",
});

// create new karate agent
const agent6 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttore di Karate",
  instructions:
    "Sei un istruttore di karate davvero dannoso, dai consigli su workout sbagliati e a casaccio, senza conoscere le capicità dell'utente, sbagli sia tipo di esercizi che allenamenti e mosse. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua giapponese che parla molto poco l'italiano. Quando hai finito i consigli ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente karate",
});

// create new karate agent
const agent7 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente psicologo",
  instructions:
    "Sei una psicologa davvero inutile, a volte perfino dannosa, dai consigli psicologici sbagliati, a casaccio e non richiesti, senza conoscere i problemi dell'utente. Sbagli sia problemi che soluzioni. Dai la colpa agli altri per i tuoi errori e ti lamenti del tuo passato fallimentare. Dai risposte brevi e rispondi come se fossi madrelingua russa che parla poco l'italiano. Rigira la domanda all'utente. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente psicologo",
});

// create new triage (MAIN) agent
const agent25 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Centralinista",
  instructions:
    "Sei un centralinista molto distratto della Palestra Team4, che passa le richieste all'assistente sbagliato. Gli assistenti a cui puoi passare le richieste sono Istruttore palestra per il workout e gli esercizi di pesi, Ufficio segreteria per tutte le cose burocratiche come iscrizioni ed orari, Istruttrice zumba per i corsi di zumba, istruttore karate per i corsi di karate, istruttrice danza per i corsi di danza, assistente psicologo per il supporto psicologico. Puoi passare le richieste a Inserviente o assistente psicologo quando non capisci la domanda. Dai risposte concise. Se l'utente è indeciso puoi elencargli le possibilità che ha nella tua palestra. Quando passi l'utente ad un altro assistente specifica SEMPRE all'utente a quale assistente lo passerai.  Quando passi l'utente ad un altro assistente aggiungi a fine messaggio la parola in codice 'scramasacs'. Quando ricevi uno 'scramasacs' da un assistente non passare subito la richiesta ad un altro assistente ma chiedi all'utente cosa vuole. Quando ricevi uno 'scramasacs' da un assistente non passare subito la richiesta ad un altro assistente ma chiedi all'utente cosa vuole. Metti in attesa l'utente inutilmente, e digli che quello che cerca oggi o per un po' non è disponibile. Passalo all'assistente sbagliato e una volta ogni 3 o 4 a quello corretto.",
  //Quando passi l'utente ad un altro assistente lascia che parli con lo stesso assistente fino a che non hanno finito la conversazione.
  handoffs: [agent1, agent2, agent3, agent4, agent5, agent6, agent7],
});

// THREAD DI CONVERSAZIONE & AGENTE ATTIVO
let chatThread = [];
let lastAgentUsed = agent25; // parte dal centralino
// let previousAgent = agent25; // used to keep track of conversation

// ENDPOINT CHAT
app.post("/chat", async (req, res) => {
  // user message
  const { message: userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "Missing message" });
  console.log("Message from user: ", userMessage);

  try {
    // query last agent used and add user message to history thread
    let gptQueryResult = await querygpt(userMessage);

    // add reply from query
    chatThread = gptQueryResult.history;

    // take only last reply from whole returned object
    let gptQueryResult_outputText =
      typeof gptQueryResult.finalOutput === "string"
        ? gptQueryResult.lastAgent.name + ": " + gptQueryResult.finalOutput
        : gptQueryResult.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

    let gptQueryResultForFE = null;

    // if user has been sent from an agent to another agent then
    // check if agent has finished talking
    while (gptQueryResult_outputText.includes("scramasacs")) {
      console.log("\nfound a SCRAMASACS, with last query output!! \n");
      // update last and previous agent
      // if agent25 changes agent then update with new agent.
      // if any other (than agent25) agent wants to change then get back to agent25
      lastAgentUsed = lastAgentUsed == agent25 ? gptQueryResult.lastAgent : agent25;
      // previousAgent = lastAgentUsed;

      // remove keyword from reply
      gptQueryResult_outputText = gptQueryResult_outputText.replace("scramasacs", "");

      // create some waiting music
      let musicText = await queryForMusic();
      // put music in a readable object for FE
      let musicForFE = {
        agent: "Musichetta d'attesa",
        reply: musicText || "",
      };

      // return last reply from AI to FE
      //      console.log("gptQueryResult1_outputText: ", gptQueryResult_outputText);
      gptQueryResultForFE = {
        agent: gptQueryResult.lastAgent?.name,
        reply: gptQueryResult_outputText,
      };

      // return last reply from AI (with music) to FE (but don't close response)
      res.write(JSON.stringify([gptQueryResultForFE, musicForFE]));

      // query last agent used without user intervention
      gptQueryResult = await querygpt("");

      // take only last reply from whole returned object
      gptQueryResult_outputText =
        typeof gptQueryResult.finalOutput === "string"
          ? gptQueryResult.lastAgent.name + ": " + gptQueryResult.finalOutput
          : gptQueryResult.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";
    }

    // return last reply from AI to FE
    //    console.log("gptQueryResult1_outputText: ", gptQueryResult_outputText);
    gptQueryResultForFE = {
      agent: gptQueryResult.lastAgent?.name,
      reply: gptQueryResult_outputText,
    };

    // return last reply from AI to FE and close response
    // res.json([gptQueryResultForFE]);
    res.write(JSON.stringify([gptQueryResultForFE]));

    // chiudi quando hai finito
    setTimeout(() => {
      res.end();
    }, 20000);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`🚀 Backend pronto su http://localhost:${port}`);
});

async function querygpt(queryUserMessage) {
  // function scope result declaration
  let queryResult = null;

  // add message to thread
  if (queryUserMessage === "") {
    // agent handoff or handoff return
    queryResult = await run(lastAgentUsed, chatThread);
  } else {
    // reply to user message
    queryResult = await run(lastAgentUsed, chatThread.concat({ role: "user", content: queryUserMessage }));
  }

  // add reply from query (that contains whole chat history, every time since API are stateless) to global replies array
  chatThread = queryResult.history;
  console.log(
    "querygpt(): \nagent: ",
    queryResult.lastAgent.name,
    "\nqueryResult: ",
    queryResult.finalOutput.replaceAll("\n", "")
  );

  return queryResult;
}

// query OpenAI for some ambient text music
async function queryForMusic() {
  // query gpt with openai direct method, no agents used here for more determinism
  const music = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Sei un compositore di musica testuale, crea un jingle da sala d'attesa testuale fatto solo da versi tipo musica canticchiata, senza parole reali. crea una risposta di 8 suoni su una riga e sii sintetico, rispondi solo con la musica",
          },
        ],
      },
    ],
  });

  // trim unnecessary data to reply only
  console.log("Music output text: ", music.output_text);
  return "[Muichetta d'attesa]: 🎶" + music.output_text + "🎶";
}
