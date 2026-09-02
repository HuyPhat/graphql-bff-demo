import { ApolloClient, InMemoryCache, type NormalizedCacheObject } from '@apollo/client';

export const apolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});