export interface Media {
  id: string;
  mediaUrl: string;
  resourceType: string;
}
export interface Post {
  isMuted: boolean;
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
  hasLiked: boolean;
  hasReposted: boolean;
  hasBookmarked: boolean;
  repostContent: string | null;
  hasReplied?: boolean;
  isFollowingAuthor: boolean;
  author?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}
