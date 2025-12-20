"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  rows?: number;
}

const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(
  (
    {
      value,
      onChange,
      onKeyDown,
      placeholder = "What's happening?",
      maxLength = 280,
      className = "",
      rows = 1,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Forward the ref
    useImperativeHandle(ref, () => textareaRef.current!);

    //* 1.Auto-resize textarea
    useEffect(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";

        const maxHeight = 300;
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);

        textarea.style.height = `${Math.max(rows * 24, newHeight)}px`;
        textarea.style.overflowY = newHeight >= maxHeight ? "auto" : "hidden";
      }
    }, [value, rows]);

    return (
      <textarea
        ref={textareaRef}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full text-sm placeholder:text-sm  placeholder:text-gray-400 bg-transparent outline-none rounded-sm min-h-[${
          rows * 24
        }px] resize-none ${className}`}
        rows={rows}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";

export default AutoResizeTextarea;
