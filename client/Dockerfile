FROM node:alpine
ENV CI=true

WORKDIR /app
COPY package.json .
RUN npm install

COPY . .

RUN npx next telemetry disable

CMD ["npm", "run", "dev"]