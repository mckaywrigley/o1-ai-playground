"use server";

import { Message } from "@/types/messages/messages-types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const openai = createOpenAI({
  baseURL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMessage(
  model: "o1-preview" | "o1-mini",
  messages: Message[]
) {
  const { text } = await generateText({
    model: openai(model),
    messages,
  });

  return text;
}
