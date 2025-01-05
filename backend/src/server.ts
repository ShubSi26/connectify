import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import routes from './routes/routes';
import {WS_SERVER} from './ws/ws';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'https://project-connectify.onrender.com', 
    credentials: true 
  }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

const server = http.createServer(app);
WS_SERVER(server);

server.listen(port, () => { 
  console.log(`Server started at http://localhost:${port}`);
});

