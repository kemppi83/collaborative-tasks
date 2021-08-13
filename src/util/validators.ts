export interface SignUpData {
  email: string,
  password: string,
  confirmPassword: string,
}

export interface LoginData {
  email: string,
  password: string,
}

export interface Message {
  to: string,
  from: string,
  subject: string,
  text: string,
  html?: string,
}

interface LoginErrors {
  email?: string,
  password?: string,
  confirmPassword?: string,
}

interface MessageErrors {
  to?: string,
  from?: string,
  subject?: string,
  text?: string,
}

interface ValidationResponse {
  valid: boolean,
  errors?: LoginErrors|MessageErrors,
}

const isEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  return false;
};

const isEmpty = (input: string) => {
  if (input.trim() === '') return true;
  return false;
};

export const validateSignUpData = (data: SignUpData): ValidationResponse => {
  const errors: LoginErrors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match';

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

export const validateLoginData = (data: LoginData): ValidationResponse => {
  const errors: LoginErrors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

export const validateMessage = (msg: Message): ValidationResponse => {
  const errors: MessageErrors = {};

  if (isEmpty(msg.to)) {
    errors.to = "'to' field must not be empty";
  } else if (!isEmail(msg.to)) {
    errors.to = "'to' must be a valid email address";
  }

  if (isEmpty(msg.from)) {
    errors.from = "'from' field must not be empty";
  } else if (!isEmail(msg.from)) {
    errors.from = "'from' must be a valid email address";
  }

  if (isEmpty(msg.subject)) errors.subject = "'subject' field must not be empty";
  if (isEmpty(msg.text)) errors.text = "'text' field must not be empty";
  
  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};
