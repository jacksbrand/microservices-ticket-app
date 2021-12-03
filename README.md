# 🔥 Microservice testing by making a ticket app (NATS) 🎫

Continuing microservices work; app to buy and sell tickets between thrid party / private sellers

> minikube ingress url for development purposes: _ticketing.dev_ (update /etc/hosts to point to the ip of your minikube, if using).
> The 'common' module is npm published to @jackswebbrand-firetix/common

**Services implemented:**

1. Auth:

   - Four different routes (signup/in/out/currentuser)
   - Error handling
   - Middleware for services other requiring Authorisation (destructured out to common module)
   - MongoDB/Mongoose (currently not persistent)
   - Automated testing of each route

2. Tickets:

   - Create/read/update/destroy tickets service with mongodb
   - Error handling and middleware implemented - developed using a testing first approach
   - Automated testing for expected scenarios

3. Orders:

   - Create/read/delete with mongodb
   - Establish order conditions (including if the order has been cancelled)
   - Has it's own copy of the tickets database.
   - Automated testing

4. Expiration:

   - Ticket expiration designed to time out orders that are not fullfiled, or otherwise left incomplete.
   - Using Bull and Redis to manage 'expiration:complete' events. Final delay will be set to 10 minutes.

5. Payments

   - Stripe and react-stripe-checkout
   - logging of all orders

6. NATS:

   - Handle incoming and outgoing events in realtime; keeping all other services informed of application state.
   - Safety features to protect against information loss due to downtime.

7. Client:

   - Next.js / React serverside rendering, in keeping with microservices theme.
   - Simple in design and functionality - main purpose of the client is to allow easy interaction / demonstration of the backend services listed above.

---

**Working on next:**

1. Deployment strategies; hosting, CICD etc
