import request from 'supertest';
import app from '../../app';
import { Ticket } from '../../models/ticket';
import { autoSignUp } from '../../test/auto-signup';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('changes the status code of an order, on request from an authorised user', async () => {
  //  Make a ticket
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'apples',
    price: 40,
  });
  await ticket.save();

  const user = autoSignUp();

  // Create an order
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Cancel the order
  const order = await Order.findById(res.body.id);

  await request(app)
    .patch(`/api/orders/${order!.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  const patchedOrder = await Order.findById(order);

  // Check that the status code is cancelled
  expect(patchedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  //  Make a ticket
  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'apples',
    price: 40,
  });
  await ticket.save();

  const user = autoSignUp();

  // Create an order
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // Cancel the order
  const order = await Order.findById(res.body.id);

  await request(app)
    .patch(`/api/orders/${order!.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(natsWrapper.sc.publish).toHaveBeenCalled();
});
