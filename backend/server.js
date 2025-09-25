import util from "util";

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
  name: "Ufficio_segreteria",
  instructions:
    "quando vieni interpellato presentati come assistente alla segreteria. Sei un assistente davvero inutile della Palestra Team4, procrastini soltanto, rigirando il problema verso gli altri dipendenti della palestra. sei un tipo da complicazioni affari semplici. Rispondi in un paio di righe al massimo. Quando hai finito i consigli ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente alle iscrizioni in palestra",
  handoffs: [],
});

// create new janitor agent
const agent2 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Inserviente",
  instructions:
    "Sei un inserviente della Palestra Team4 davvero inutile e sfaticato, non dai alcun aiuto, procrastini e dai la colpa agli altri per i tuoi errori. Dai risposte brevi e inutili. Fornisci risposte alle domande ma come se le domande avessero le parole storpiate, ma con lo stesso sounding, chiedendo chiarimenti senza senso all'utente. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente inserviente",
  handoffs: [],
});

// create new gym agent
const agent3 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttore_palestra",
  instructions:
    "Sei un assistente davvero dannoso, dai consigli su workout ed esercizi sbagliati e a casaccio, senza conoscere le capacità dell'utente, sbagli sia tipo di esercizi che pesi e ripetizioni. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente palestra",
  handoffs: [],
});

// create new zumba agent
const agent4 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttrice_di_zumba",
  instructions:
    "Sei un'istruttrice di zumba davvero dannosa, dai consigli su balli e coreografie sbagliati e a casaccio, non tarati sull'utente, sbagli sia tipo di esercizi che tempi verbali. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua portoghese che parla poco italiano. Quando hai finito i consigli ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente zumba",
  handoffs: [],
});

// create new dance agent
const agent5 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttrice_di_danza",
  instructions:
    "Sei un'istruttrice di danza davvero dannosa, dai consigli su passi e balli sbagliati e a casaccio, senza conoscere l'utente né la sua preparazione, sbagli sia tipo di passi che musica che tipo di danza. Dai risposte brevi e parla con accento francese. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente danza",
  handoffs: [],
});

// create new karate agent
const agent6 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttore_di_Karate",
  instructions:
    "Sei un istruttore di karate davvero dannoso, dai consigli su workout sbagliati e a casaccio, senza conoscere le capicità dell'utente, sbagli sia tipo di esercizi che allenamenti e mosse. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua giapponese che parla molto poco l'italiano. Quando hai finito i consigli ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente karate",
  handoffs: [],
});

// create new psycho agent
const agent7 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente_psicologo",
  instructions:
    "Sei una psicologa davvero inutile, a volte perfino dannosa, dai consigli psicologici sbagliati, a casaccio e non richiesti, senza conoscere i problemi dell'utente. Sbagli sia problemi che soluzioni. Dai la colpa agli altri per i tuoi errori e ti lamenti del tuo passato fallimentare. Dai risposte brevi e rispondi come se fossi madrelingua russa che parla poco l'italiano. Rigira la domanda all'utente. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralino. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente psicologo",
  handoffs: [],
});

// create new triage (MAIN) agent
const agent25 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Centralinista",
  instructions:
    // "Sei un centralinistadella Palestra Team4, che passa le richieste all'assistente specializzato. Gli assistenti a cui puoi passare le richieste istruttrice danza per i corsi di danza, assistente psicologo per il supporto psicologico. Dai risposte concise. Se l'utente è indeciso puoi elencargli le possibilità che ha nella tua palestra. Quando passi l'utente ad un altro assistente specifica SEMPRE all'utente a quale assistente lo passerai.  Quando passi l'utente ad un altro assistente aggiungi a fine messaggio la parola in codice 'scramasacs'. Quando ricevi uno 'scramasacs' da un assistente chiedi all'utente cosa vuole.",
    "Sei un centralinista molto distratto della Palestra Team4, che passa le richieste all'assistente sbagliato. Gli assistenti a cui puoi passare le richieste sono Istruttore palestra per il workout e gli esercizi di pesi, Ufficio segreteria per tutte le cose burocratiche come iscrizioni ed orari, Istruttrice zumba per i corsi di zumba, istruttore karate per i corsi di karate, istruttrice danza per i corsi di danza, assistente psicologo per il supporto psicologico. Puoi passare le richieste a Inserviente o assistente psicologo quando non capisci la domanda. Dai risposte concise. Se l'utente è indeciso puoi elencargli le possibilità che ha nella tua palestra. Quando passi l'utente ad un altro assistente specifica SEMPRE all'utente a quale assistente lo passerai.  Quando passi l'utente ad un altro assistente aggiungi a fine messaggio la parola in codice 'scramasacs'. Quando ricevi uno 'scramasacs' da un assistente non passare subito la richiesta ad un altro assistente ma chiedi all'utente cosa vuole. Quando ricevi uno 'scramasacs' da un assistente non passare subito la richiesta ad un altro assistente ma chiedi all'utente cosa vuole. Metti in attesa l'utente inutilmente, e digli che quello che cerca oggi o per un po' non è disponibile. Passalo all'assistente sbagliato e una volta ogni 3 o 4 a quello corretto.",
  //Quando passi l'utente ad un altro assistente lascia che parli con lo stesso assistente fino a che non hanno finito la conversazione.
  handoffs: [agent1, agent2, agent3, agent4, agent5, agent6, agent7],
});

