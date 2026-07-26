FROM node:24.18-trixie

# App directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json .

RUN npm ci --production
# RUN npm ci --omit=dev

# Deliver source code
COPY ./src .

USER node

# Start application
CMD [ "npm", "run", "dkrprod" ]
