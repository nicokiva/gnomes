const cacheKey = '_CACHE_KEY';

export const cacheService = {
  get<T>(key: string) {
    const cached = localStorage.getItem(`${key}${cacheKey}`);

    return cached !== null ? ((JSON.parse(cached) as unknown) as T) : undefined;
  },

  set(key: string, data: unknown) {
    localStorage.setItem(`${key}${cacheKey}`, JSON.stringify(data));
  }
};
