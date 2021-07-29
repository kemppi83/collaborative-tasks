import app from '../app';
import supertest from 'supertest';

const request = supertest(app);

describe('/signup tests', () => {
  test('should return error if user already exists (same email)', async () => {
    await request
      .post('/api/signup')
      .set('Accept', 'application/json')
      .send({
        "email": "testuser@email.com",
        "password": "123456",
        "confirmPassword": "123456"
      })
      .expect('Content-type', /json/)
      .expect(400);
  });
});
