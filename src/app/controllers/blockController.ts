import { NextApiRequest, NextApiResponse } from 'next';
import User from '../models/User';
import dbConnect from '../utils/dbConnect';

export async function blockUser(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.ignoredUsers.includes(id)) {
      return res.status(400).json({ message: 'User already blocked' });
    }

    user.ignoredUsers.push(id);
    await user.save();

    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function unblockUser(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.ignoredUsers.includes(id)) {
      return res.status(400).json({ message: 'User not blocked' });
    }

    user.ignoredUsers = user.ignoredUsers.filter(blockedId => blockedId.toString() !== id);
    await user.save();

    res.status(200).json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
