"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EarthIcon, User2, AtSignIcon } from "lucide-react";

type ReplySetting = "everyone" | "following" | "mentioned";

interface ReplySettingsSelectProps {
  value: ReplySetting;
  onChange: (value: ReplySetting) => void;
}

const ReplySettingsSelect = ({ value, onChange }: ReplySettingsSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="flex outline-none items-center gap-2 justify-start text-sky-500 w-fit border-4 bg-transparent hover:bg-sky-500/10 px-3 py-1 rounded-full">
        {value === "everyone" && <EarthIcon size={15} />}
        {value === "following" && <User2 size={15} />}
        {value === "mentioned" && <AtSignIcon size={15} />}
        <SelectValue>
          {value === "everyone" && "Everyone can reply"}
          {value === "following" && "People you follow"}
          {value === "mentioned" && "Only people you mention"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-black w-72 glow">
        <SelectItem value="info" disabled>
          <div className="flex flex-col">
            <p className="text-sm font-bold">Who else can reply?</p>
            <p className="text-gray-400 text-sm pb-4">
              Choose who can reply to this post
              <br />
              Anyone mentioned can always reply.
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
              <p className="text-gray-400 text-sm">All users can reply</p>
            </div>
          </div>
        </SelectItem>
        <SelectItem value="following">
          <div className="flex gap-3 items-center">
            <div className="bg-sky-500 rounded-full p-2">
              <User2 className="text-white" size={18} />
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Accounts you follow</p>
              <p className="text-gray-400 text-sm">Only people you follow</p>
            </div>
          </div>
        </SelectItem>
        <SelectItem value="mentioned">
          <div className="flex gap-3 items-center">
            <div className="bg-sky-500 rounded-full p-2">
              <AtSignIcon className="text-white" size={18} />
            </div>
            <div className="flex flex-col">
              <p className="font-bold">Only people you mention</p>
              <p className="text-gray-400 text-sm">
                Only <span className="text-sky-500">@mentioned</span> users
              </p>
            </div>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ReplySettingsSelect;