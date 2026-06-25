FROM node:24-alpine3.24

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

EXPOSE ${8088}

# Start application
CMD [ "npm", "run", "dkrprod" ]
