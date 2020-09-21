import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import { autoSignUp } from '../../test/auto-signup';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('Returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', autoSignUp())
    .send({
      title: 'Mick Gordon',
      price: 49.99,
    })
    .expect(404);
});

it('Returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Mick Gordon',
      price: 49.99,
    })
    .expect(401);
});

it('Returns a 401 if the user does not own the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', autoSignUp())
    .send({
      title: 'Mozart',
      price: 500,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', autoSignUp()) //Cookie is randomly generated so will appear as a new user
    .send({
      title: 'Beethoven',
      price: 499.99,
    })
    .expect(401);
});

it('Returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = autoSignUp();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'The Rolling Stones',
      price: 500,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 50,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: "You Can't Always Get What You Want",
      price: -10,
    })
    .expect(400);
});

it('Updates the ticket, provided valid inputs', async () => {
  const cookie = autoSignUp();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Electric Light Orchestra',
      price: 99.95,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'The Faces',
      price: 99.99,
    })
    .expect(200);

  const ticket = await request(app).get(`/api/tickets/${res.body.id}`).send();

  expect(ticket.body.title).toEqual('The Faces');
  expect(ticket.body.price).toEqual(99.99);
});

it('Publishes an Event', async () => {
  const cookie = autoSignUp();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Electric Light Orchestra',
      price: 99.95,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'The Faces',
      price: 99.99,
    })
    .expect(200);

  expect(natsWrapper.sc.publish).toHaveBeenCalled();
});
