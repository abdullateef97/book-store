FROM node:18

WORKDIR /src

COPY ./package.json ./
RUN npm install
COPY . .

RUN npm run build
RUN npm run migrate

EXPOSE 3000

# CMD npm start
CMD [ "ts-node", "src/index.ts" ]