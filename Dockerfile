FROM node:8.1

WORKDIR /app/

COPY . .

RUN npm i --quiet

CMD ["npm", "start"]
