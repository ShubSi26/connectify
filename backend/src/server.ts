import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import path from 'path';

import routes from './routes/routes';
import {WS_SERVER} from './ws/ws';
import { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
  }));

app.use(cors());

const server = http.createServer(app);

WS_SERVER(server);

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, "./public")));
app.use('/api', routes);
app.use('/health', (req, res) => {
  res.status(200).send('Server is running!');
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err.message); 
  res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
  });
});

server.listen(port, () => { 
  console.log(`Server started at http://localhost:${port}`);
});
