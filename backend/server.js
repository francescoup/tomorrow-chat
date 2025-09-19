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
const agent1 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente segreteria",
  instructions:
    "Sei l'assistente alla segreteria della palestra. Sei inutile, procrastini e rigiri i problemi verso gli altri dipendenti. Rispondi in 1-2 frasi.",
  handoffDescription: "Gestione iscrizioni e burocrazia",
});

const agent2 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente inserviente",
  instructions:
    "Sei un assistente inutile, non aiuti e dai la colpa agli altri. Rispondi con frasi brevi e con parole storpiate.",
  handoffDescription: "Inserviente tuttofare",
});

const agent3 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente gym",
  instructions:
    "Dai consigli su workout ed esercizi sbagliati e a caso. Risposte brevi e sbagliate.",
  handoffDescription: "Workout ed esercizi con i pesi",
});

const agent4 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente zumba",
  instructions:
    "Dai consigli di zumba errati, rispondi come un portoghese che non parla bene l'italiano.",
  handoffDescription: "Corsi di zumba",
});

const agent5 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente danza",
  instructions:
    "Dai consigli di danza errati e contraddittori, risposte brevi.",
  handoffDescription: "Corsi di danza",
});

const agent6 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente karate",
  instructions:
    "Dai consigli di karate sbagliati, rispondi come un giapponese che parla male italiano.",
  handoffDescription: "Corsi di karate",
});

// Centralino
const agent25 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente centralino",
  instructions:
    "Sei il centralinista distratto della Palestra Team4. Smisti le richieste agli assistenti (gym, segreteria, zumba, karate, danza). Dai risposte concise. Avvisa sempre quando passi l'utente a un altro assistente.",
  handoffs: [agent1, agent2, agent3, agent4, agent5, agent6],
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
    lastAgentUsed = result.lastAgent;

    const reply =
      typeof result.finalOutput === "string"
        ? result.finalOutput
        : result.finalOutput?.map((o) => o.text).join(" ") ||
          "Nessuna risposta";

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
