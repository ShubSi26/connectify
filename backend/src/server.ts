import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';

import routes from './routes/routes';
import {WS_SERVER} from './ws/ws';
import { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
  }));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

app.use('/api', routes);
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err.message); 
  res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
  });
});

const server = http.createServer(app);
WS_SERVER(server);

server.listen(port, () => { 
  console.log(`Server started at http://localhost:${port}`);
});

