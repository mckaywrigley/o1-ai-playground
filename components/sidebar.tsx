import { Chat } from "@/types/chat/chats-types";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
  onChatDelete: (chatId: string) => void;
}

export default function Sidebar({ chats, currentChatId, onNewChat, onChatSelect, onChatDelete }: SidebarProps) {
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  return (
    <div className="w-64 h-full bg-secondary/50 p-4 flex flex-col">
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

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-2 mb-2 rounded-md cursor-pointer flex items-center justify-between ${chat.id === currentChatId ? "bg-primary/20" : "hover:bg-primary/10"}`}
            onClick={() => onChatSelect(chat.id)}
            onMouseEnter={() => setHoveredChatId(chat.id)}
            onMouseLeave={() => setHoveredChatId(null)}
          >
            <div className="truncate">{chat.name}</div>
            {hoveredChatId === chat.id && (
              <Trash2
                size={18}
                className="hover:text-destructive/80 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onChatDelete(chat.id);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
