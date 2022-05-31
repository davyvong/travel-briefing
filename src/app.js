import travelBriefingAPI from 'api/travel-briefing';
import { useCallback, useEffect, useState } from 'react';
import selectRandom from 'utils/select-random';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [pending, setPending] = useState(false);

  // Fetch data and calculate neighbors
  const generateGroupings = useCallback(async () => {
    setPending(true);
    try {
      // All requests to trave briefing are cached so we can repeatedly call the same endpoint.
      const allCountries = await travelBriefingAPI.allCountries();
      // Randomly select 10 countries
      let selectedCountries = selectRandom(allCountries, 10);
      setCountries(selectedCountries);
      // Create a set of countries by name
      const selectedCountryNames = new Set(selectedCountries.map(country => country.name));
      // Fetch the API url of each selected country and cache the response
      selectedCountries = await Promise.all(selectedCountries.map(country => travelBriefingAPI.get(country.url)))
      const groupings = new Set();
      // Loop through each selected country and their neighbours to see if the neighbours are selected countries
      // 0 < selectedCountries is < 10
      // 0 < country.neighbours < allCountries - 1 (but realistically there will not be even close to that many neighbors)
      // Complexity is O(n * m), n = selectedCountries m = country.neighbours
      selectedCountries.forEach(country => {
        country.neighbors.forEach(neighbor => {
          if (selectedCountryNames.has(neighbor.name)) {
            // This is hacky, but we format the country pair alphabetically into a string and add it to a set so dupes don't occur
            if (neighbor.name < country.names.name) {
              groupings.add(`${neighbor.name} - ${country.names.name}`);
            } else {
              groupings.add(`${country.names.name} - ${neighbor.name}`);
            }
          }
        });
      });
      setNeighbors(Array.from(groupings));
    } catch (error) {
      console.log(error);
      setCountries([]);
      setNeighbors([]);
    } finally {
      setPending(false);
    }
  }, []);

  // Fetch data on component's first render
  useEffect(() => {
    generateGroupings();
  }, [generateGroupings]);

  // Render randomly selected 10 countries
  const renderCountries = useCallback(() => {
    if (pending) {
      return <p>Loading...</p>;
    }
    if (countries.length === 0) {
      return <p>No countries found.</p>;
    }
    return <ul>{countries.map(country => <li key={country.name}>{country.name}</li>)}</ul>;
  }, [countries, pending]);

  // Render neighbors
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
      <button onClick={generateGroupings}>Generate Groupings</button>
      <h1>Selected Countries</h1>
      {renderCountries()}
      <h1>Neighbors</h1>
      {renderNeighbors()}
    </>
  );
};

export default App;
