FROM node:alpine3.20

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate --schema=prisma/mongo.schema.prisma; \
    npx prisma generate --schema=prisma/postgres.schema.prisma; \
    npx prisma migrate prod --schema=prisma/postgres.schema.prisma; \
    npx prisma db push --schema=prisma/mongo.schema.prisma; \
    npm run build 

EXPOSE 8080

CMD ["npm", "run", "start"]