const Redis = require('ioredis');

/**
 * Redis client wrapper for caching and session storage.
 * Exports a singleton that reconnects automatically.
 */
let client = null;

function getRedisClient() {
  if (client) return client;

  client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: times => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3,
  });

  client.on('connect', () => console.log('Redis connected'));
  client.on('error', err => console.error('Redis error:', err.message));
  client.on('close', () => console.log('Redis connection closed'));

  return client;
}

/**
 * Cache helper – get, set with optional TTL (seconds)
 */
async function cacheGet(key) {
  try {
    const redis = getRedisClient();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function cacheSet(key, data, ttl = 3600) {
  try {
    const redis = getRedisClient();
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch {
    // Fail silently – cache is best-effort
  }
}

async function cacheDel(pattern) {
  try {
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  } catch {
    // Fail silently
  }
}

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel };
