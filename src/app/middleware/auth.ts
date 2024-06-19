import jwt, { GetPublicKeyOrSecret, Secret, JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

interface CustomNextApiRequest extends NextApiRequest {
  userId?: string;
}

export function auth(req: CustomNextApiRequest, res: NextApiResponse, next: () => void) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwtSecret: Secret | GetPublicKeyOrSecret = process.env.JWT_SECRET || '';
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (typeof decoded === 'object' && 'id' in decoded) {
      req.userId = decoded.id as string;
    } else {
      throw new Error('Invalid token payload');
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
