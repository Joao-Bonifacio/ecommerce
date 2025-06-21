FROM node:alpine3.20

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run db:mongo; \
    npm run db:postgres-prod; \
    npm run build 
# seed -> (tmp)
EXPOSE 8080

CMD ["npm", "run", "start"]