import request from 'supertest';
import app from '../../app';
import { autoSignUp } from '../../test/auto-signup';
import { Ticket } from '../../models/ticket';

it('Properly handles the /api/tickets route', async () => {
  const res = await request(app).post('/api/tickets').send({});
  expect(res.status).not.toEqual(404);
});

it('Can only be accessed if the user is signed in', async () => {
  const res = await request(app).post('/api/tickets').send({});
  expect(res.status).toEqual(401);
});

it('Returns !401 if the user is signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', autoSignUp())
    .send({});
  expect(res.status).not.toEqual(401);
});

it('Returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', autoSignUp())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', autoSignUp())
    .send({
      price: 10,
    })
    .expect(400);
});

it('Returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', autoSignUp())
    .send({
      title: 'Justin Beiber Concert',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', autoSignUp())
    .send({
      title: 'Bluepeter live show',
    })
    .expect(400);
});

it('Creates a ticket when provided valid inputs', async () => {
  // Add in a check to make sure a ticket has been saved
  let ticketsBefore = await Ticket.find({});
  expect(ticketsBefore.length).toEqual(0);

  const title = 'Whitesnake Revival';
  const price = 100;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', autoSignUp())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketsAfter = await Ticket.find({});
  expect(ticketsAfter.length).toEqual(1);
  expect(ticketsAfter[0].title).toEqual(title);
  expect(ticketsAfter[0].price).toEqual(price);
});
