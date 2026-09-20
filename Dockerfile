# Production Dockerfile for the React (Vite) frontend.
# Multi-stage build: compile static assets with Node, then serve them with Nginx.
#
# Build: docker build -t fullstack-frontend --build-arg VITE_API_URL=http://your-backend-host:3000 .
# Run:   docker run -d -p 8080:80 --name frontend fullstack-frontend
#
# Note: Vite bakes VITE_API_URL into the static JS at BUILD time (this is a
# static single-page app, there's no server to read env vars from at runtime).
# If the backend's public URL changes, rebuild this image with a new build-arg.

FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
