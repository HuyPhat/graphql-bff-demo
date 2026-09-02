import { existsSync } from 'fs';
import { join } from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import { UserAPI } from './datasources/user-api.js';
import { PostAPI } from './datasources/post-api.js';
import { resolvers, type ServerContext } from './resolvers.js';
import { typeDefs } from './schema.js';

const PORT = Number(process.env.PORT ?? 4000);

const server = new ApolloServer<ServerContext>({
  typeDefs,
  resolvers,
  introspection: true,
});

const app = express();
app.use(cors());
app.use(express.json());

await server.start();

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async (): Promise<ServerContext> => ({
      dataSources: {
        userAPI: new UserAPI(),
        postAPI: new PostAPI(),
      },
    }),
  }),
);

// Serve the built React client from the same origin so the BFF is one container:
// static assets + /graphql behind one port. Works in Docker and from a local
// workspace checkout (the relative path matches both layouts). Skipped when the
// client has not been built — local `tsx` dev uses the Vite proxy instead.
const clientDist = join(import.meta.dirname, '..', '..', 'client', 'dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/graphql') && !req.path.includes('.')) {
      res.sendFile(join(clientDist, 'index.html'));
      return;
    }
    next();
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GraphQL BFF ready at http://0.0.0.0:${PORT}/graphql`);
});