FROM node
# RUN apk add --update nodejs
WORKDIR /usr/src/shopping
COPY package*.json ./
RUN pwd
RUN ls -a
RUN node -v
RUN npm -v
RUN npm install
COPY . .
EXPOSE 3000
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

CMD /wait && npm start
# CMD npm start