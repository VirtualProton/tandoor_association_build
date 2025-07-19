# Use latest Node.js LTS
FROM node:20-alpine

# Install dependencies for node-gyp (python3, make, g++, etc.)
RUN apk add --no-cache python3 make g++ 

# Use latest Node.js LTS
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# If using Prisma, generate the client
RUN npx prisma generate

# Build the application
EXPOSE 3100

# Start the application
CMD [ "npm", "start" ]  
