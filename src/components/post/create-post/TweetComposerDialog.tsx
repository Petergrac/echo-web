import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import TweetComposer from "./TweetComposer";

const TweetComposerDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="">
        {/* Custom Header: Close on left, Title center-ish, Save on right */}
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-2 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <DialogTitle className="text-xl font-bold">
              Create a Post
            </DialogTitle>
          </div>
        </DialogHeader>
        <Separator />
        <div className="z-9999">
          <TweetComposer feedType="forYou" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default TweetComposerDialog;
