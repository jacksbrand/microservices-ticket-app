import { Payment } from '../models/payment';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@jackswebbrand-firetix/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage('no token supplied - cannot proceed'),
    body('orderId').not().isEmpty().withMessage('Please supply an orderId'),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has expired - please make a new order');
    }

    const charge = await stripe.charges.create({
      currency: 'gbp',
      amount: order.price * 100, //Stripe uses the smallest currency value, firetix uses pounds / pence
      source: token,
    });

    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.sc).publish({
      orderId: payment.orderId,
      stripeId: payment.stripeId,
      id: payment.id,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
