# frontend/Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]
