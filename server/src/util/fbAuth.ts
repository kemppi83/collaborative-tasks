import { RequestHandler } from 'express';
import * as admin from 'firebase-admin';
import { adminConfig } from '../util/config';

admin.initializeApp({
  credential: admin.credential.cert(adminConfig)
});

export const FBAuth: RequestHandler = (req, res, next) => {
  let idToken: string;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      console.log(decodedToken);
      return next();
    })
    .catch(err => {
      console.error('Error while verifying token ', err);
      return res.status(403).json(err);
    });
};