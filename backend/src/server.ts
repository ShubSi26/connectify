import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import routes from './routes/routes';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
  }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

