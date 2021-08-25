import { RequestHandler } from 'express';
import firebase from 'firebase';
// import sgMail from '@sendgrid/mail';
import { firebaseConfig } from '../util/config';
import { validateSignUpData, validateLoginData } from '../util/validators';
import admin from '../util/initAdmin';
import { sendEmail } from '../util/sendEmail';
import User from '../db/models/users';

// URL you want to redirect back to. The domain (www.example.com) for
// this URL must be whitelisted in the Firebase Console.
const actionCodeSettings = { 
  ...(process.env.NODE_ENV === 'development'
  ? { url: `${process.env.FRONTEND_URL_DEV}/login` }
  : { url: `${process.env.FRONTEND_URL_PROD}/login` }),
};

firebase.initializeApp(firebaseConfig);

export const signUp: RequestHandler = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return res.status(400).json(errors);

  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      User.create({
        uid: data.user?.uid,
        username: req.body.username,
        email: data.user?.email
      });
      return data.user?.getIdToken();
    })
    .then(token => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
    });
};

export const login: RequestHandler = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  // console.log(req.body);
  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user?.getIdToken();
    })
    .then(token => {
      return res.json({ user, token, });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res.status(403).json({ general: 'Wrong credentials, please try again'});
      }
      return res.status(500).json({ error: err.message });
    });
};

export const resetPassword: RequestHandler = (req, res) => {
  // Admin SDK API to generate the password reset link.
  const userEmail = req.body.email;
  // console.log(userEmail);
  admin
    .auth()
    .generatePasswordResetLink(userEmail, actionCodeSettings)
    .then((link) => {
      // Construct password reset email template, embed the link and send
      // using custom SMTP server.
      const msg = {
        to: userEmail,
        ...(process.env.SERVICE_EMAIL ? { from: process.env.SERVICE_EMAIL } : { from: '' }),
        subject: 'Password reset',
        text: `Hello! You have requested to recover your password. You can reset it by following the link: ${link}`,
        html: `<p>Hello! You have requested to recover your password. You can reset it by following the link: ${link}</p>`,
      };
      sendEmail(msg);
      res.json({ message: 'Password recovery email sent.' });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/invalid-email') {
        return res.status(403).json({ general: err.message});
      }
      if (err.code === 'auth/email-not-found') {
        return res.status(404).json({ general: err.message});
      }
      res.status(500).json({ err });
    });
};

export const verifyToken:RequestHandler = (req, res) => {
  const user = {
    username: req.user.email,
    email: req.user.email,
  };
  res.status(200).json({ user, ...(req.headers.authorization && { token: req.headers.authorization.split('Bearer ')[1] }) });
};
