#Take the Tomcat-9 image which supports AdoptOpenJDK
FROM node:16

WORKDIR /user/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000

#CMD ["npm", "run","devStart"]

CMD ["node", "index.js"]
