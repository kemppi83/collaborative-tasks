import { RequestHandler } from 'express';

export const test:RequestHandler = (req, res) => {
  res.status(200).json({ message: 'Hello' });
};
