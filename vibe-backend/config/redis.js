const Redis = require('ioredis');

/**
 * Redis client wrapper for caching and session storage.
 * Gracefully handles Redis absence by failing silently.
 */
let client = null;
let isRedisAvailable = false;

function getRedisClient() {
  if (client) return client;

  client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: times => {
      if (times > 2) return null; // Stop retrying after 2 attempts
      return 500;
    },
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });

  client.on('connect', () => {
    isRedisAvailable = true;
    console.log('Redis connected');
  });

  client.on('error', err => {
    isRedisAvailable = false;
  });

  client.on('close', () => {
    isRedisAvailable = false;
  });

  return client;
}

async function cacheGet(key) {
  try {
    if (!isRedisAvailable) return null;
    const redis = getRedisClient();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function cacheSet(key, data, ttl = 3600) {
  try {
    if (!isRedisAvailable) return;
    const redis = getRedisClient();
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch {
    // Fail silently
  }
}

async function cacheDel(pattern) {
  try {
    if (!isRedisAvailable) return;
    const redis = getRedisClient();
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  } catch {
    // Fail silently
  }
}

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDel };
