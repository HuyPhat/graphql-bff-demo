export interface Company {
  name: string;
  catchPhrase: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company: Company;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  body: string;
}

export interface FeedItem {
  id: number;
  title: string;
  body: string;
  user: User | null;
  commentCount: number;
}