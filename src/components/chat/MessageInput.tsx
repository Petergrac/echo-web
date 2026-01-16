import { useState, useRef, useEffect, SetStateAction, Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { Link, Paperclip, Send, X } from "lucide-react";
import { useChat } from "@/lib/hooks/useChat";
import { ChatMessage } from "@/types/chat";
import AutoResizeTextarea from "../post/create-post/AutoResizeTextArea";

interface MessageInputProps {
  conversationId: string;
  editMessage: string | null;
  onSend: (content: string, file?: File) => void;
  replyTo: ChatMessage | null;
  setEditMessage: Dispatch<
    SetStateAction<{
      content: string;
      messageId: string;
    } | null>
  >;
  onCancelReply?: () => void;
}

export function MessageInput({
  onSend,
  replyTo,
  editMessage,
  onCancelReply,
}: MessageInputProps) {
  const { startTyping, stopTyping } = useChat();
  const [message, setMessage] = useState(editMessage || "");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    startTyping();

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const handleChange = (value: string) => {
    setMessage(value);
    if (value.trim()) {
      handleTyping();
    }
  };

  const handleSend = () => {
    if (message.trim() || file) {
      onSend(message, file || undefined);
      setMessage("");
      setFile(null);
      stopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t p-4 space-y-3">
      {replyTo && (
        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
          <div className="flex-1">
            <p className="text-xs font-medium">
              Replying to {replyTo.sender.username}
            </p>
            <p className="text-xs truncate">{replyTo.content}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {file && (
        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
          <Paperclip className="h-4 w-4" />
          <span className="text-sm truncate flex-1">{file.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {editMessage && (
        <p className="mx-auto gap-2 px-4 flex items-center text-xs  py-2 bg-amber-600 font-bold text-black rounded-full w-fit">
          <span>
            <Link size={15} />
          </span>
          You cannot edit messages which are older than{" "}
          <span className="text-sky-900">15</span>min.
        </p>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />

        <div className="flex-1 relative">
          <AutoResizeTextarea
            onChange={handleChange}
            value={message}
            onKeyDown={handleKeyDown}
            placeholder="Enter your Message"
            className="border-t border-l border-r p-4"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() && !file}
          size="icon"
          className="h-10 w-10"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
