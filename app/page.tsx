"use client";

import { generateMessage } from "@/actions/openai-actions";
import { MessageMarkdown } from "@/components/messages/message-markdown";
import ModelSelect from "@/components/model-select";
import Sidebar from "@/components/sidebar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/local-storage/local-storage";
import { cn } from "@/lib/utils";
import { Chat } from "@/types/chat/chats-types";
import { Message } from "@/types/messages/messages-types";
import { Send, StopCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function Home() {
  const abortController = useRef<AbortController | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<"o1-preview" | "o1-mini">("o1-mini");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAborted, setIsAborted] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    const storedChats = getLocalStorageItem<Chat[]>("chats") || [];
    setChats(storedChats);
    if (storedChats.length > 0) {
      setCurrentChatId(storedChats[0].id);
      setMessages(storedChats[0].messages);
    }
  }, []);

  useEffect(() => {
    if (currentChatId) {
      const currentChat = chats.find((chat) => chat.id === currentChatId);
      if (currentChat) {
        const updatedChat = { ...currentChat, messages, model };
        const updatedChats = chats.map((chat) => (chat.id === currentChatId ? updatedChat : chat));
        setLocalStorageItem("chats", updatedChats);
      }
    }
  }, [messages, currentChatId, model]);

  const handleSubmit = async () => {
    if (!input.trim()) {
      alert("Please enter a message");
      return;
    }

    setIsGenerating(true);
    setIsAborted(false);
    abortController.current = new AbortController();

    const userMessage: Message = {
      id: new Date().toISOString(),
      role: "user",
      content: input,
      createdAt: new Date()
    };

    const placeholderMessage: Message = {
      id: `loading-${new Date().toISOString()}`,
      role: "assistant",
      content: "Thinking...",
      createdAt: new Date()
    };

    // Create a new chat if there isn't one
    if (!currentChatId) {
      const chatName = input.trim().slice(0, 50) + (input.length > 50 ? "..." : "");
      const newChat: Chat = {
        id: new Date().toISOString(),
        name: chatName,
        messages: [userMessage],
        createdAt: new Date(),
        model: model
      };
      setChats((prevChats) => [newChat, ...prevChats]);
      setCurrentChatId(newChat.id);
      setMessages([userMessage, placeholderMessage]);
    } else {
      setChats((prevChats) => prevChats.map((chat) => (chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage, placeholderMessage] } : chat)));
      setMessages((prev) => [...prev, userMessage, placeholderMessage]);
    }

    setInput("");

    try {
      const text = await generateMessage(model, [...messages, userMessage]);

      let updatedMessages: Message[];
      setMessages((prev) => {
        if (isAborted) {
          updatedMessages = prev.map((msg) => (msg.id === placeholderMessage.id ? { ...msg, id: new Date().toISOString(), content: "Message generation stopped." } : msg));
        } else {
          updatedMessages = prev.map((msg) => (msg.id === placeholderMessage.id ? { ...msg, id: new Date().toISOString(), content: text } : msg));
        }
        return updatedMessages;
      });

      // Save to local storage
      const updatedChats = chats.map((chat) => (chat.id === currentChatId ? { ...chat, messages: updatedMessages } : chat));
      setChats(updatedChats);
      setLocalStorageItem("chats", updatedChats);
    } catch (error) {
      console.error(error);
      setMessages((prev) => prev.map((msg) => (msg.id === placeholderMessage.id ? { ...msg, id: new Date().toISOString(), content: "Failed to generate message." } : msg)));
    } finally {
      setIsGenerating(false);
      abortController.current = null;
    }
  };

  const handleStop = () => {
    if (abortController.current) {
      abortController.current.abort();
      setIsAborted(true);
      setIsGenerating(false);
      setMessages((prev) => {
        const lastUserMessageIndex = prev.length - 2;
        return prev.filter((_, idx) => idx !== lastUserMessageIndex && idx !== prev.length - 1);
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: new Date().toISOString(),
      name: "New Chat",
      messages: [],
      createdAt: new Date(),
      model
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    setChats((prevChats) => {
      const selectedChat = prevChats.find((chat) => chat.id === chatId);
      if (selectedChat) {
        setMessages(selectedChat.messages);
        setModel(selectedChat.model);
      }
      return prevChats;
    });
  };

  const handleChatDelete = (chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    setLocalStorageItem("chats", updatedChats);

    if (chatId === currentChatId) {
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id);
        setMessages(updatedChats[0].messages);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-screen flex bg-background">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onChatDelete={handleChatDelete}
      />

      <div className="flex flex-col flex-1 gap-4">
        <div className="flex items-center justify-between w-full max-w-[1800px] p-4">
          <div className="text-xl font-bold">o1 Playground</div>

          <div className="flex items-center gap-4">
            <div className="flex justify-between items-center w-[200px]">
              <ModelSelect
                model={model}
                onSelect={(newModel) => {
                  setModel(newModel);
                  if (currentChatId) {
                    const updatedChats = chats.map((chat) => (chat.id === currentChatId ? { ...chat, model: newModel } : chat));
                    setChats(updatedChats);
                    setLocalStorageItem("chats", updatedChats);
                  }
                }}
              />
            </div>

            <ThemeSwitcher />
          </div>
        </div>

        <ScrollArea
          className="flex-1 overflow-hidden"
          ref={scrollAreaRef}
        >
          <div className="w-full max-w-[1000px] mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn("mb-4 flex", message.role === "user" ? "justify-end" : "justify-start", isGenerating && message.id.startsWith("loading-") && "animate-pulse")}
              >
                <div className={`px-4 py-2 max-w-[600px] rounded ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  <MessageMarkdown
                    role={message.role}
                    content={message.content}
                  />
                </div>
              </div>
            ))}
          </div>

          <div ref={endOfMessagesRef}></div>
        </ScrollArea>

        <div className="relative flex items-center mt-4 pb-6 w-full max-w-[800px] mx-auto">
          <ReactTextareaAutosize
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask o1 anything..."
            className="w-full resize-none rounded-md p-4 pr-12 bg-secondary/90 text-secondary-foreground focus:outline-none"
            minRows={1}
            maxRows={20}
            onKeyDown={handleKeyDown}
          />

          {isGenerating ? (
            <StopCircle
              onClick={handleStop}
              className="absolute right-[14px] top-[28px] transform -translate-y-1/2 cursor-pointer hover:opacity-80"
            />
          ) : (
            <Send
              onClick={handleSubmit}
              className="absolute right-[14px] top-[28px] transform -translate-y-1/2 cursor-pointer text-primary hover:opacity-80"
            />
          )}
        </div>
      </div>
    </div>
  );
}
