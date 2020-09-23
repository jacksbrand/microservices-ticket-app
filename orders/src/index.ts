import app from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is not defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is not defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is not defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.sc.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.sc.close());
    process.on('SIGTERM', () => natsWrapper.sc.close());

    new TicketCreatedListener(natsWrapper.sc).listen();
    new TicketUpdatedListener(natsWrapper.sc).listen();
    new ExpirationCompleteListener(natsWrapper.sc).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('---ORDERS--- Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('---ORDERS--- listening on 3000');
  });
};

start();
