import { getCompletion } from "./chatgpt";
import {
  createNewConversation,
  doesFileExist,
  getFilename,
  readContext,
  writeContext,
} from "./context";

const TOKEN = process.env.OPEN_API_CHA_KEY;

if (typeof TOKEN !== "string")
  throw new Error(
    "OPEN_API_CHA_KEY not found. Make sure it is available in your env"
  );
async function main() {
  const args = Bun.argv;
  const userPrompt = args[2];
  const conversationId = "default"; // only one conversation at a time for now

  if (userPrompt === "--help") {
    const helpMessage = `
    Usage: cha [prompt] [conversationId]
    `;
    console.log(helpMessage);
    return;
  }

  let previousMessages = [];

  if (userPrompt === "--new") {
    // Reset the context for a new conversation
    createNewConversation(getFilename(conversationId));

    console.log("New conversation started. Please enter your first message.");

    return;
  }

  if (doesFileExist(getFilename(conversationId))) {
    const context = readContext(conversationId);
    previousMessages = JSON.parse(context);
  } else {
    // If it's a new conversation or the conversation file doesn't exist
    createNewConversation(getFilename(conversationId)); // Clear the context for a new conversation
    // Add the system message to the start of a new conversation
    previousMessages = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
    ];
  }

  await getCompletion(userPrompt, previousMessages);

  // Append the latest user message to the context
  previousMessages.push({ role: "user", content: userPrompt });
  writeContext(conversationId, JSON.stringify(previousMessages));

  return;
}

main();
