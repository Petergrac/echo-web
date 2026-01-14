"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackBar = ({ type, push }: { type: string; push?: boolean }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        if (push) router.push("/feed");
        else router.back();
      }}
      className="fixed border-b-2 pl-2 py-5 top-0 z-56 w-full bg-transparent backdrop-blur-2xl flex-col supports-backdrop-filter:bg-background/8 flex sm:w-[600px]"
    >
      <div className="flex gap-3">
        <ArrowLeft />
        <p className="font-bold">{type}</p>
      </div>
    </div>
  );
};

export default BackBar;
