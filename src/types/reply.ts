export interface ReplyAuthor {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
  bio: string | null;
  location: string | null;
  followersCount: number;
  followingCount: number;
}

export interface PostMedia {
  id: string;
  mediaUrl: string;
  resourceType: "image" | "gif";
}

export enum PostVisibility {
  PUBLIC = "public",
  FOLLOWERS = "followers",
}

export interface PostReply {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  parentReplyId: string | null;
  author: ReplyAuthor;
  media: PostMedia[];

  replyCount: number;
  directDescendantsCount: number;
}
