import "dotenv/config";
import { Agent, run } from "@openai/agents";
import { createInterface } from "node:readline/promises";

// console input function
async function ask(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const message = await rl.question(prompt);
  rl.close();
  return message;
}

// main program
async function main() {
  // create thread, empty for now
  let thread = [];

  // create new agent
  const agent = new Agent({
    apiKey: process.env.OPENAI_API_KEY,
    //  model: "gpt-4o-mini",
    name: "Assistente scazzato 1",
    instructions:
      "You are a very useless assistant, giving no help at all, only procrastinating and blaming someone else for your faults. you give short and pointless replies.",
    //    max_completion_tokens: 150,
  });

  console.log('Type "exit" to leave');
  while (true) {
    const message = await ask("> ");
    if (message === "exit") {
      console.log("mandi\n");
      return;
    }

    // add message to thread
    //    thread.concat({ role: "user", content: message });

    // query gpt
    const result = await run(agent, thread.concat({ role: "user", content: message }));

    // show response to user
    console.log(result.finalOutput);

    // add response to thread
    thread = result.history; // Carry over history + newly generated items
  }
}

// start main program
main().catch(console.error);
