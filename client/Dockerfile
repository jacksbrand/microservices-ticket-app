FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
RUN npx next telemetry disable
COPY . .

CMD ["npm", "run", "dev"]