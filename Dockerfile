# ---- Build Stage ----
FROM node:22-alpine AS builder

# Install rsync and bash
RUN apk add --no-cache bash rsync

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app's source code
COPY . ./

# Build the application
RUN npm run build

# ---- Run Stage ----
FROM node:22-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy build files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the listening port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]