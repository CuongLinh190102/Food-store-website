# Sử dụng Node.js phiên bản LTS
FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]