export interface Media {
  id: string;
  mediaUrl: string;
  resourceType: string;
}

export interface PostStatus {
  hasLiked: boolean;
  hasReposted: boolean;
  hasBookmarked: boolean;
  hasReplied?: boolean;
}

export interface Post {
  id: string;
  content: string;
  visibility: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  viewCount: number;
  mediaCount: number;
  media: Media[];
  postStatus?: PostStatus;
  author?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}
