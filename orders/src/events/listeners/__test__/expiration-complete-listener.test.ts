import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import mongoose from 'mongoose';
import {
  OrderStatus,
  ExpirationCompleteEvent,
} from '@jackswebbrand-firetix/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.sc);

  const ticket = Ticket.build({
    title: 'apples',
    price: 23,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  const order = Order.build({
    userId: '123',
    expiresAt: new Date(),
    ticket: ticket,
    status: OrderStatus.Created,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits and OrderCancelledEvent', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.sc.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.sc.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
