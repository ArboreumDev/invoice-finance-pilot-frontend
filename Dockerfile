FROM nginx:1.21

COPY /out/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf