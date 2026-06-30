# Stage 1: Build the Vite frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Copy frontend configuration files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend source code
COPY client/ ./

# Pass Vite environment variables for production build
# This embeds '/api' as the relative API prefix, which automatically
# routes REST and WebSocket traffic to the same host in Cloud Run.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the client React application (outputs to client/dist)
RUN npm run build

# Stage 2: Setup the production backend server
FROM node:20-alpine
WORKDIR /app

# Copy server configuration files
COPY server/package*.json ./server/

# Install server production dependencies
RUN cd server && npm ci --only=production

# Copy the server source code
COPY server/ ./server/

# Copy built frontend assets from Stage 1 into the server's public directory
COPY --from=frontend-builder /app/client/dist ./server/public

# Expose the API port
EXPOSE 5000

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Run the server
CMD ["node", "server/src/index.js"]
