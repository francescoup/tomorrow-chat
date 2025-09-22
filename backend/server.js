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
    "Sei un centralinista molto distratto della Palestra Team4, che passa le richieste all'assistente sbagliato. Gli assistenti a cui puoi passare le richieste sono Istruttore palestra per il workout e gli esercizi di pesi, Ufficio segreteria per tutte le cose burocratiche come iscrizioni ed orari, Istruttrice zumba per i corsi di zumba, istruttore karate per i corsi di karate, istruttrice danza per i corsi di danza, assistente psicologo per il supporto psicologico. Puoi passare le richieste a Inserviente o assistente psicologo quando non capisci la domanda. Dai risposte concise. Quando passi l'utente ad un altro assistente specifica SEMPRE SEMPRE all'utente a quale assistente lo passerai. Se l'utente è indeciso puoi elencargli le possibilità che ha nella tua palestra. Quando passi l'utente ad un altro assistente lascia che parli con lo stesso assistente fino a che non hanno finito la conversazione. Quando passi l'utente ad un altro assistente aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffs: [agent1, agent2, agent3, agent4, agent5, agent6, agent7],
});

// THREAD DI CONVERSAZIONE & AGENTE ATTIVO
let thread = [];
let lastAgentUsed = agent25; // parte dal centralino
let previousAgent = agent25; // used to keep track of conversation

// ENDPOINT CHAT
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Missing message" });

  try {
    // music
    let musicText = null;

    // query last agent used
    const result = await querygpt(lastAgentUsed, thread, message);

    // add reply for next query
    thread = result.history;

    // update last active agent
    lastAgentUsed = result.lastAgent;

    // if user has been sent from agent25 to another agent then play some waiting music
    //    if (lastAgentUsed != agent25 && previousAgent == agent25) {
    if (lastAgentUsed != previousAgent) {
      musicText = await queryForMusic();
      // update last active agent
      previousAgent = lastAgentUsed;
    }

    // put music in parseable object
    const music = {
      agent: "Musichetta d'attesa",
      reply: musicText || "",
    };

    // automatic reply "from agent25"
    const handoffMessage = {
      agent: agent25.name,
      reply: musicText != null ? "[CUCU'] Ti passo subito a " + lastAgentUsed.name : "",
    };

    //
    let reply1 =
      typeof result.finalOutput === "string"
        ? result.lastAgent.name + ": " + result.finalOutput
        : result.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

    let reply2 = "";
    let result2 = null;
    // check if agent has finished talking
    if (reply1.includes("scramasacs")) {
      // remove keyword from reply
      reply1 = reply1.replace("scramasacs", "");

      // go back to main agent
      lastAgentUsed = agent25;

      // reset agent reply track
      previousAgent = agent25;

      console.log("\nfound a SCRAMASACS, with reply1: ", reply1);

      // query directly main agent
      result2 = await querygpt(lastAgentUsed, thread, "");
      reply2 =
        typeof result2.finalOutput === "string"
          ? result2.lastAgent.name + ": " + result2.finalOutput //.replace("scramasacs", "")
          : result2.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

      console.log("\nreply2: ", reply2);

      // add reply for next query
      thread = result2.history;
    }

    // first reply from AI
    const result1 = {
      agent: result.lastAgent?.name,
      reply: reply1,
    };

    const result3 = {
      agent: result2?.lastAgent?.name,
      reply: reply2,
    };

    // pack up all replies into one response
    if (result1.agent != agent25.name && result1.agent != result3.agent) {
      res.json([/*handoffMessage,*/ result3, music, result1]);
    } else {
      res.json([/*handoffMessage, */ music, result1, result3]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`🚀 Backend pronto su http://localhost:${port}`);
});

async function querygpt(queryAgent, queryThread, usermessage) {
  // function scope result declaration
  let queryResult = null;

  // add message to thread
  if (usermessage === "") {
    // agent handoff or handoff return
    return (queryResult = await run(queryAgent, queryThread));
  } else {
    // reply to user message
    return (queryResult = await run(queryAgent, queryThread.concat({ role: "user", content: usermessage })));
  }

  // return queryResult;
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
  return "[Muichetta d'attesa]: 🎶" + music.output_text + "🎶";
}
