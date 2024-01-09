import OpenAI from "openai";

const TOKEN = process.env.OPEN_API_CHA_KEY;

if (typeof TOKEN !== "string")
  throw new Error(
    "OPEN_API_CHA_KEY not found. Make sure it is available in your env"
  );
const openai = new OpenAI({
  apiKey: TOKEN,
});

export const getCompletion = async (
  prompt: string,
  previousMessages: any[]
) => {
  const messages = [
    ...previousMessages,
    {
      role: "user",
      content: prompt,
    },
  ];
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    // @ts-ignore
    messages,
    temperature: 0.8,
    max_tokens: 256,
    top_p: 1,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }

  return;
};
