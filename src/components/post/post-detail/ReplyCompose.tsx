"use client";
import { Dispatch, SetStateAction } from "react";
import AutoResizeTextarea from "../create-post/AutoResizeTextArea";
import { ImageIcon } from "lucide-react";
import { useId } from "react";

export interface ReplyComposeProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  media: File | null;
  setReplyInput?: Dispatch<SetStateAction<boolean>>;
  placeholder?: string;
  setMedia: Dispatch<SetStateAction<File | null>>;
  handleSubmit: () => void;
}

const ReplyCompose = ({
  value,
  setValue,
  media,
  setReplyInput,
  placeholder,
  setMedia,
  handleSubmit,
}: ReplyComposeProps) => {
  const mediaInputId = useId();

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
        placeholder={placeholder || `Comment this post`}
        onChange={onChange}
      />
      <div className="flex w-full justify-between">
        <label
          htmlFor={mediaInputId}
          className="flex gap-2 hover:bg-sky-500/50 w-fit hover:rounded-full p-2"
        >
          <ImageIcon className="text-sky-500" />
          <input
            id={mediaInputId}
            className="hidden"
            type="file"
            onChange={(e) => handleMedia(e)}
            accept="image/*"
            name="media"
          />
          {media && <p className="text-sm text-sky-400">image selected</p>}{" "}
        </label>
        <div className="flex gap-2 ">
          <button
            onClick={() => setReplyInput && setReplyInput(false)}
            className="bg-gray-800 rounded-2xl transition-all duration-300 p-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="p-2 hover:bg-sky-700 transition-all duration-300 bg-sky-500 text-sm rounded-2xl"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyCompose;
