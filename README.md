# 🔥 firetix 🎫

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

3. Client:

   - Next.js / React serverside rendering, in keeping with microservices theme
   - Simple route / error handling for all auth routes

---

**Working on next:**

1. Automated testing - globally
2. NATS Streaming Service integration and deployment
