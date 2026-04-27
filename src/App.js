import { useEffect, useMemo, useState } from 'react';
import './App.css';

const COUNTRIES_API =
  'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries';

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(COUNTRIES_API);
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setCountries(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setCountries([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return countries;
    }
    return countries.filter((c) =>
      String(c.common || '')
        .toLowerCase()
        .includes(q)
    );
  }, [countries, search]);

  return (
    <div className="app">
      <header className="appHeader">
        <input
          className="searchInput"
          type="text"
          placeholder="Search for countries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search for countries"
        />
      </header>
      <main className="countryList">
        {filtered.map((country) => (
          <div className="countryCard" key={`${country.common}-${country.png}`}>
            <img
              className="countryFlag"
              src={country.png}
              alt={`${country.common} flag`}
            />
            <p className="countryName">{country.common}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
