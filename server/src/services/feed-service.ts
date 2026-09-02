import type { Comment, FeedItem, Post, User } from '../types.js';

export interface DataSources {
  userAPI: {
    getUsers(): Promise<User[]>;
    getUser(id: number): Promise<User | null>;
  };
  postAPI: {
    getPosts(): Promise<Post[]>;
    getComments(): Promise<Comment[]>;
  };
}

/**
 * The BFF aggregation layer.
 *
 * Notice what happens here: one GraphQL resolver fan-out turns four REST
 * calls (posts, users, comments + grouping) into a single, shaped response
 * the React client consumes in one round trip. That is the whole job of a
 * backend-for-frontend: compose upstream services into exactly the shape a
 * specific UI needs, and let the client ask for only the fields it renders.
 */
export function feedService(dataSources: DataSources, limit: number): Promise<FeedItem[]> {
  return (async () => {
    const [posts, users, comments] = await Promise.all([
      dataSources.postAPI.getPosts(),
      dataSources.userAPI.getUsers(),
      dataSources.postAPI.getComments(),
    ]);

    const usersById = new Map<number, User>(users.map((u) => [u.id, u]));
    const commentsByPost = new Map<number, Comment[]>();
    for (const c of comments) {
      const list = commentsByPost.get(c.postId) ?? [];
      list.push(c);
      commentsByPost.set(c.postId, list);
    }

    return posts.slice(0, limit).map((post) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      user: usersById.get(post.userId) ?? null,
      commentCount: commentsByPost.get(post.id)?.length ?? 0,
    }));
  })();
}