import request from 'supertest';
import app from '../../app';
import { autoSignUp } from '../../test/auto-signup';

it('responds with correct details regarding the currently logged in user', async () => {
  const cookie = await autoSignUp();

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual('test@test.com');
  expect(res.body.currentUser.id).toBeDefined;
});

it('responds with null if not authenticated', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(res.body.currentUser).toEqual(null);
});
