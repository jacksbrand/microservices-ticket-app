import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@jackswebbrand-firetix/common';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.patch(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (req.currentUser?.id !== order.userId) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.sc).publish({
      id: order.id,
      version: order.ticket.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.send(order);
  }
);

export { router as patchOrderRouter };
