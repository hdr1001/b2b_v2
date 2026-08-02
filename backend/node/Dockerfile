FROM node:24.18-trixie

# App directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install the dependencies (incl.dev)
RUN npm ci

# Deliver source code
COPY ./src ./src

USER node

# Start application
CMD [ "npm", "run", "dkrdev" ]
