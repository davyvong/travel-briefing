/*
  Description: Fetch data from our API and store the responses in cache
  Assumptions: Responses from the endpoints do not change (otherwise we could introduce LRU or expiry)
*/

const cache = new Map();

export const getWithCache = async (url) => {
  const cachedResponse = cache.get(url);
  if (cachedResponse) {
    return cachedResponse;
  }
  const response = await fetch(url);
  const body = await response.json();
  cache.set(url, body);
  return body;
};

export const allCountries = () => getWithCache('https://travelbriefing.org/countries.json');

const travelBriefingAPI = {
  allCountries,
  get: getWithCache,
};

export default travelBriefingAPI;
