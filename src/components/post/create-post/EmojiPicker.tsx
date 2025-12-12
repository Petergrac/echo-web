"use client";
import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface EmojiPickerButtonProps {
  onEmojiSelect?: (emoji: string) => void;
}

const EmojiPickerButton = ({ onEmojiSelect }: EmojiPickerButtonProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  //* Handle click outside to close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;

    //* Call parent function to insert emoji
    if (onEmojiSelect) {
      onEmojiSelect(emoji);
    }

    //* Close the picker
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleEmojiPicker}
        className="p-2 text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 rounded-full transition-colors"
        title="Emoji"
      >
        <Smile size={20} />
      </button>

      {showEmojiPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 mb-2 z-50 shadow-xl rounded-lg overflow-hidden"
        >
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={handleEmojiClick}
            width={300}
            height={350}
            previewConfig={{ showPreview: false }}
            searchDisabled={false}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
