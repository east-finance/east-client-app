FROM node:12-alpine as static

WORKDIR /app
COPY . /app
ARG NPM_KEY
ENV PATH /app/node_modules/.bin:${PATH}

RUN echo "//registry.npmjs.org/:_authToken=$NPM_KEY" > /root/.npmrc && \
   npm i && \
   npm run build -- --disable-source-maps

FROM nginx:stable-alpine as nginx
WORKDIR /srv/www
COPY --from=static /app/build /usr/share/nginx/html
COPY nginx-configs/nginx.conf     /etc/nginx/nginx.conf
RUN chmod -R +rwX /var/log/nginx /var/cache/nginx/ /var/run/ /usr/share/nginx/html/ && chmod -R +rX /etc/nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
