FROM node:20-slim
WORKDIR /app
COPY ./backend/package.json .
COPY ./backend/package-lock.json .
RUN  npm install --only=prod
COPY ./backend/dist .
COPY ./connectify/dist ./public

EXPOSE 3000

CMD ["node","server.js"]