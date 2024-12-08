export const textSorter = (a, b) => {
  if (!a || !b) return 0;
  return a.localeCompare(b);
};

export const iso8601Sorter = (a, b) => {
  // magic!! : https://stackoverflow.com/a/12192544
  if (!a || !b) return 0;
  return a < b ? -1 : a > b ? 1 : 0;
};
