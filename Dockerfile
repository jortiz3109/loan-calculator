FROM node:22-alpine AS build

ARG BASE=/

# Build stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --base="$BASE"

# Serve stage
FROM nginx:alpine AS serve
LABEL maintainer="John Edisson Ortiz"
LABEL email="me@johndev.co" 
LABEL org.opencontainers.image.description="A Colombian credit/loan calculator with amortization schedules" 
LABEL org.opencontainers.image.title="loan-calculator" 
LABEL org.opencontainers.image.vendor="John Edisson Ortiz <j.ortiz3109@gmail.com>" 
LABEL org.opencontainers.image.source="https://github.com/jortiz3109/loan-calculator"
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]