# GraphQL BFF Demo (React + Node/GraphQL)

A minimal **Backend-for-Frontend (BFF)** that proves the full data-shaping loop your
UI needs: a **React client** queries **one GraphQL endpoint** on a **Node.js server**
which fans out to **multiple REST services** and returns exactly the shape the screen
renders — authors joined onto posts, comment counts computed, all in a single round trip.

Built to close the "NodeJS GraphQL BFF" skill gap on a Fullstack Developer evaluation
(Capgemini Vietnam, report `career-ops/reports/003-capgemini-vietnam-2026-09-02.md`).

## Why this is a BFF and not "just an API"

| Zoom (API) | BFF (this repo) |
|---|---|
| Owned by the platform team | Owned by the frontend team |
| Returns canonical domain models | Returns **screen-shaped** responses (joined, computed) |
| Clients consume warts (N+1, over-fetching, 4 REST calls) | Clients get one round trip, ask for only what they render |
| Generic error semantics | Errors tuned to UI states |

The compose logic lives in `server/src/services/feed-service.ts`: three parallel REST
fetches (`posts`, `users`, `comments`) are grouped and shaped into `FeedItem[]` —
authors resolved onto posts, comment counts computed — then exposed through one
`feed(limit)` GraphQL field. The React client sends one query and gets a ready-to-render
list. Swap JSONPlaceholder for your company's inner services and you have the pattern
as it runs in production.

## Architecture

```text
┌──────────────┐    /graphql (one round trip)    ┌─────────────────────┐
│   React       │ ──────────────────────────────▶ │  Node BFF :4000     │
│   Apollo      │                                 │  Apollo Server       │
│   GraphQL     │                                  │  ├ schema.ts         │
│   queries     │                                  │  ├ resolvers.ts      │
└──────────────┘                                   │  └ services/         │
      Vite proxy :5173 → :4000                      │     feed-service.ts │
                                                     └────────┬───────────┘
                                           RESTDataSource fan-out
                              ┌────────────────┼────────────────┐
                              ▼                ▼                ▼
                      JSONPlaceholder   JSONPlaceholder   JSONPlaceholder
                       /users            /posts            /comments
```

## Stack

- **Server:** Node 24, Express, Apollo Server 5, GraphQL 16, `@apollo/datasource-rest` (RESTDataSource), TypeScript
- **Client:** Vite, React 19, Apollo Client 3, TypeScript
- **"Upstream services":** JSONPlaceholder (public REST API) — swap for real services

## Run it

```bash
npm install
npm run dev          # server :4000 + client :5173 (concurrently)
```

- Playground/endpoint: http://localhost:4000/graphql (run the `feed` query below)
- Client app: http://localhost:5173

Try this query in the playground:

```graphql
{
  feed(limit: 5) {
    id
    title
    commentCount
    user {
      name
      company { name }
    }
  }
}
```

## Layout

```text
server/
  src/
    schema.ts              # GraphQL type definitions (the BFF's contract)
    resolvers.ts           # field resolvers + ServerContext wiring
    services/feed-service.ts   # BFF composition logic (the interesting part)
    datasources/{user,post}-api.ts   # RESTDataSource wrappers for upstream REST
    index.ts               # Apollo Server boot
client/
  src/
    apollo.ts              # ApolloClient -> /graphql (Vite-proxied to :4000)
    graphql.ts             # FEED_QUERY + result types
    components/Feed.tsx    # renders the composed feed
    App.tsx
```

## Clean architecture notes

- **TypeScript strict** end to end; domain types in `server/src/types.ts` are the contract between services and resolvers.
- **Data sources isolated:** resolvers never touch HTTP; they call the service layer, which calls `RESTDataSource` wrappers. Swap in a `getUser` passthrough or a DB-backed source without touching schema.
- **Single resolver, single responsibility:** `feed` is the only composition point the client needs; `user(id)` shows a direct passthrough for contrast.

## Interview talking points

- "I built a BFF that fans out to three REST endpoints and returns a screen-shaped response, cutting the UI's round trips from 3+ to 1."
- "Field-level selection came free with GraphQL: the client asks for exactly what the grid renders, no over-fetching."
- "Pattern is identical to production BFFs — typed data sources, a service layer, clean schema."
- Honest gap framing: "This was my first hands-on GraphQL schema; the pattern maps directly to my API integration work at Larion, where I already designed the contracts my features consumed."

## What to improve next (roadmap)

- [ ] GraphQL Codegen for type-safe client queries from the schema
- [ ] N+1 batching via `dataloader`
- [ ] `@defer` for slow comment counts
- [ ] Auth aware BFF context (per-user shape)
- [ ] Unit tests on `feed-service` with a mocked `RESTDataSource` (Vitest)