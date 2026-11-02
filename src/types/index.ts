export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  website?: string;
  location?: string;
  pronouns?: string;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

export interface CommentReply {
  id: string;
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
  likesCount: number;
}

export interface PinComment {
  id: string;
  pinId: string;
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
  likesCount: number;
  replies?: CommentReply[];
}

export interface Pin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  aspectRatio: number;
  dominantColor: string;
  destinationUrl?: string;
  category: string;
  tags: string[];
  userId: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  likesCount: number;
  savesCount: number;
  createdAt: string;
}

export interface BoardSection {
  id: string;
  boardId: string;
  title: string;
  pinIds: string[];
}

export interface BoardCollaborator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'editor' | 'viewer' | 'owner';
}

export interface Board {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage: string;
  isPrivate: boolean;
  pinIds: string[];
  sections: BoardSection[];
  collaborators: BoardCollaborator[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'save' | 'comment' | 'follow';
  userId: string;
  actor: {
    name: string;
    username: string;
    avatar: string;
  };
  pinId?: string;
  pinImage?: string;
  boardId?: string;
  boardTitle?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface PinReport {
  id: string;
  pinId: string;
  pinTitle: string;
  pinImage: string;
  reporterName: string;
  reason: 'spam' | 'inappropriate' | 'copyright' | 'harassment' | 'misleading';
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export type ActiveTab = 'feed' | 'explore' | 'profile' | 'board-detail' | 'search';
