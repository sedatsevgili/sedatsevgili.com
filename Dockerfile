FROM node:latest

# copy app and install deps
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install --save

EXPOSE 3000
CMD [ "npm", "start" ]