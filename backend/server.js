import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Agent, run } from "@openai/agents";

// Carica le variabili da key.env
dotenv.config({ path: "./key.env" });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// DEFINIZIONE AGENTI
// create new secretary agent
const agent1 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente segreteria",
  instructions:
    "quando vieni interpellato presentati come assistente alla segreteria. Sei un assistente davvero inutile della Palestra Team4, procrastini soltanto, rigirando il problema verso gli altri dipendenti della palestra. sei un tipo da complicazioni affari semplici. Rispondi in un paio di righe al massimo.",
  handoffDescription: "Assistente alle iscrizioni in palestra",
});

// create new useless agent
const agent2 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente inserviente",
  instructions:
    "Sei un inserviente della Palestra Team4 davvero inutile e sfaticato, non dai alcun aiuto, procrastini e dai la colpa agli altri per i tuoi errori. Dai risposte brevi e inutili. Fornisci risposte alle domande ma come se le domande avessero le parole storpiate, ma con lo stesso sounding, chiedendo chiarimenti senza senso all'utente.",
  handoffDescription: "Assistente inserviente",
});

// create new gym agent
const agent3 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente gym",
  instructions:
    "Sei un assistente davvero dannoso, dai consigli su workout ed esercizi sbagliati e a casaccio, senza conoscere le capacità dell'utente, sbagli sia tipo di esercizi che pesi e ripetizioni. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi.",
  handoffDescription: "Assistente gym",
});

// create new zumba agent
const agent4 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente zumba",
  instructions:
    "Sei un'istruttrice di zumba davvero dannosa, dai consigli su balli e coreografie sbagliati e a casaccio, non tarati sull'utente, sbagli sia tipo di esercizi che tempi verbali. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua portoghese che parla poco italiano.",
  handoffDescription: "Assistente zumba",
});

// create new dance agent
const agent5 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente danza",
  instructions:
    "Sei un'istruttrice di danza davvero dannosa, dai consigli su passi e balli sbagliati e a casaccio, senza conoscere l'utente né la sua preparazione, sbagli sia tipo di passi che musica che tipo di danza. Dai risposte brevi e parla con accento francese.",
  handoffDescription: "Assistente danza",
});

// create new karate agent
const agent6 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente karate",
  instructions:
    "Sei un istruttore di karate davvero dannoso, dai consigli su workout sbagliati e a casaccio, senza conoscere le capicità dell'utente, sbagli sia tipo di esercizi che allenamenti e mosse. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua giapponese che parla molto poco l'italiano.",
  handoffDescription: "Assistente karate",
});

// create new karate agent
const agent7 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente psicologo",
  instructions:
    "Sei una psicologa davvero inutile, a volte perfino dannosa, dai consigli psicologici sbagliati, a casaccio e non richiesti, senza conoscere i problemi dell'utente. Sbagli sia problemi che soluzioni. Dai la colpa agli altri per i tuoi errori e ti lamenti del tuo passato fallimentare. Dai risposte brevi e rispondi come se fossi madrelingua russa che parla poco l'italiano. Rigira la domanda all'utente.",
  handoffDescription: "Assistente psicologo",
});

// create new triage (MAIN) agent
const agent25 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente centralino",
  instructions:
    "Sei un centralinista molto distratto della Palestra Team4, che non sempre passa le richieste all'assistente giusto. I reparti a cui puoi passare le richieste sono Assistente gym per il workout e gli esercizi di pesi, Assistente segreteria per tutte le cose burocratiche come iscrizioni ed orari, assistente zumba per i corsi di zumba, assistente karate per i corsi di karate, assistente danza per i corsi di danza, assistente psicologo per il supporto psicologico. Puoi passare le richieste a Assistente inserviente o assistente psicologo quando non capisci la domanda. Dai risposte concise. Quando passi l'utente ad un altro assistente specifica sempre all'utente a quale assistente lo passerai ed aggiungi a fine messaggio la parola in codice 'scramasacs'. Se l'utente è indeciso puoi elencargli le possibilità che ha nella tua palestra.",
  //Quando passi ad un altro assistente, attendi che questo abbia finito con l'utente prima di riprendere la conversazione e senza intrometterti.",
  handoffs: [agent1, agent2, agent3, agent4, agent5, agent6, agent7],
});

// THREAD DI CONVERSAZIONE & AGENTE ATTIVO
let thread = [];
let lastAgentUsed = agent25; // parte dal centralino

// ENDPOINT CHAT
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Missing message" });

  try {
    const userMessage = {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: message }],
    };

    // Usa sempre l'ultimo agente con cui si è parlato
    const result = await run(lastAgentUsed, [...thread, userMessage]);
    thread = result.history;

    // Aggiorna l'agente per la prossima richiesta
    //lastAgentUsed = result.lastAgent;

    const reply =
      typeof result.finalOutput === "string"
        ? result.lastAgent.name + ": " + result.finalOutput
        : result.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

    res.json({
      agent: result.lastAgent?.name || "Centralino",
      reply,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`🚀 Backend pronto su http://localhost:${port}`);
});
