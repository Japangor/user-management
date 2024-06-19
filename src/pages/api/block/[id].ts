import { NextApiRequest, NextApiResponse } from 'next';
import { blockUser, unblockUser } from '../../../controllers/blockController';
import { auth } from '../../../middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await auth(req, res, async () => {
    switch (req.method) {
      case 'POST':
        return await blockUser(req, res);
      case 'DELETE':
        return await unblockUser(req, res);
      default:
        res.setHeader('Allow', ['POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
