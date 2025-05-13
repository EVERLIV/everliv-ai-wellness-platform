
/**
 * Adds a cache-busting parameter to a URL
 * @param url The URL to add the cache-busting parameter to
 * @returns The URL with a cache-busting parameter
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_=${Date.now()}`;
}

/**
 * Creates fetch options that include cache-busting headers
 * @param options Original fetch options
 * @returns Updated fetch options with cache-busting headers
 */
export function createNoCacheOptions(options?: RequestInit): RequestInit {
  return {
    ...options,
    headers: {
      ...options?.headers,
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  };
}

/**
 * Wraps the fetch API with cache-busting functionality
 * @param url The URL to fetch
 * @param options fetch options
 * @returns The fetch promise
 */
export function fetchWithCacheBusting(url: string, options?: RequestInit): Promise<Response> {
  return fetch(addCacheBuster(url), createNoCacheOptions(options));
}
