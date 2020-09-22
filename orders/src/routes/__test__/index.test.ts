import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { autoSignUp } from '../../test/auto-signup';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for a particulat user', async () => {
  // Make three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = autoSignUp();
  const userTwo = autoSignUp();

  // Make one order a user 1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Make two orders for user 2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Recover tickets/orders for user 2 - expecting not to receive user 1's tickets
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[1].id).toEqual(orderTwo.id);
  expect(res.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(res.body[1].ticket.id).toEqual(ticketThree.id);
});
