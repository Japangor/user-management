import { NextApiRequest, NextApiResponse } from 'next';
import { searchUsers } from '../../../controllers/userController';
import { cache } from '../../../middleware/cache';
import { auth } from '../../../middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await auth(req, res, async () => {
    switch (req.method) {
      case 'GET':
        await cache(req, res, async () => {
          return await searchUsers(req, res);
        });
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
