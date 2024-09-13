import { Message } from "@/types/messages/messages-types";

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  model: "o1-preview" | "o1-mini";
}
