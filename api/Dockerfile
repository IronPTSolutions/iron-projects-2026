FROM node:25-alpine

WORKDIR /app

COPY package* /app/
RUN npm install --omit=dev

COPY . /app/

CMD ["npm", "start"]