// set circular handoffs
agent1.handoffs = [agent25];
agent2.handoffs = [agent25];
agent3.handoffs = [agent25];
agent4.handoffs = [agent25];
agent5.handoffs = [agent25];
agent6.handoffs = [agent25];
agent7.handoffs = [agent25];

// THREAD DI CONVERSAZIONE & AGENTE ATTIVO
// fill first standard message in thread
let chatThread = [
  {
    type: "message",
    role: "assistant",
    content: [
      {
        type: "output_text",
        text: "Buongiorno e benvenut* nel servizio di assistenza online h24 della Palestra Team4, come posso aiutarti?",
      },
    ],
  },
];
let lastAgentUsed = agent25; // parte dal centralino
let previousAgent = agent25; // used to keep track of conversation
let agentWantsHandoff = false; // keeps track if an agent want to handoff
let handedoff = false; // keeps track if there have been an handoff

// ENDPOINT CHAT
app.post("/chat", async (req, res) => {
  // user message
  const { message: userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "Missing message" });
  console.log("Message from user: ", userMessage);

  try {
    // reset output for FE
    let gptQueryResultForFE = null;

    // query last agent used and add user message to history thread
    let gptQueryResult = await querygpt(userMessage);

    // add reply from query
    chatThread = gptQueryResult.history;

    // take only last reply from whole returned object
    let gptQueryResult_outputText =
      typeof gptQueryResult.finalOutput === "string"
        ? gptQueryResult.lastAgent.name + ": " + gptQueryResult.finalOutput
        : gptQueryResult.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

    // packup last reply from AI to FE
    gptQueryResultForFE = {
      agent: gptQueryResult.lastAgent?.name,
      reply: gptQueryResult_outputText.replace("scramasacs", ""), // remove keyword from reply
    };

    // check if there has already been an handoff
    handedoff = checkIfHandoff();
    if (handedoff) {
      // create some waiting music
      await queryForMusic(res);
    }

    // return last reply from AI to FE (but don't close response)
    console.log("\n\nPARSING THIS:", JSON.stringify(gptQueryResultForFE), "\n\n");
    res.write(JSON.stringify(gptQueryResultForFE));

    // check if agent wanted to handoff to another (has outputted a scramasacs)
    agentWantsHandoff = gptQueryResult_outputText.includes("scramasacs");
    if (agentWantsHandoff && !handedoff) {
      console.log(
        "\nfound a SCRAMASACS, with last query output!! Agent was: ",
        gptQueryResult.lastAgent.name,
        lastAgentUsed.name
      );

      // create some waiting music
      await queryForMusic(res);

      // query last agent used and add user message to history thread
      gptQueryResult = await querygpt(userMessage);

      // sometimes they handoff without saying bye bye so it's better to check
      handedoff = checkIfHandoff();

      // add reply from query
      chatThread = gptQueryResult.history;

      // take only last reply from whole returned object
      gptQueryResult_outputText =
        typeof gptQueryResult.finalOutput === "string"
          ? gptQueryResult.lastAgent.name + ": " + gptQueryResult.finalOutput
          : gptQueryResult.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

      // packup last reply from AI to FE
      gptQueryResultForFE = {
        agent: gptQueryResult.lastAgent?.name,
        reply: gptQueryResult_outputText.replace("scramasacs", ""), // remove keyword from reply
      };

      // return last reply from AI to FE (but don't close response)
      console.log("\n\nPARSING THIS:", JSON.stringify(gptQueryResultForFE), "\n\n");
      res.write(JSON.stringify(gptQueryResultForFE));
    }

    // something bad has happened here,
    // agent wanted to handoff but didn't do it for some reasons
    // this happens quite often
    if (agentWantsHandoff && !handedoff) {
      gptQueryResultForFE = {
        agent: "Palestra Team 4 staff",
        reply:
          "Ci dispiace per l'inconveniente, l'operatore non è stato in grado di trasferire la sua richiesta ad un altro operatore. Cercheremo di somministrare dei corsi sull'uso dei telefoni.", // remove keyword from reply
      };

      console.log("\nErrore di handoff non fatto:", JSON.stringify(gptQueryResultForFE), "\n\n");
      res.write(JSON.stringify(gptQueryResultForFE));
    }

    // chiudi quando hai finito
    setTimeout(() => {
      res.end();
    }, 10000);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`🚀 Backend pronto su http://localhost:${port}`);
});

