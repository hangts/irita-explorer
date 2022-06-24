FROM node:16.15.1-alpine3.16 AS builder
WORKDIR /app
COPY . .
RUN apk add make git && npm i cnpm -g  && make setup && make setup_and_build

FROM nginx:1.19-alpine
RUN echo -e 'server {\n\
    resolver kube-dns.kube-system valid=5s;\n\
    root /usr/share/nginx/html;\n\
    location ~ ^/api/(.*)$ {\n\
    proxy_pass http://$BACKEND/$1$is_args$args;\n\
    }\n\
    location ~ ^/lcd/(.*)$ {\n\
    proxy_pass http://$LCD/$1$is_args$args;\n\
    }\n\
}' > /nginx.template

COPY --from=builder /app/dist/ /usr/share/nginx/html/
CMD sh -c "envsubst '\$BACKEND,\$LCD' < /nginx.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"