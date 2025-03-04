# Use the official Node.js image to build the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Ensure required dependencies are installed
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object @testing-library/dom

# Copy the entire frontend project
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the React app
FROM nginx:alpine

# Copy build files to the default Nginx public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (not 3000)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
