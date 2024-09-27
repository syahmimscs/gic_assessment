# Use an official node image as the base
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the development port (React typically runs on 3000 in dev mode)
EXPOSE 5173

# Start the app in development mode (using npm run dev)
CMD ["npm", "run", "dev"]
