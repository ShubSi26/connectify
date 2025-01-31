FROM node:20-slim
WORKDIR /app
COPY ./backend/package.json .
COPY ./backend/package-lock.json .
RUN  npm install --only=prod
COPY ./backend/dist .
COPY ./connectify/dist ./public

CMD ["node","server.js"]

EXPOSE 3000