ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine

RUN apk add --no-cache curl

WORKDIR /usr/src/app

# Copy package and package-lock.json files to workdir in the container
COPY package*.json .

# Install all the dependencies required by the app to run.
RUN npm ci

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm", "start"]
