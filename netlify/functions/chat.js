// netlify/functions/chat.js
import util from "util";
import dotenv from "dotenv";

// Carica le variabili da key.env (o .env)
dotenv.config();

// OpenAI agents
import { Agent, run } from "@openai/agents";

// OpenAI direct call
import OpenAI from "openai";

// create new instance
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    "Sei una psicologa davvero inutile, a volte perfino dannosa, dai consigli psicologici sbagliati, a casaccio e non richiesti, senza conoscere i problemi dell'utente. Sbagli sia problemi che soluzioni. Dai la colpa agli altri per i tuoi errori e ti lamenti del tuo passato fallimentare. Dai risposte brevi e rispondi come se fossi madrelingua russa che parla poco l'italiano. Rigira la domanda all'utente. Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista. Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
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

// NOTA: In produzione dovresti usare un database o Redis per persistenza
// Mappa per tracciare le conversazioni per sessione
const sessionData = new Map();

// Funzione per gestire la sessione (semplificata per Netlify)
function getSessionData(sessionId) {
  if (!sessionData.has(sessionId)) {
    sessionData.set(sessionId, {
      chatThread: [
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
      ],
      lastAgentUsed: agent25,
      previousAgent: agent25,
      agentWantsHandoff: false,
      handedoff: false,
    });
  }
  return sessionData.get(sessionId);
}

// Helper functions

// This function calls OpenAI API with global thread and adds eventual user messages
async function querygpt(queryUserMessage, session) {
  // function scope result declaration
  let queryResult = null;

  // add message to thread
  if (queryUserMessage === "") {
    // agent handoff or handoff return
    queryResult = await run(session.lastAgentUsed, session.chatThread);
  } else {
    // reply to user message
    queryResult = await run(
      session.lastAgentUsed,
      session.chatThread.concat({ role: "user", content: queryUserMessage })
    );
  }

  // add reply from query (that contains whole chat history, every time since API are stateless) to global replies array
  session.chatThread = queryResult.history;
  console.log(
    "QUERYGPT():   agent: ",
    queryResult.lastAgent.name,
    "\nqueryResult: ",
    queryResult.finalOutput.replaceAll("\n", "")
  );

  console.debug(
    "\n\n\n\n\nHISTORY: ",
    util.inspect(queryResult.history, {
      showHidden: true,
      depth: null,
      colors: true,
    }),
    "\n\n\n\n\n\n\n"
  );

  return queryResult;
}

// query OpenAI for some ambient text music
async function queryForMusic() {
  try {
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

    return {
      agent: "Musichetta d'attesa",
      reply: "[Muichetta d'attesa]: 🎶" + music.output_text + "🎶" || "",
    };
  } catch (error) {
    console.error("Error generating music:", error);
    return {
      agent: "Musichetta d'attesa",
      reply: "[Muichetta d'attesa]: 🎶 ta-da-da-da-dum CRACK! 🎶",
    };
  }
}

// this function checks in chatThread[] if there have been an handoff between agents
function checkIfHandoff(session) {
  // when there are at least 2 objects in chatThread
  if (session.chatThread.length > 2) {
    let lastAgentUsed_name = "";
    // check whether the second-to-last is an handoff (this means agent has changed)
    console.debug(
      "\nchatThread: ",
      session.chatThread,
      "\n\nchatThread[chatThread.length - 2]?.type: ",
      session.chatThread[session.chatThread.length - 2]?.type,
      "\n\nchatThread[chatThread.length - 2]?.output.text: ",
      session.chatThread[session.chatThread.length - 2]?.output?.text,
      "\n\nJSON.parse(chatThread[chatThread.length - 2]?.output?.text)?.assistant: "
    );

    let handedOffTo =
      typeof session.chatThread[session.chatThread.length - 2]?.output?.text === "string"
        ? JSON.parse(session.chatThread[session.chatThread.length - 2].output?.text).assistant
        : "rutto.mp3 tribute =)";
    console.log("Handed off to: ", handedOffTo);

    if (session.chatThread[session.chatThread.length - 2]?.type == "function_call_result") {
      lastAgentUsed_name = session.chatThread[session.chatThread.length - 2].name?.substring(12);

      //keep track of previous agent
      session.previousAgent = session.lastAgentUsed;

      // then set new lastAgentUsed
      switch (lastAgentUsed_name) {
        case agent1.name:
          session.lastAgentUsed = agent1;
          break;
        case agent2.name:
          session.lastAgentUsed = agent2;
          break;
        case agent3.name:
          session.lastAgentUsed = agent3;
          break;
        case agent4.name:
          session.lastAgentUsed = agent4;
          break;
        case agent5.name:
          session.lastAgentUsed = agent5;
          break;
        case agent6.name:
          session.lastAgentUsed = agent6;
          break;
        case agent7.name:
          session.lastAgentUsed = agent7;
          break;
        default:
          session.lastAgentUsed = agent25;
      }
      console.debug("lastAgentUsed now is: ", session.lastAgentUsed.name);
      console.debug("while previous was: ", session.previousAgent.name);

      return true;
    }
  }

  // no handoff detected
  return false;
}

