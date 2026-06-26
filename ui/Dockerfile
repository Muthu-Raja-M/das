FROM node:20-alpine

WORKDIR /app

# Install curl for healthchecks
RUN apk add --no-cache curl

# Copy package descriptors
COPY package*.json /app/

# Install npm dependencies (using --legacy-peer-deps to avoid React 19 warnings)
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . /app/

EXPOSE 5173

# Bind to 0.0.0.0 so Vite dev server is accessible from the host system
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
