import { gql } from '@apollo/client';

export const FEED_QUERY = gql`
  query Feed($limit: Int) {
    feed(limit: $limit) {
      id
      title
      body
      commentCount
      user {
        id
        name
        company {
          name
        }
      }
    }
  }
`;

export interface FeedUser {
  id: string;
  name: string;
  company?: { name: string } | null;
}

export interface FeedPost {
  id: string;
  title: string;
  body: string;
  commentCount: number;
  user?: FeedUser | null;
}