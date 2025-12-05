"use client";
import { useState, useRef, useEffect } from "react";
import { useCurrentUser } from "@/lib/hooks/useStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import {
  AtSignIcon,
  CalendarIcon,
  EarthIcon,
  ImageIcon,
  LocationEdit,
  ToolCaseIcon,
  User2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import CharacterProgress from "./CharacterProgress";

type ReplySetting = "everyone" | "following" | "mentioned";

const TweetComposer = () => {
  const user = useCurrentUser();
  const [tweetContent, setTweetContent] = useState("");
  const [replySetting, setReplySetting] = useState<ReplySetting>("everyone");
  const [tweetSize, setTweetSize] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //* 1.Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const maxHeight = 300;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);

      textarea.style.height = `${Math.max(30, newHeight)}px`;
      textarea.style.overflowY = newHeight >= maxHeight ? "auto" : "hidden";
    }
  }, [tweetContent]);

  const handleSubmit = () => {
    if (tweetContent.trim()) {
      //* 2.Prepare post data
      const postData = {
        content: tweetContent,
        replySetting: replySetting,
        userId: user?.id,
        createdAt: new Date().toISOString(),
      };

      console.log("Posting:", postData);

      // TODO: Add your API call here
      // Example:
      // await fetch('/api/posts', {
      //   method: 'POST',
      //   body: JSON.stringify(postData),
      // });

      // Clear form after submission
      setTweetContent("");
      setReplySetting("everyone");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="md:pt-12 pt-25">
      <div className="px-5 pt-5 flex items-start justify-start gap-2">
        <Link href={`/${user?.username} `} className="hidden md:block">
          <Avatar>
            <AvatarImage
              src={user?.avatar || `https://github.com/shadcn.png`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col gap-5 w-full">
          <textarea
            ref={textareaRef}
            value={tweetContent}
            maxLength={201}
            onChange={(e) => {
              setTweetContent(e.target.value);
              setTweetSize(tweetContent.length);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Write Something"
            className="auto-textarea"
            rows={1}
          />
          <div className="flex justify-between items-center">
            <Select
              value={replySetting}
              onValueChange={(value: ReplySetting) => setReplySetting(value)}
            >
              <SelectTrigger className="select-area">
                {replySetting === "everyone" && <EarthIcon size={15} />}
                {replySetting === "following" && <User2 size={15} />}
                {replySetting === "mentioned" && <AtSignIcon size={15} />}
                <SelectValue>
                  {replySetting === "everyone" && "Everyone can reply"}
                  {replySetting === "following" && "People you follow"}
                  {replySetting === "mentioned" && "Only people you mention"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-black w-72 glow">
                <SelectItem value="info" disabled={true}>
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
                      <p className="text-gray-400 text-sm">
                        All users can reply
                      </p>
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
                      <p className="text-gray-400 text-sm">
                        Only people you follow
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
                      <p className="font-bold">Only people you mention</p>
                      <p className="text-gray-400 text-sm">
                        Only @mentioned users
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <CharacterProgress tweetSize={tweetSize} />
          </div>

          <div className="flex border-t justify-between w-full pl-4">
            <div className="my-6 flex gap-4">
              <label htmlFor="media">
                <ImageIcon className="text-sky-500 hover:text-sky-600 cursor-pointer" />
                <input className="hidden" type="file" id="media"/>
              </label>
              <CalendarIcon className="text-sky-500 hover:text-sky-600 cursor-pointer" />
              <ToolCaseIcon className="text-sky-500 hover:text-sky-600 cursor-pointer" />
              <LocationEdit className="text-sky-500 hover:text-sky-600 cursor-pointer" />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!tweetContent.trim()}
              className="my-6 rounded-full text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetComposer;
