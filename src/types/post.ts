import type { User } from "./user";

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  imageSrc: string;
  author: User;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  parentComment?: string;
  likes: number;
  userLiked?: boolean;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}
