import { Redis } from "@upstash/redis";
import { ServerConfigError } from "./errors";

let redisClient: Redis | null = null;

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new ServerConfigError();
  }

  return { url, token };
}

export function getRedis() {
  if (!redisClient) {
    redisClient = new Redis(getRedisConfig());
  }

  return redisClient;
}

export async function generateId(counterKey: string): Promise<number> {
  return await getRedis().incr(counterKey);
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
