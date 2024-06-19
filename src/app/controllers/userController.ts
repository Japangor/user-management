import { NextApiRequest, NextApiResponse } from 'next';
import User from '../models/User';
import dbConnect from '../utils/dbConnect';

export async function createUser(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getUser(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function searchUsers(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { username, minAge, maxAge } = req.query;
  const currentYear = new Date().getFullYear();
  let query: any = {};

  if (username) {
    query = { ...query, username: new RegExp(username as string, 'i') };
  }

  if (minAge || maxAge) {
    const minDate = minAge ? new Date(currentYear - Number(minAge), 0, 1) : null;
    const maxDate = maxAge ? new Date(currentYear - Number(maxAge), 11, 31) : null;
    query = {
      ...query,
      birthdate: { ...(minDate && { $gte: minDate }), ...(maxDate && { $lte: maxDate }) }
    };
  }

  try {
    const users = await User.find(query);
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
