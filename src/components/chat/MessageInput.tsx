import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Smile, Send, X } from "lucide-react";
import { useChat } from "@/lib/hooks/useChat";
import { ApiMessage } from "@/types/chat";

interface MessageInputProps {
  conversationId: string;
  onSend: (content: string, file?: File) => void;
  replyTo?: ApiMessage;
  onCancelReply?: () => void;
}

export function MessageInput({
  onSend,
  replyTo,
  onCancelReply,
}: MessageInputProps) {
  const { startTyping, stopTyping } = useChat();
  const [message, setMessage] = useState("");
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
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

      <div className="flex items-end gap-2">
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
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-11 max-h-32 resize-none pr-12"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8"
          >
            <Smile className="h-5 w-5" />
          </Button>
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
