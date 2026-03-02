# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source code
COPY . .

#Arpan's Debugger
RUN ls -la src/components/

# Build the application (Vite/React)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install 'serve' to host the static build
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# App listens on 5000
EXPOSE 5000

# Simple health check using wget (more reliable in alpine)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

# Start the app
CMD ["serve", "-s", "dist", "-l", "5000", "-n"]
