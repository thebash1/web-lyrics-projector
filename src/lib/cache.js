import { LRUCache } from 'lru-cache';

// Simple LRU cache with TTL (default 1 hour)
const options = {
  max: 500, // max number of items
  ttl: 1000 * 60 * 60, // 1 hour in ms
  // Optional stale handling
  allowStale: false,
};

const cache = new LRUCache(options);

export function get(key) {
  return cache.get(key);
}

export function set(key, value, ttl) {
  if (ttl) {
    cache.set(key, value, { ttl });
  } else {
    cache.set(key, value);
  }
}

export function has(key) {
  return cache.has(key);
}

export function deleteKey(key) {
  cache.delete(key);
}
