/*
  Description: Randomly select n (or less) elements from a list
  Assumptions: all elements in the list are unique
  Notes: Array should be n > 100
*/

const selectRandom = (arr, n) => {
  if (arr.length <= n) {
    return arr;
  }
  const selected = new Set();
  while (selected.size < n) {
    const i = Math.floor(Math.random() * arr.length);
    selected.add(arr[i]);
  }
  return Array.from(selected);
};

export default selectRandom;
