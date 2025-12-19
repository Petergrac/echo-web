"use client";
import { useState } from "react";
import AutoResizeTextarea from "../create-post/AutoResizeTextArea";
import { ImageIcon } from "lucide-react";

const ReplyCompose = () => {
  const [value, setValue] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const onChange = (v: string) => {
    setValue(v);
  };
  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setMedia(files[0]);
  };
  return (
    <div className="outline flex mt-5 flex-col gap-2 rounded-lg  p-3">
      <AutoResizeTextarea
        value={value}
        placeholder="Comment this post"
        onChange={onChange}
      />
      <label
        htmlFor="mediaFile"
        className="flex gap-2 hover:bg-sky-500/50 w-fit hover:rounded-full p-2"
      >
        <ImageIcon className="text-sky-500" />
        <input
          id="mediaFile"
          className="hidden"
          type="file"
          onChange={(e) => handleMedia(e)}
          accept="image/*"
          name="media"
        />
        {media && <p className="text-sm text-sky-400">image selected</p>}{" "}
      </label>
    </div>
  );
};

export default ReplyCompose;
