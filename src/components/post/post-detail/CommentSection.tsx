import { PostReply } from "@/types/reply";
import ReplyItem from "./ReplyItem";

export default function CommentSection({
  topLevelReplies,
}: {
  topLevelReplies: PostReply[];
}) {
  return (
    <div className="max-w-2xl mx-auto p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Comments</h3>
      <div className="space-y-2">
        {topLevelReplies.map((reply: PostReply) => (
          <ReplyItem key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  );
}
