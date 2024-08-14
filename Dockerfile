# 使用Node.js官方镜像作为基础镜像
FROM node:16 AS build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json文件到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有源代码到工作目录
COPY . .

# 构建Vue.js应用
RUN npm run build

# 使用alpine作为基础镜像
FROM alpine:3.16 AS deploy

# 创建目录并复制构建好的文件
WORKDIR /dist
COPY --from=build /app/dist /dist
