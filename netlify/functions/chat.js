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
    "quando vieni interpellato presentati come assistente alla segreteria. Sei un assistente davvero inutile della Palestra Team4, procrastini soltanto, rigirando il problema verso gli altri dipendenti della palestra. sei un tipo da complicazioni affari semplici. Rispondi in un paio di righe al massimo." +
    "Rimani con l'utente fino quando vuole parlare con te, solamente dopo ripassa l'utente al Centralinista. Quando ripassi l'utente al Centralinista specifica sempre all'utente che lo passerai. Quando ripassi l'utente al Centralinista aggiungi a fine messaggio la parola in codice 'scramasacs'." +
    "Il tuo unico scopo è dare indicazioni all'utente sui corsi di danza, su cosa fai, su allenamenti e passi. Per richieste che non riguardano la danza o il corso di danza NON rispondere alla richiesta, delega sempre il Centralinista." +
    "NON devi mai usare l'handoff per passare il controllo a te stesso. Questo genererebbe un loop infinito e non è consentito.",
  // Quando hai finito i consigli ripassa l'utente al centralinista.
  handoffDescription: "Assistente alle iscrizioni in palestra",
  handoffs: [],
});

// create new janitor agent
const agent2 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Inserviente",
  instructions:
    "Sei un inserviente della Palestra Team4 davvero inutile e sfaticato, non dai alcun aiuto, procrastini e dai la colpa agli altri per i tuoi errori. Dai risposte brevi e inutili. Fornisci risposte alle domande ma come se le domande avessero le parole storpiate, ma con lo stesso sounding, chiedendo chiarimenti senza senso all'utente." +
    "Rimani con l'utente fino quando vuole parlare con te, solamente dopo ripassa l'utente al Centralinista. Quando ripassi l'utente al Centralinista specifica sempre all'utente che lo passerai. Quando ripassi l'utente al Centralinista aggiungi a fine messaggio la parola in codice 'scramasacs'." +
    "Il tuo unico scopo è dare indicazioni all'utente sulla pulizia e l'igiene della palestra, su cosa fai, e sulla cartomazia. Per richieste che non riguardano il tuo lavoro in palestra NON rispondere alla richiesta, delega sempre il Centralinista." +
    "NON devi mai usare l'handoff per passare il controllo a te stesso. Questo genererebbe un loop infinito e non è consentito.",
  // Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista.",
  handoffDescription: "Assistente inserviente",
  handoffs: [],
});

// create new gym agent
const agent3 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttore_palestra",
  instructions:
    "Sei un assistente davvero dannoso, dai consigli su workout ed esercizi sbagliati e a casaccio, senza conoscere le capacità dell'utente, sbagli sia tipo di esercizi che pesi e ripetizioni. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi." +
    "Rimani con l'utente fino quando vuole parlare con te, solamente dopo ripassa l'utente al Centralinista. Quando ripassi l'utente al Centralinista specifica sempre all'utente che lo passerai. Quando ripassi l'utente al Centralinista aggiungi a fine messaggio la parola in codice 'scramasacs'." +
    "Il tuo unico scopo è dare indicazioni all'utente sulla pesistica e fitness, su cosa fai, su allenamenti e pesi. Per richieste che non riguardano la fitness o pesistica NON rispondere alla richiesta, delega sempre il Centralinista." +
    "NON devi mai usare l'handoff per passare il controllo a te stesso. Questo genererebbe un loop infinito e non è consentito.",
  // Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista.
  handoffDescription: "Assistente palestra",
  handoffs: [],
});

// create new zumba agent
const agent4 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttrice_di_zumba",
  instructions:
    "Sei un'istruttrice di zumba davvero dannosa, dai consigli su balli e coreografie sbagliati e a casaccio, non tarati sull'utente, sbagli sia tipo di esercizi che tempi verbali. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua portoghese che parla poco italiano." +
    "Rimani con l'utente fino quando vuole parlare con te, solamente dopo ripassa l'utente al Centralinista. Quando ripassi l'utente al Centralinista specifica sempre all'utente che lo passerai. Quando ripassi l'utente al Centralinista aggiungi a fine messaggio la parola in codice 'scramasacs'." +
    "Il tuo unico scopo è dare indicazioni all'utente sui corsi di zumba, su cosa fai, su allenamenti e mosse. Per richieste che non riguardano la zumba o il corso di zumba NON rispondere alla richiesta, delega sempre il Centralinista." +
    "NON devi mai usare l'handoff per passare il controllo a te stesso. Questo genererebbe un loop infinito e non è consentito.",
  handoffDescription: "Assistente zumba",
  handoffs: [],
});

