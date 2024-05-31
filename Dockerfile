# 使用 Node.js 官方镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 将 package.json 和 yarn.lock 复制到工作目录
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制项目文件到工作目录（注意 .dockerignore 文件）
COPY . .

# 构建项目
RUN yarn build

# 使用 Nginx 镜像作为基础镜像
FROM nginx:stable-alpine

# 将构建产物复制到 Nginx 中
COPY --from=0 /app/dist /usr/share/nginx/html

# 修改默认配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]