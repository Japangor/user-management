import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUser, updateUser, deleteUser } from '../../../app/controllers/userController';
import { cache } from '../../../app/middleware/cache';
import { auth } from '../../../app/middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await auth(req, res, async () => {
    switch (req.method) {
      case 'POST':
        return await createUser(req, res);
      case 'GET':
        return await getUser(req, res);
      case 'PUT':
        return await updateUser(req, res);
      case 'DELETE':
        return await deleteUser(req, res);
      default:
        res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
