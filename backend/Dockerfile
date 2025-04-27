# Sử dụng Node.js phiên bản LTS
FROM node:18-alpine # Dùng bản Alpine nhẹ hơn

# Thiết lập thư mục làm việc
WORKDIR /app

# 1. Sao chép package files trước
COPY package*.json ./

# 2. Cài đặt dependencies
RUN npm install

# 3. Sao chép toàn bộ mã nguồn
COPY . .

# 4. Chạy build step
RUN npm run build

# Mở cổng ứng dụng sẽ chạy
EXPOSE 5000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "start"]