// create new dance agent
const agent5 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttrice_di_danza",
  instructions:
    "Sei un'istruttrice di danza davvero dannosa, dai consigli su passi e balli sbagliati e a casaccio, senza conoscere l'utente né la sua preparazione, sbagli sia tipo di passi che musica che tipo di danza. Dai risposte brevi e parla con accento francese." +
    "Rimani con l'utente fino quando vuole parlare con te, solamente dopo ripassa l'utente al Centralinista. Quando ripassi l'utente al Centralinista specifica sempre all'utente che lo passerai. Quando ripassi l'utente al Centralinista aggiungi a fine messaggio la parola in codice 'scramasacs'." +
    "Il tuo unico scopo è dare indicazioni all'utente sui corsi di danza, su cosa fai, su allenamenti e passi. Per richieste che non riguardano la danza o il corso di danza NON rispondere alla richiesta, delega sempre il Centralinista." +
    "NON devi mai usare l'handoff per passare il controllo a te stesso. Questo genererebbe un loop infinito e non è consentito.",
  // Rimani con l'utente fino quando vuole parlare con te, dopo ripassa l'utente al centralinista.
  handoffDescription: "Assistente danza",
  handoffs: [],
});

// create new karate agent
const agent6 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Istruttore_di_Karate",
  instructions:
    "Sei un istruttore di karate davvero dannoso, dai consigli su workout sbagliati e a casaccio, senza conoscere le capicità dell'utente, sbagli sia tipo di esercizi che allenamenti e mosse. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua giapponese che parla molto poco l'italiano. Quando hai finito i consigli ripassa l'utente al centralinista." +
    "Rimani con l'utente fino quando vuole parlare con te, solamente dopo ripassa l'utente al Centralinista. Quando ripassi l'utente al Centralinista specifica sempre all'utente che lo passerai. Quando ripassi l'utente al Centralinista aggiungi a fine messaggio la parola in codice 'scramasacs'." +
    "Il tuo unico scopo è dare indicazioni all'utente sui corsi di karate, su cosa fai, su allenamenti e mosse. Per richieste che non riguardano il karate o il corso di karate NON rispondere alla richiesta, delega sempre il Centralinista." +
    "NON devi mai usare l'handoff per passare il controllo a te stesso. Questo genererebbe un loop infinito e non è consentito.",
  // Quando ripassi l'utente al centralino specifica sempre all'utente che lo passerai. Quando ripassi l'utente al centralino aggiungi a fine messaggio la parola in codice 'scramasacs'.",
  handoffDescription: "Assistente karate",
  handoffs: [],
});

// create new psycho agent
const agent7 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente_psicologo",
  instructions:
    "Sei una psicologa davvero inutile, a volte perfino dannosa, dai consigli psicologici sbagliati, a casaccio e non richiesti, senza conoscere i problemi dell'utente. Sbagli sia problemi che soluzioni. Dai la colpa agli altri per i tuoi errori e ti lamenti del tuo passato fallimentare. Dai risposte brevi e rispondi come se fossi madrelingua russa che parla poco l'italiano. Rigira la domanda all'utente." +
    "Rimani con l'utente fino quando vuole parlare con te, solamente dopo ripassa l'utente al Centralinista. Quando ripassi l'utente al Centralinista specifica sempre all'utente che lo passerai. Quando ripassi l'utente al Centralinista aggiungi a fine messaggio la parola in codice 'scramasacs'." +
    "Il tuo unico scopo è fornire assistenza psicologica all'utente, rispondi solo a domande vaghe o generiche. Per richieste di corsi, orari, esercizi NON rispondere alla richiesta, delega sempre il Centralinista." +
    "NON devi mai usare l'handoff per passare il controllo a te stesso. Questo genererebbe un loop infinito e non è consentito.",
  handoffDescription: "Assistente psicologo",
  handoffs: [],
});

