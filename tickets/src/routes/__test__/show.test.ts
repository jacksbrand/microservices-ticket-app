import request from 'supertest';
import app from '../../app';
import { autoSignUp } from '../../test/auto-signup';
import mongoose from 'mongoose';

it('Returns 404 if the searched for ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('Returns a ticket if one is found, matching the search criteria', async () => {
  const title = "Guns 'n'  Roses";
  const price = 55;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', autoSignUp())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});
