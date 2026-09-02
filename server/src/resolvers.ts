import { feedService } from './services/feed-service.js';
import type { FeedItem } from './types.js';

export interface ServerContext {
  dataSources: {
    userAPI: import('./datasources/user-api.js').UserAPI;
    postAPI: import('./datasources/post-api.js').PostAPI;
  };
}

export const resolvers = {
  Query: {
    feed: (
      _parent: unknown,
      args: { limit?: number },
      ctx: ServerContext,
    ): Promise<FeedItem[]> => feedService(ctx.dataSources, args.limit ?? 10),
    user: (
      _parent: unknown,
      args: { id: string },
      ctx: ServerContext,
    ) => ctx.dataSources.userAPI.getUser(Number(args.id)),
  },
};