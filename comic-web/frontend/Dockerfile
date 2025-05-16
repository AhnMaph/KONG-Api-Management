# Sử dụng Node.js Alpine image nhỏ gọn
FROM node:20

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file cấu hình package
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy phần còn lại của source code
COPY . .
EXPOSE 5174
# Chạy dev server (Vite, React, Next.js...)
CMD ["npm", "run", "dev"]
