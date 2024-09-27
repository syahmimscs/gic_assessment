# Use an official node image as the base
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend for production
RUN npm run build

# Install a simple static file server to serve the build directory
RUN npm install -g serve

# Expose the frontend port (React typically runs on 3000)
EXPOSE 3000

# Serve the static build files
CMD ["serve", "-s", "build", "-l", "3000"]