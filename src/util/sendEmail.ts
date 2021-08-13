import sgMail from '@sendgrid/mail';
import { Message, validateMessage } from './validators';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendEmail = (msg:Message):void => {
  // Validation logic added in case sendEmail.ts is re-used elsewhere
  const { valid, errors } = validateMessage(msg);
  if (!valid && errors) throw new Error(Object.values(errors).join());
  sgMail
    .send(msg)
    .then(() => {
      console.log(`Password recovery email sent to ${msg.to}`);
    })
    .catch((error: Error) => {
      return(error);
    });
};
