# 使用官方 Nginx 镜像
FROM nginx:stable-alpine

# 将构建好的 dist 目录复制到 Nginx 容器中的 /usr/share/nginx/html 目录
COPY dist/ /usr/share/nginx/html/

# 使用自定义的 Nginx 配置文件，如果你有的话
# COPY nginx.conf /etc/nginx/nginx.conf