/** Returns command names that start with `partial`, for Tab-completion.
 * Empty partial returns nothing (avoids dumping the whole list on a bare Tab). */
export function getAutocompleteSuggestions(partial: string, candidates: string[]): string[] {
  if (!partial) return [];
  const lower = partial.toLowerCase();
  return candidates.filter((c) => c.startsWith(lower)).sort();
}

/** Given suggestions, returns the longest common prefix — standard shell
 * behavior where Tab fills in as much as is unambiguous. */
export function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  return strings.reduce((prefix, str) => {
    let i = 0;
    while (i < prefix.length && i < str.length && prefix[i] === str[i]) i += 1;
    return prefix.slice(0, i);
  });
}
