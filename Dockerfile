# ==============================================================================
# Build Stage: Compile TypeScript and Vite Production Assets
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm ci

# Copy application source code
COPY . .

# Environment variable default for production build
ENV VITE_API_BASE_URL=/api/v1

# Build production bundle
RUN npm run build

# ==============================================================================
# Runtime Stage: High Performance Nginx Static Server & Reverse Proxy
# ==============================================================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built production assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx web server
CMD ["nginx", "-g", "daemon off;"]
