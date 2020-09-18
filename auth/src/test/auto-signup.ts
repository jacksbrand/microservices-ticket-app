import request from 'supertest';
import app from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      autoSignUp(): Promise<string[]>;
    }
  }
}

export const autoSignUp = async () => {
  const email = 'test@test.com';
  const password = 'apple';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: email,
      password: password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
