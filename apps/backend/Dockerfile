FROM node:21-alpine
WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN sed -i 's/"extends": "..\/..\/tsconfig.json"/"extends": ".\/tsconfig.common.json"/' tsconfig.json

CMD ["npm", "run", "start:docker"]
