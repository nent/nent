FROM steebchen/nginx-spa:stable

COPY docs/ /app

EXPOSE 80

CMD ["nginx"]
