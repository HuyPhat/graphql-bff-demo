import { useState } from 'react';
import { Feed } from './components/Feed';

export default function App() {
  const [limit, setLimit] = useState(10);

  return (
    <main>
      <header>
        <h1>GraphQL BFF Demo</h1>
        <p className="subtitle">
          React client &rarr; Node/GraphQL <strong>Backend-for-Frontend</strong>{' '}
          &rarr; REST services
        </p>
      </header>

      <section className="controls">
        <label htmlFor="limit">Posts per page</label>
        <input
          id="limit"
          type="number"
          min={1}
          max={100}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </section>

      <Feed limit={limit} />
    </main>
  );
}