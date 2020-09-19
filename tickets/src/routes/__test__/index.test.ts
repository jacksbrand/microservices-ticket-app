import request from 'supertest';
import app from '../../app';
import { autoSignUp } from '../../test/auto-signup';

const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', autoSignUp()).send({
    title: 'The Beatles',
    price: 150,
  });
};

it('Returns a list of all available tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/tickets').send().expect(200);

  expect(res.body.length).toEqual(3);
});
