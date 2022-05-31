import { useCallback, useState } from 'react';

const App = () => {
  const [countries] = useState([]);
  const [neighbors] = useState([]);
  const [pending] = useState(false);

  const renderCountries = useCallback(() => {
    if (pending) {
      return <p>Loading...</p>;
    }
    if (countries.length === 0) {
      return <p>No countries found.</p>;
    }
    return <ul>{countries.map(country => <li key={country.name}>{country.name}</li>)}</ul>;
  }, [countries, pending]);

  const renderNeighbors = useCallback(() => {
    if (pending) {
      return <p>Loading...</p>;
    }
    if (neighbors.length === 0) {
      return <p>No groupings found.</p>;
    }
    return <ul>{neighbors.map((neighbor => <li key={neighbor}>{neighbor}</li>))}</ul>;
  }, [neighbors, pending]);

  return (
    <>
      <button>Generate Groupings</button>
      <h1>Selected Countries</h1>
      {renderCountries()}
      <h1>Neighbors</h1>
      {renderNeighbors()}
    </>
  );
};

export default App;
