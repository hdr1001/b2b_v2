FROM node:24-alpine

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

# App directory
WORKDIR /usr/src/app/

# Install app dependencies
COPY package*.json .
RUN npm ci
# RUN npm ci --omit=dev

# Deliver source code
COPY . .

# Start application
CMD [ "npm", "run", "dkrprod" ]