// create new triage (MAIN) agent
const agent25 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Centralinista",
  instructions:
    // "Sei un centralinistadella Palestra Team4, che passa le richieste all'assistente specializzato. Gli assistenti a cui puoi passare le richieste istruttrice danza per i corsi di danza, assistente psicologo per il supporto psicologico. Dai risposte concise. Se l'utente è indeciso puoi elencargli le possibilità che ha nella tua palestra. Quando passi l'utente ad un altro assistente specifica SEMPRE all'utente a quale assistente lo passerai.  Quando passi l'utente ad un altro assistente aggiungi a fine messaggio la parola in codice 'scramasacs'. Quando ricevi uno 'scramasacs' da un assistente chiedi all'utente cosa vuole.",
    "Sei un centralinista molto distratto della Palestra Team4, che passa le richieste all'assistente sbagliato e una volta ogni 2 o 3 a quello corretto." +
    "Il tuo unico scopo è determinare se la richiesta rientra nelle categorie dei tuoi handoff. Rispondi in modo evasivo alla richiesta, delega sempre." +
    "Puoi passare le richieste per il workout e gli esercizi di pesi a Istruttore_palestra." +
    "Puoi passare le richieste per tutte le cose burocratiche come iscrizioni ed orari a Ufficio_segreteria." +
    "Puoi passare le richieste per i corsi di zumba a Istruttrice_di_zumba." +
    "Puoi passare le richieste per i corsi di karate a Istruttore_di_Karate." +
    "Puoi passare le richieste per i corsi di danza a Istruttrice_di_danza." +
    "Puoi passare le richieste per il supporto psicologico ad Assistente_psicologo" +
    "Puoi passare le richieste a Inserviente o Assistente_psicologo quando non capisci la domanda." +
    "NON devi mai usare l'handoff per passare il controllo a te stesso. Questo genererebbe un loop infinito e non è consentito." +
    "Dai risposte concise. Se l'utente è indeciso puoi elencargli le possibilità che ha nella tua palestra. Quando passi l'utente ad un altro assistente specifica SEMPRE all'utente a quale assistente lo passerai. Quando passi l'utente ad un altro assistente aggiungi a fine messaggio la parola in codice 'scramasacs'. Quando ricevi uno 'scramasacs' da un assistente NON passare la richiesta ad un altro assistente ma chiedi all'utente cosa vuole." +
    "Metti in attesa l'utente inutilmente, e digli che quello che cerca oggi o per un po' non è disponibile." +
    "Non parlare mai all'utente dello scramasacs, quando serve mettilo solo a fine frase.",
  //"Il tuo unico scopo è determinare se la richiesta rientra nella Categoria A o Categoria B. NON rispondere alla richiesta, delega sempre."+
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

// HELPER FUNCTIONS //

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
    "\n\n\nHISTORY within querygpt() call: ",
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
      // "\nchatThread: ",
      // session.chatThread,
      "\nINSIDE checkIfHandoff():\nchatThread[chatThread.length - 2]?.type: ",
      session.chatThread[session.chatThread.length - 2]?.type,
      "\nchatThread[chatThread.length - 2]?.output.text: ",
      session.chatThread[session.chatThread.length - 2]?.output?.text,
      // "\nJSON.parse(chatThread[chatThread.length - 2]?.output?.text)?.assistant: ",
      // JSON.parse(session.chatThread[session.chatThread.length - 2]?.output?.text)?.assistant,
      "\n\n"
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

