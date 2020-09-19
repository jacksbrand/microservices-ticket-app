import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const autoSignUp = () => {
  // Build a JWT payload. { id, email }
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: 'faketestingcookiegeneratingemail@testing.test',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session
  const session = { jwt: token };

  //  Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string that's a cookie whith the encoded data
  return [`express:sess=${base64}`];
};
