import app from './app';
import mongoose from 'mongoose';

const start = async () => {
  console.log('testing docker push github action');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