// HANDLER PRINCIPALE NETLIFY
export const handler = async (event, context) => {
  // Gestisce richieste CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  // Gestisce solo richieste POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message, sessionId = "default" } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Missing message" }),
      };
    }

    console.log("Message from user: ", message);

    // Ottieni i dati della sessione
    const session = getSessionData(sessionId);

    // reset output for FE
    let gptQueryResultForFE = null;
    const responses = [];

    // query last agent used and add user message to history thread
    let gptQueryResult = await querygpt(message, session);

    // add reply from query
    session.chatThread = gptQueryResult.history;

    // take only last reply from whole returned object
    let gptQueryResult_outputText =
      typeof gptQueryResult.finalOutput === "string"
        ? gptQueryResult.lastAgent.name.replaceAll("_", " ") + ": " + gptQueryResult.finalOutput
        : gptQueryResult.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

    // packup last reply from AI to FE
    gptQueryResultForFE = {
      agent: gptQueryResult.lastAgent?.name.replaceAll("_", " "),
      reply: gptQueryResult_outputText.replace(/scramasacs/gi, ""), // remove keyword from reply
    };

    // check if there has already been an handoff
    session.handedoff = checkIfHandoff(session);
    if (session.handedoff) {
      // create some waiting music
      const musicResponse = await queryForMusic();
      responses.push(musicResponse);
    }

    console.log(
      "\n\nPARSING THIS:",
      util.inspect(gptQueryResultForFE, {
        showHidden: true,
        depth: null,
        colors: true,
      }),
      "\n\n"
    );
    responses.push(gptQueryResultForFE);

    // check if agent wanted to handoff to another (has outputted a scramasacs)
    session.agentWantsHandoff = gptQueryResult_outputText.toLowerCase().includes("scramasacs");
    if (session.agentWantsHandoff && !session.handedoff) {
      console.log(
        "\nfound a SCRAMASACS, with last query output!! Agent was: ",
        gptQueryResult.lastAgent.name,
        session.lastAgentUsed.name
      );

      // create some waiting music
      const musicResponse = await queryForMusic();
      responses.push(musicResponse);

      // query last agent used but don't add user messages to history thread
      gptQueryResult = await querygpt("", session);

      // sometimes they handoff without saying bye bye so it's better to check
      session.handedoff = checkIfHandoff(session);

      // add reply from query
      session.chatThread = gptQueryResult.history;

      // take only last reply from whole returned object
      gptQueryResult_outputText =
        typeof gptQueryResult.finalOutput === "string"
          ? gptQueryResult.lastAgent.name.replaceAll("_", " ") + ": " + gptQueryResult.finalOutput
          : gptQueryResult.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

      // packup last reply from AI to FE
      gptQueryResultForFE = {
        agent: gptQueryResult.lastAgent?.name.replaceAll("_", " "),
        reply: gptQueryResult_outputText.replace(/scramasacs/gi, ""), // remove keyword from reply
      };

      console.log(
        "\n\nPARSING THIS:",
        util.inspect(gptQueryResultForFE, {
          showHidden: true,
          depth: null,
          colors: true,
        }),
        "\n\n"
      );
      responses.push(gptQueryResultForFE);
    }

    // something bad has happened here,
    // agent wanted to handoff but didn't do it for some reasons
    // this happens quite often
    if (session.agentWantsHandoff && !session.handedoff) {
      const errorResponse = {
        agent: "Palestra Team 4 staff",
        reply:
          "Ci dispiace per l'inconveniente, l'operatore non è stato in grado di trasferire la tua richiesta ad un altro operatore. Cercheremo di somministrare dei corsi sull'uso dei telefoni.",
      };

      console.log(
        "\nErrore di handoff non fatto:",
        util.inspect(errorResponse, {
          showHidden: true,
          depth: null,
          colors: true,
        }),
        "\n\n"
      );
      responses.push(errorResponse);
    }

    // Restituisci responses
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responses),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Server error",
        details: err.message,
      }),
    };
  }
};
