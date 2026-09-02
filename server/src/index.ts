import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { UserAPI } from './datasources/user-api.js';
import { PostAPI } from './datasources/post-api.js';
import { resolvers, type ServerContext } from './resolvers.js';
import { typeDefs } from './schema.js';

const server = new ApolloServer<ServerContext>({
  typeDefs,
  resolvers,
  introspection: true,
});

const { url } = await startStandaloneServer(server, {
  context: async (): Promise<ServerContext> => ({
    dataSources: {
      userAPI: new UserAPI(),
      postAPI: new PostAPI(),
    },
  }),
  listen: { port: 4000 },
});

console.log(`GraphQL BFF ready at ${url}graphql`);