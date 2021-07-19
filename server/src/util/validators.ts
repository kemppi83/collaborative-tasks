interface SignUpData {
  email: string,
  password: string,
  confirmPassword: string,
  handle: string,
}

interface LoginData {
  email: string,
  password: string,
}

interface LoginErrors {
  email?: string,
  password?: string,
  confirmPassword?: string,
  handle?: string,
}

interface ValidationResponse {
  valid: boolean,
  errors?: LoginErrors,
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
  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

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