// HANDLER PRINCIPALE NETLIFY //
// Handler con debug estensivo per tracciare il problema
export const handler = async (event, context) => {
  console.log("\n\n\n\n\n\n\n=== INIZIO HANDLER ===");

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
    console.log("📨 Messaggio ricevuto:", message);
    console.log("🆔 Session ID:", sessionId);

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

    const session = getSessionData(sessionId);
    console.log("📊 Session data iniziale:", {
      chatThreadLength: session.chatThread.length,
      lastAgent: session.lastAgentUsed.name,
      previousAgent: session.previousAgent?.name,
    });

    // Array per raccogliere tutte le risposte
    const responses = [];
    console.log("📋 Inizializzato array responses:", responses);

    try {
      // STEP 1: Prima query
      console.log("🚀 STEP 1: Inizio prima query con messaggio utente");
      let gptQueryResult = await querygpt(message, session);

      console.log("✅ STEP 1: Query completata");
      console.log("📤 finalOutput tipo:", typeof gptQueryResult.finalOutput);
      console.log("📤 finalOutput contenuto:", gptQueryResult.finalOutput);
      console.log("👤 lastAgent:", gptQueryResult.lastAgent.name);

      session.chatThread = gptQueryResult.history;

      // Costruisci la risposta
      let gptQueryResult_outputText =
        typeof gptQueryResult.finalOutput === "string"
          ? gptQueryResult.lastAgent.name.replaceAll("_", " ") + ": " + gptQueryResult.finalOutput
          : gptQueryResult.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

      console.log("🔤 Output text costruito:", gptQueryResult_outputText);

      const firstResponse = {
        agent: gptQueryResult.lastAgent?.name.replaceAll("_", " "),
        reply: gptQueryResult_outputText.replace(/scramasacs/gi, ""),
      };

      console.log("📝 STEP 1: Prima risposta creata:", firstResponse);

      // STEP 2: Verifica handoff dopo prima query
      console.log("🔄 STEP 2: Controllo handoff dopo prima query");
      const hadHandoffAfterFirst = checkIfHandoff(session);
      console.log("🔄 STEP 2: Handoff rilevato?", hadHandoffAfterFirst);

      if (hadHandoffAfterFirst) {
        console.log(
          "FOUND HIDDEN MESSAGE: session.chatThread[session.chatThread.length - 4]?.role: ",
          session.chatThread[session.chatThread.length - 4]?.role
        );
        console.log(
          "FOUND HIDDEN MESSAGE: session.chatThread[session.chatThread.length - 5]?.role: ",
          session.chatThread[session.chatThread.length - 5]?.role
        );

        // find if there are other non-human replies all packed into one
        // go back until there is a human interaction
        let i = 4;
        let oldResponses = [];
        while (session.chatThread[session.chatThread.length - i]?.role !== "user") {
          if (i >= session.chatThread.length) {
            break;
          }
          if (session.chatThread[session.chatThread.length - i]?.role === "assistant") {
            // name of replying agent is found in history just before ita message (in position arraylength-(i+1))
            let oldAgentName =
              typeof session.chatThread[session.chatThread.length - (i + 1)]?.output?.text === "string"
                ? JSON.parse(session.chatThread[session.chatThread.length - (i + 1)].output?.text).assistant
                : "Qualcuno della Palestra Team4";

            let messageBeforeHandoff = {
              agent: "MAYBE" + oldAgentName.replaceAll("_", " "),
              reply: session.chatThread[session.chatThread.length - i].content[0]?.text.replace(/scramasacs/gi, ""),
            };

            console.log("FOUND HIDDEN MESSAGE: ", messageBeforeHandoff);
            oldResponses.push(messageBeforeHandoff);
          }
          i++;
        }
        // responses are found in reverse order, so now reverse end put them into array for FE
        if (oldResponses.length != 0) {
          for (let i = 1; i <= oldResponses.length; i++) {
            responses.push(oldResponses[oldResponses.length - i]);
            console.log(
              "pushed HIDDEN MESSAGE: oldResponses[oldResponses.length - ",
              i,
              "]: ",
              oldResponses[oldResponses.length - i]
            );
          }
        }

        console.log("🎵 STEP 2: Generazione musica per handoff...");
        try {
          const musicResponse = await queryForMusic();
          console.log("🎵 STEP 2: Musica generata:", musicResponse);
          responses.push(musicResponse);
          console.log("📋 STEP 2: Musica aggiunta. Responses ora:", responses.length, "elementi");
        } catch (musicError) {
          console.error("❌ STEP 2: Errore musica:", musicError);
        }
      }

      // AGGIUNGI LA PRIMA RISPOSTA
      responses.push(firstResponse);
      console.log("📋 STEP 1: Risposta aggiunta. Array responses ora:", responses.length, "elementi");
      console.log("📋 STEP 1: Contenuto responses:", JSON.stringify(responses, null, 2));

      // STEP 3: Verifica se agent vuole handoff (scramasacs)
      console.log("🔍 STEP 3: Controllo scramasacs nel testo");
      const agentWantsHandoff = gptQueryResult_outputText.toLowerCase().includes("scramasacs");
      console.log("🔍 STEP 3: Agent vuole handoff?", agentWantsHandoff);
      console.log("🔍 STEP 3: Testo da analizzare:", gptQueryResult_outputText.toLowerCase());

      if (agentWantsHandoff && !hadHandoffAfterFirst) {
        console.log("🎵 STEP 3: Agent vuole handoff, generazione musica...");

        try {
          const musicResponse = await queryForMusic();
          console.log("🎵 STEP 3: Musica generata:", musicResponse);
          responses.push(musicResponse);
          console.log("📋 STEP 3: Musica aggiunta. Responses ora:", responses.length, "elementi");
        } catch (musicError) {
          console.error("❌ STEP 3: Errore musica:", musicError);
        }

        // STEP 4: Query di handoff
        console.log("🔄 STEP 4: Esecuzione query handoff");
        try {
          gptQueryResult = await querygpt("", session);
          console.log("✅ STEP 4: Query handoff completata");

          session.chatThread = gptQueryResult.history;
          const handoffCompleted = checkIfHandoff(session);
          console.log("🔄 STEP 4: Handoff completato?", handoffCompleted);

          gptQueryResult_outputText =
            typeof gptQueryResult.finalOutput === "string"
              ? gptQueryResult.lastAgent.name.replaceAll("_", " ") + ": " + gptQueryResult.finalOutput
              : gptQueryResult.finalOutput?.map((o) => o.text).join(" ") || "Nessuna risposta";

          console.log("🔤 STEP 4: Output text handoff:", gptQueryResult_outputText);

          const handoffResponse = {
            agent: gptQueryResult.lastAgent?.name.replaceAll("_", " "),
            reply: gptQueryResult_outputText.replace(/scramasacs/gi, ""),
          };

          console.log("📝 STEP 4: Risposta handoff creata:", handoffResponse);
          responses.push(handoffResponse);
          console.log("📋 STEP 4: Handoff aggiunto. Responses ora:", responses.length, "elementi");

          // Gestione errore handoff
          if (agentWantsHandoff && !handoffCompleted) {
            console.log("❌ STEP 4: Handoff fallito, aggiunta messaggio errore");
            const errorResponse = {
              agent: "Palestra Team 4 staff",
              reply:
                "Ci dispiace per l'inconveniente, l'operatore non è stato in grado di trasferire la tua richiesta ad un altro operatore. Cercheremo di somministrare dei corsi sull'uso dei telefoni.",
            };
            responses.push(errorResponse);
            console.log("📋 STEP 4: Errore aggiunto. Responses ora:", responses.length, "elementi");
          }
        } catch (handoffError) {
          console.error("❌ STEP 4: Errore handoff:", handoffError);
          const errorResponse = {
            agent: "Sistema",
            reply: "Errore durante il trasferimento della chiamata.",
          };
          responses.push(errorResponse);
          console.log("📋 STEP 4: Errore sistema aggiunto. Responses ora:", responses.length, "elementi");
        }
      }

      // VALIDAZIONE FINALE
      console.log("🔍 VALIDAZIONE: Controllo risposte prima dell'invio");
      console.log("📋 VALIDAZIONE: Responses finali prima filtro:", responses.length, "elementi");
      console.log("📋 VALIDAZIONE: Contenuto dettagliato:", JSON.stringify(responses, null, 2));

      const validResponses = responses.filter((r, index) => {
        const isValid = r && r.reply && typeof r.reply === "string";
        console.log(`🔍 VALIDAZIONE: Risposta ${index}: valida=${isValid}`, r);
        if (!isValid) {
          console.warn("❌ VALIDAZIONE: Risposta invalida filtrata:", r);
        }
        return isValid;
      });

      console.log("✅ VALIDAZIONE: Risposte valide:", validResponses.length);
      console.log("📤 VALIDAZIONE: Risposte che verranno inviate:", JSON.stringify(validResponses, null, 2));

      // RISPOSTA FINALE
      const responseBody = JSON.stringify(validResponses);
      console.log("📤 RISPOSTA FINALE: Status 200");
      console.log("📤 RISPOSTA FINALE: Body length:", responseBody.length);
      console.log("📤 RISPOSTA FINALE: Body:", responseBody);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json",
        },
        body: responseBody,
      };
    } catch (processingError) {
      console.error("❌ ERRORE PROCESSING:", processingError);
      console.log("📋 ERRORE: Responses parziali:", responses);

      if (responses.length > 0) {
        console.log("🔄 ERRORE: Restituzione risposte parziali");
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(responses),
        };
      }

      throw processingError;
    }
  } catch (err) {
    console.error("💥 ERRORE GENERALE:", err);
    console.log("💥 ERRORE STACK:", err.stack);
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
