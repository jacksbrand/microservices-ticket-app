import app from './app';
import mongoose from 'mongoose';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('---AUTH--- Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('---AUTH--- listening on 3000');
  });
};

start();
