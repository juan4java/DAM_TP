FROM node:18

WORKDIR /src/frontend/dam

COPY package.json ./
RUN rm -rf ./package-lock.json && npm install -g @ionic/cli @angular-devkit/build-angular && npm install --save highcharts

EXPOSE 8100