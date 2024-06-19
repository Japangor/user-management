import { NextApiRequest, NextApiResponse } from 'next';
import { getUser, updateUser, deleteUser } from '../../../controllers/userController';
import { auth } from '../../../middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await auth(req, res, async () => {
    switch (req.method) {
      case 'GET':
        return await getUser(req, res);
      case 'PUT':
        return await updateUser(req, res);
      case 'DELETE':
        return await deleteUser(req, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
