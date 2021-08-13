import { validateSignUpData, validateLoginData, validateMessage } from './validators';

describe('function validateSignUpData', () => {
  test('should return error if missing SignUpData', () => {
    const validate = validateSignUpData({
      email: '',
      password: '',
      confirmPassword: '',
    });
    expect(validate.valid).toBeFalsy();
    expect(Object.keys(validate.errors!).length).toBe(2);
  });
  test('should return error if bad SignUpData', () => {
    const validate = validateSignUpData({
      email: 'hello',
      password: '1234',
      confirmPassword: '123456',
    });
    expect(validate.valid).toBeFalsy();
    expect(Object.keys(validate.errors!).length).toBe(2);
  });
  test('should return without errors if correct signup data', () => {
    const validate = validateSignUpData({
      email: 'hello@example.com',
      password: '123456',
      confirmPassword: '123456',
    });
    expect(validate.valid).toBeTruthy();
  });
});

describe('function validateLoginData', () => {
  test('should return error if missing LoginData', () => {
    const validate = validateLoginData({
      email: '',
      password: '',
    });
    expect(validate.valid).toBeFalsy();
    expect(Object.keys(validate.errors!).length).toBe(2);
  });
  test('should return error if bad LoginData', () => {
    const validate = validateLoginData({
      email: 'hello',
      password: '123456',
    });
    console.log(validate);
    expect(validate.valid).toBeFalsy();
    expect(Object.keys(validate.errors!).length).toBe(1);
  });
  test('should return without errors if correct signup data', () => {
    const validate = validateLoginData({
      email: 'hello@example.com',
      password: '123456',
    });
    expect(validate.valid).toBeTruthy();
  });
});

describe('function validateMessage', () => {
  test('should return errors if missing fields', () => {
    const validate = validateMessage({
      to: '',
      from: '',
      subject: '',
      text: '',
    });
    expect(validate.valid).toBeFalsy();
    expect(Object.keys(validate.errors!).length).toBe(4);
  });
  test('should return errors if not valid email addresses', () => {
    const validate = validateMessage({
      to: 'hello',
      from: 'hey',
      subject: 'Hello',
      text: 'World!',
    });
    expect(validate.valid).toBeFalsy();
    expect(Object.keys(validate.errors!).length).toBe(2);
  });
  test('should not return errors if valid message', () => {
    const validate = validateMessage({
      to: 'hello@example.com',
      from: 'world.2@example.com',
      subject: 'Hello',
      text: 'World!',
    });
    expect(validate.valid).toBeTruthy();
    expect(Object.keys(validate.errors!).length).toBe(0);
  });
});
