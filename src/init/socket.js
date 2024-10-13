import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';


// Server as SocketIO는 서버를 갖고 올건데 이름이 SocketIO다 ~ 그런의미라고

const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);

  registerHandler(io);
};

export default initSocket;
