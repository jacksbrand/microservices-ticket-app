import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { autoSignUp } from '../../test/auto-signup';
import mongoose from 'mongoose';

it('fetches the order', async () => {
  // Make ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 500,
  });
  await ticket.save();

  const user = autoSignUp();

  // build order with the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.ticket.id).toEqual(ticket.id);
});

it('only allows a user to access their own order', async () => {
  // Make ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 500,
  });
  await ticket.save();

  const user = autoSignUp();

  // build order with the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const notAuthorisedUser = autoSignUp();
  // make a request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', notAuthorisedUser)
    .send()
    .expect(401);
});
