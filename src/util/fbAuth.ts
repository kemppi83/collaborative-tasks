import { RequestHandler } from 'express';
import admin from './initAdmin';

export const FBAuth: RequestHandler = (req, res, next) => {
  let idToken: string;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(401).json({ error: 'Please login.' });
  }
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return next();
    })
    .catch(err => {
      console.error('Error while verifying token ', err);
      return res.status(401).json(err);
    });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const FBAuthSocket = async (token: string) => {
  console.log('hello from FBAuthSocket');
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (err) {
    console.error('Error while verifying token ', err);
    return err;
  }
};
