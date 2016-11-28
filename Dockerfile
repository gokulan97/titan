FROM kyma/docker-nginx
COPY nginx.conf /etc/nginx/sites-enabled/default
COPY src/ /var/www
CMD ["nginx", "-g", "daemon off;"]
