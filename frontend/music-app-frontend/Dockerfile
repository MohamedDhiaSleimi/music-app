# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Accept build arguments (from docker-compose or command line)
ARG VITE_API_BASE_URL
ARG VITE_OAUTH_GOOGLE_URL

# Make them available during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_OAUTH_GOOGLE_URL=$VITE_OAUTH_GOOGLE_URL

# Build with these environment variables baked in
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]