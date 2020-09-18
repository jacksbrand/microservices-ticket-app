# firetix

Continuing microservices work; app to buy and sell tickets between thrid party / private sellers

minikube ingress url for development purposes: _ticketing.dev_ (update /etc/hosts to point to the ip of your minikube if using).

**Services implemented:**

1. Auth:

   - Signup/in/out/currentuser
   - Error handling
   - Middleware for services other requiring Authorisation (may destructure out)
   - MongoDB/Mongoose (currently not persistent)

---

**Working on next:**

1. Automated testing
2. Front end React application
