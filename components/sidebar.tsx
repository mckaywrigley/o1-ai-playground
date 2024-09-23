import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { Chat } from "@/types/chat/chats-types";
import { Check, Copy, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

// Define the props interface for the Sidebar component
interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
  onChatDelete: (chatId: string) => void;
}

// Sidebar component for displaying and managing chat list
export default function Sidebar({ chats, currentChatId, onNewChat, onChatSelect, onChatDelete }: SidebarProps) {
  // State to track which chat is being hovered over
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [copiedChatId, setCopiedChatId] = useState<string | null>(null);

  const handleCopy = (chatId: string, chatName: string) => {
    copyToClipboard(chatName);
    setCopiedChatId(chatId);
    setTimeout(() => setCopiedChatId(null), 2000);
  };

  return (
    <div className="w-64 h-full bg-secondary/50 p-4 flex flex-col">
      {/* Button to create a new chat */}
      <Button
        onClick={onNewChat}
        className="flex items-center justify-center w-full py-2 mb-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        <PlusCircle
          className="mr-2"
          size={18}
        />
        New Chat
      </Button>

      {/* Scrollable list of existing chats */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-2 mb-2 rounded-md cursor-pointer flex items-center justify-between ${chat.id === currentChatId ? "bg-primary/20" : "hover:bg-primary/10"}`}
            onClick={() => onChatSelect(chat.id)}
            onMouseEnter={() => setHoveredChatId(chat.id)}
            onMouseLeave={() => setHoveredChatId(null)}
          >
            <div
              className="truncate flex-grow"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(chat.id, chat.name);
              }}
            >
              {chat.name}
            </div>
            {hoveredChatId === chat.id && (
              <div className="flex items-center">
                {copiedChatId === chat.id ? (
                  <Check
                    size={18}
                    className="text-green-500 mr-2"
                  />
                ) : (
                  <Copy
                    size={18}
                    className="hover:text-primary mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(chat.id, chat.name);
                    }}
                  />
                )}
                <Trash2
                  size={18}
                  className="hover:text-destructive/80 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChatDelete(chat.id);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
