"use server";

import { Message } from "@/types/messages/messages-types";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function generateMessage(model: "o1-preview" | "o1-mini", messages: Message[]) {
  const { text } = await generateText({
    model: openai(model),
    messages
  });

  return text;
}
