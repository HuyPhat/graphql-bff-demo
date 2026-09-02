export const typeDefs = `#graphql
  "A user owned by JSONPlaceholder users REST endpoint."
  type User {
    id: ID!
    name: String!
    email: String!
    company: Company
  }

  type Company {
    name: String!
    catchPhrase: String
  }

  "A blog post authored by a User."
  type Post {
    id: ID!
    title: String!
    body: String!
    user: User
    commentCount: Int!
  }

  "Root query of the BFF. The client never talks to REST — it talks to this."
  type Query {
    "Posts joined with their author and comment count. The headline BFF composition."
    feed(limit: Int = 10): [Post!]!
    "A single user by id (demonstrates direct passthrough to one REST endpoint)."
    user(id: ID!): User
  }
`;