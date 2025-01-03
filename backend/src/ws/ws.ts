import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import * as http from 'http';
import {verifyToken} from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import {decode} from 'jsonwebtoken';

export const userSocket = new Map<String, WebSocket>();

export function WS_SERVER(server: http.Server) {

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {

      const cookies = req.headers.cookie;

      if(!cookies){
        ws.close(1000, 'No token provided');
        return;
      }
      const token = cookies.split('=')[1];

      if(!token){
        ws.close(1000, 'No token provided');
        return;
      }
      try{
        const decoded = verifyToken(token) as JwtPayload;
        userSocket[decoded.id] = ws;
      }catch(err){
        ws.close(1000, 'Invalid token, Unauthorized');
        return;
      }
      const id = decode(token) as JwtPayload;
        console.log('Client connected');

        ws.on('message', (message: WebSocket.Data) => {
           
          const data = JSON.parse(message.toString());
          const { type, userId } = data;

          console.log(data);

          if(type === 'offer'){
            const socket = userSocket[userId];

            if(socket){
              socket.send(JSON.stringify({ type: 'offer', offer: data.offer,userId:id.id, name: data.name }));
            }else{
              ws.send(JSON.stringify({ type: 'call-rejected',message:'User is offline', userId:id.id }));
            }
          }

          if(type === 'answer'){
            const socket = userSocket[userId];
            if(socket){
              socket.send(JSON.stringify({ type: 'answer', answer: data.answer,userId:id.id }));
            }
          }

          if(type === 'ICEcandidate'){
            const socket = userSocket[userId];
            console.log(data)
            if(socket){
              socket.send(JSON.stringify({ type: 'ICEcandidate', candidate: data.candidate,userId:id.id }));
            }
          }

          if(type === 'call-rejected'){
            const socket = userSocket[userId];
            if(socket){
              socket.send(JSON.stringify({ type: 'call-rejected', userId:id.id }));
            }
          }

          if(type === 'call-ended'){
            const socket = userSocket[userId];
            if(socket){
              socket.send(JSON.stringify({ type: 'call-ended', userId:id.id }));
            }
          }

    });
        ws.on('close', () => {
          userSocket.delete(id.id);
        });
    });
}
