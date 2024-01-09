import { writeFileSync, appendFileSync, readFileSync, existsSync } from "fs";

const systemMessage = {
  role: "system",
  content: "You are a helpful assistant.",
};

export const writeContext = (conversationId: string, context: string) => {
  const filename = getFilename(conversationId);
  writeFileSync(filename, context);
};

export function createNewConversation(filename: string) {
  writeFileSync(filename, JSON.stringify([systemMessage]));
}

export function readContext(conversationId: string) {
  const filename = getFilename(conversationId);

  const context = readFileSync(filename, "utf8");
  return context;
}

export function doesFileExist(conversationId: string) {
  const filename = getFilename(conversationId);
  return existsSync(filename);
}

export function getFilename(conversationId: string) {
  if (conversationId.includes("./history")) return conversationId;

  return `./history/${conversationId}.txt`;
}
