export interface UserType {
  id: string;
  email: string;
  username: string;
  avatar: string;
  firstName: string;
  lastName: string;
  bio?: string;
  website?: string;
  location?: string;
  emailVerified: boolean;
  createdAt: Date;
  followersCount: string | number;
  followingCount: string | number;
  postCount: number;
  isFollowing: boolean;
}

export interface FollowType extends UserType {
  viewerFollows: boolean;
  followsViewer: boolean;
  isMutual: boolean;
}
