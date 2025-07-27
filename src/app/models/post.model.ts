export interface Post {
  id: string;
  author: string;
  authorAvatar?: string;
  community: string;
  content: string;
  imageUrl?: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
} 