"use client";

import {
  CalendarIcon,
  ImageIcon,
  LocationEdit,
  ToolCaseIcon,
  Smile,
} from "lucide-react";

interface ToolbarActionsProps {
  onMediaClick?: () => void;
}

const ToolbarActions = ({ onMediaClick }: ToolbarActionsProps) => {
  return (
    <div className="my-6 flex gap-4">
      <button
        type="button"
        onClick={onMediaClick}
        className="p-2 text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 rounded-full transition-colors"
        title="Add media"
      >
        <ImageIcon size={20} />
      </button>
      <button
        type="button"
        className="p-2 text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 rounded-full transition-colors"
        title="Emoji"
      >
        <Smile size={20} />
      </button>
      <button
        type="button"
        className="p-2 text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 rounded-full transition-colors"
        title="Schedule"
      >
        <CalendarIcon size={20} />
      </button>
      <button
        type="button"
        className="p-2 text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 rounded-full transition-colors"
        title="Add poll"
      >
        <ToolCaseIcon size={20} />
      </button>
      <button
        type="button"
        className="p-2 text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 rounded-full transition-colors"
        title="Add location"
      >
        <LocationEdit size={20} />
      </button>
    </div>
  );
};

export default ToolbarActions;
