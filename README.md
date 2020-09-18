# firetix

Continuing microservices work; app to buy and sell tickets between thrid party / private sellers

minikube ingress url for development purposes: _ticketing.dev_ (update /etc/hosts to point to the ip of your minikube if using).

**Services implemented:**

1. Auth:

   - Four different routes (signup/in/out/currentuser)
   - Error handling
   - Middleware for services other requiring Authorisation (may destructure out)
   - MongoDB/Mongoose (currently not persistent)
   - Automated testing of each route

---

**Working on next:**

1. Automated testing - globally
2. Front end React application
