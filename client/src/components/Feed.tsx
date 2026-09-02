import { useQuery } from '@apollo/client';
import { FEED_QUERY, type FeedPost } from '../graphql';

function FeedItem({ post }: { post: FeedPost }) {
  return (
    <article className="feed-item">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <footer>
        <span className="author">
          {post.user?.name ?? 'Unknown'} {post.user?.company ? `· ${post.user.company.name}` : ''}
        </span>
        <span className="meta">{post.commentCount} comments</span>
      </footer>
    </article>
  );
}

export function Feed({ limit = 10 }: { limit?: number }) {
  const { loading, error, data } = useQuery(FEED_QUERY, {
    variables: { limit },
  });

  if (loading) return <p className="status">Loading feed from the BFF...</p>;
  if (error) return <p className="status error">GraphQL error: {error.message}</p>;

  const posts: FeedPost[] = data?.feed ?? [];

  return (
    <section className="feed">
      <p className="status">
        {posts.length} posts fetched in one GraphQL round trip (composed across
        the posts, users and comments REST endpoints by the BFF).
      </p>
      {posts.map((post) => (
        <FeedItem key={post.id} post={post} />
      ))}
    </section>
  );
}