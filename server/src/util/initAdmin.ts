import * as admin from 'firebase-admin';
import { adminConfig } from '../util/config';

admin.initializeApp({
  credential: admin.credential.cert(adminConfig)
});

export default admin;