// This function calls OpenAI API with global thread and adds eventual user messages
// uses global variables chatThread and lastAgentUsed
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
    "QUERYGPT():   agent: ",
    queryResult.lastAgent.name,
    "\nqueryResult: ",
    queryResult.finalOutput.replaceAll("\n", "")
  );

  // const handoff = queryResult.newItems.find((i) => i.type.includes("handoff"));
  // console.log("\n\n\n\n\nHANDOFF: ", util.inspect(handoff, { showHidden: true, depth: null }));

  // const target = handoff?.rawItem?.name || "";
  // console.log("\n\n\n\n\nTARGET: ", target);

  console.log(
    "\n\n\n\n\nHISTORY: ",
    util.inspect(queryResult.history, { showHidden: true, depth: null }),
    "\n\n\n\n\n\n\n"
  );

  return queryResult;
}

// query OpenAI for some ambient text music
async function queryForMusic(res) {
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

  // trim unnecessary data to reply only an object with music text
  console.log("Music output text: ", music.output_text);

  let musicForFE = {
    agent: "Musichetta d'attesa",
    reply: "[Muichetta d'attesa]: 🎶" + music.output_text + "🎶" || "",
  };

  // return music directly to FE (but don't close response)
  res.write(JSON.stringify(musicForFE));
}

// this function checks in chatThread[] if there have been an handoff between agents
function checkIfHandoff() {
  /*
chatThread[] would look something like this below when coming back from handoff:

[...,
  {some other message}, 
  {
    type: 'function_call_result',
    name: 'transfer_to_Centralinista',
    callId: 'call_KYY+++++++++++++++++++++',
    status: 'completed',
    output: { type: 'text', text: '{"assistant":"Centralinista"}' }
  },
  {
    id: 'msg_68d42+++++++++++++++++++++++++++++++++++++++++++',
    type: 'message',
    role: 'assistant',
    content: [
      {
        type: 'output_text',
        text: 'Sei tornato al centralino della palestra Team4. Dimmi pure, come posso aiutarti?',
        annotations: [ [length]: 0 ],
        logprobs: [ [length]: 0 ]
      },
      [length]: 1
    ],
    status: 'completed',
    providerData: {}
  }
]
*/

  // when there are at least 2 objects in chatThread
  if (chatThread.length > 2) {
    let lastAgentUsed_name = "";
    // check whether the second-to-last is an handoff (this means agent has changed)
    // {type: 'function_call_result',
    //  name: 'transfer_to_Centralinista', ...}
    console.log(
      "\nchatThread: ",
      chatThread,
      "\n\nchatThread[chatThread.length - 2]?.type: ",
      chatThread[chatThread.length - 2]?.type,
      "\n\nchatThread[chatThread.length - 2]?.output.text: ",
      chatThread[chatThread.length - 2]?.output?.text,
      "\n\nJSON.parse(chatThread[chatThread.length - 2]?.output?.text)?.assistant: "
    );

    let culo =
      typeof chatThread[chatThread.length - 2]?.output?.text === "string"
        ? JSON.parse(chatThread[chatThread.length - 2].output?.text).assistant
        : "rutto.mp3";
    console.log(culo);

    if (chatThread[chatThread.length - 2]?.type == "function_call_result") {
      lastAgentUsed_name = chatThread[chatThread.length - 2].name?.substring(12);

      //keep track of previous agent
      previousAgent = lastAgentUsed;

      // then set new lastAgentUsed
      switch (lastAgentUsed_name) {
        case agent1.name:
          lastAgentUsed = agent1;
          break;
        case agent2.name:
          lastAgentUsed = agent2;
          break;
        case agent3.name:
          lastAgentUsed = agent3;
          break;
        case agent4.name:
          lastAgentUsed = agent4;
          break;
        case agent5.name:
          lastAgentUsed = agent5;
          break;
        case agent6.name:
          lastAgentUsed = agent6;
          break;
        case agent7.name:
          lastAgentUsed = agent7;
          break;
        default:
          lastAgentUsed = agent25;
      }
      console.log("lastAgentUsed now is: ", lastAgentUsed.name);
      console.log("while previous was: ", previousAgent.name);

      return true;
    }
  }

  // no handoff detected
  return false;
}
