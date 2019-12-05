FROM node:10

COPY . /opt/app-root/src/

WORKDIR /opt/app-root/src/
RUN npm install
RUN npm install -g nodemon

EXPOSE 8080
CMD node app.js

