import "dotenv/config";
// import util from "util";
import { createInterface } from "node:readline/promises";
import { Agent, run /*tool, HandoffInputData, handoff, withTrace, isGpt5Default*/ } from "@openai/agents";
import OpenAI from "openai";
const client = new OpenAI();

// console input function
async function ask(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const message = await rl.question(prompt);
  rl.close();
  return message;
}

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
    "Sei un assistente davvero inutile, non dai alcun aiuto, procrastini e dai la colpa agli altri per i tuoi errori. Dai risposte brevi e inutili. Fornisci risposte alle domande ma come se le domande avessero le parole storpiate.",
  handoffDescription: "Assistente inserviente",
});

// create new gym agent
const agent3 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente gym",
  instructions:
    "Sei un assistente davvero dannoso, dai consigli su workout ed esercizi sbagliati e a casaccio, senza conoscere l'utente, sbagli sia tipo di esercizi che pesi e ripetizioni. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi.",
  handoffDescription: "Assistente gym",
});

// create new zumba agent
const agent4 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente zumba",
  instructions:
    "Sei un assistente davvero dannoso, dai consigli su workout sbagliati e acasaccio, senza conoscere l'utente, sbagli sia tipo di esercizi che tempi verbali. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua portoghese che non parla bene l'italiano.",
  handoffDescription: "Assistente zumba",
});

// create new dance agent
const agent5 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente danza",
  instructions:
    "Sei un assistente davvero dannoso, dai consigli su workout sbagliati e acasaccio, senza conoscere l'utente, sbagli sia tipo di esercizi che pesi e ripetizioni. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi.",
  handoffDescription: "Assistente danza",
});

// create new karate agent
const agent6 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente karate",
  instructions:
    "Sei un assistente davvero dannoso, dai consigli su workout sbagliati e acasaccio, senza conoscere l'utente, sbagli sia tipo di esercizi che pesi e ripetizioni. Dai la colpa agli altri per i tuoi errori. Dai risposte brevi e rispondi come se fossi madrelingua giapponese che non parla bene l'italiano.",
  handoffDescription: "Assistente karate",
});

// create new triage (MAIN) agent
const agent25 = new Agent({
  apiKey: process.env.OPENAI_API_KEY,
  name: "Assistente centralino",
  instructions:
    "Sei un centralinista distratto della Palestra Team4, che non sempre passa le richieste all'assistente giusto. I reparti a cui puoi passare le richieste sono Assistente gym per il workout e gli esercizi di pesi, Assistente segreteria per tutte le cose burocratiche come iscrizioni ed orari, assistente zumba per i corsi di zumba, assistente karate per i corsi di karate, assistente danza per i corsi di danza. Dai risposte concise. Quando passi l'utente ad un altro assistente specifica sempre all'utente che lo passerai ad un altro assistente.",
  handoffs: [agent1, agent2, agent3, agent4, agent5, agent6],
});

//  create thread, empty for now
let thread = [];

// main program
async function main() {
  // fill first standard message in thread
  thread = [
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

  console.log('Type "exit" to leave');
  //  console.log("agent25: \n", util.inspect(agent25, { showHidden: true, depth: null }), "\n\n");

  console.log(thread[0].content[0].text);
  // console.log("\nthread: ", JSON.stringify(thread, null, 2));

  while (true) {
    // interroga l'utente
    const message = await ask("> ");
    if (message === "exit") {
      console.log("E'  stato un piacere servirla, speriamo di rivederla presto! ");
      return;
    }

    // query gpt
    let result = await querygpt(message);
    let result2;
    let response;

    // if user has been sent to another agent then play music and query other agent directly without prompting user again
    if (result.lastAgent.name != "Assistente centralino") {
      // query gpt with openai direct method, no agents used here for more determinism
      response = await client.responses.create({
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
      // then qyery other assistant
      result2 = await querygpt("");
    }
    //TODO: figure out why replies are inverted
    if (result.lastAgent.name != "Assistente centralino") {
      // show reply from correct assistant
      console.log("\n", result2.lastAgent.name, ": ");
      console.log(result2.finalOutput);

      // show music response to user
      console.log("\n[muichetta d'attesa]: 🎶", response.output_text, "🎶");
    }

    // invert replies
    console.log("\n", result.lastAgent.name, ": ");
    console.log(result.finalOutput);
  }
}

// start main program
main().catch(console.error);

async function querygpt(usermessage) {
  // function scope result declaration
  let result;

  // add message to thread
  // thread = thread.concat({ role: "user", content: message });
  // console.log("\n\nthread: ", JSON.stringify(thread, null, 2));
  // const result = await run(agent25, { messages: thread });

  if (usermessage === "") {
    // agent handoff
    result = await run(agent25, thread);
  } else {
    // reply to user
    result = await run(agent25, thread.concat({ role: "user", content: usermessage }));
  }

  // console.log("\nreply from agent ", result.lastAgent.name, ": ");
  // console.log("agent25: \n", util.inspect(agent25, { showHidden: true, depth: null }), "\n\n");

  // show response to user
  // console.log(result.finalOutput);

  // add response to thread
  thread = result.history; // Carry over history + newly generated items

  return result;
}
