FROM node:10.13.0-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM nginx:1.23.3 as prod
EXPOSE 80
COPY --from=builder /app/dist/autogestion-frontend-master /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
CMD ["nginx","-g","daemon off;"]
