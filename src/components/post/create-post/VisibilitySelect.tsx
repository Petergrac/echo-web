"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EarthIcon, User2, AtSignIcon } from "lucide-react";

type VisibilitySettings = "public" | "followers" | "private";

interface ReplySettingsSelectProps {
  value: VisibilitySettings;
  onChange: (value: VisibilitySettings) => void;
}

const VisibilitySelect = ({ value, onChange }: ReplySettingsSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex outline-none items-center gap-2 justify-start text-sky-500 w-fit border-4 bg-transparent hover:bg-sky-500/10 px-3 py-1 rounded-full">
        {value === "public" && <EarthIcon size={15} />}
        {value === "followers" && <User2 size={15} />}
        {value === "private" && <AtSignIcon size={15} />}
        <SelectValue>
          {value === "public" && "Everyone can view"}
          {value === "followers" && "People you follow"}
          {value === "private" && "No one can view"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-black w-72 glow">
        <SelectItem value="info" disabled>
          <div className="flex flex-col">
            <p className="text-sm font-bold">Who else can view this post?</p>
            <p className="text-gray-400 text-sm pb-4">
              Choose who can view the post
              <br />
              Anyone can always view.
            </p>
          </div>
        </SelectItem>
        <SelectItem value="everyone">
          <div className="flex gap-3 items-center">
            <div className="bg-sky-500 rounded-full p-2">
              <EarthIcon className="text-white" size={18} />
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Everyone</p>
              <p className="text-gray-400 text-sm">All users can view</p>
            </div>
          </div>
        </SelectItem>
        <SelectItem value="following">
          <div className="flex gap-3 items-center">
            <div className="bg-sky-500 rounded-full p-2">
              <User2 className="text-white" size={18} />
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Accounts that follow you</p>
              <p className="text-gray-400 text-sm">
                Only people that follow you
              </p>
            </div>
          </div>
        </SelectItem>
        <SelectItem value="mentioned">
          <div className="flex gap-3 items-center">
            <div className="bg-sky-500 rounded-full p-2">
              <AtSignIcon className="text-white" size={18} />
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Private</p>
              <p className="text-gray-400 text-sm">No one can view or reply.</p>
            </div>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default VisibilitySelect;
