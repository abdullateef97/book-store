import { UserInterface } from './user';

export interface CreatePostInterface {
  title: string;
  content: string;
}

export interface PostInterface {
  id: number;
  title: string;
  content: string;
  user_id?: number;
  user?: UserInterface;
  comments?:  CommentInterface;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetPostListInterface {
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CommentInterface {
  comment: string;
  user_id?: number;
  user?: UserInterface;
}

export interface AddCommentToPostInterface {
  comment: string;
}