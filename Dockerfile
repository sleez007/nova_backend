FROM node:12-alpine
WORKDIR /novaChatApi
COPY . .
RUN npm install 
CMD ["nodemon", "./bin/www"]