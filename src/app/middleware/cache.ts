import redis from 'redis';
import { NextApiRequest, NextApiResponse } from 'next';

const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

export async function cache(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const { url } = req;

  const cachedData = await client.get(url);
  if (cachedData) {
    res.status(200).json(JSON.parse(cachedData));
    return;
  }
  
  res.sendResponse = res.json;
  res.json = (body) => {
    client.set(url, JSON.stringify(body), 'EX', 60 * 60); // Cache for 1 hour
    res.sendResponse(body);
  };

  next();
}
