# Base Node.js image
FROM node:18-alpine
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the application code
COPY . .
# Expose the application port
EXPOSE 3030
# Command to run the application
CMD ["node", "index.js"]