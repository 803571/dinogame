import { CLIENT_VERSION } from "../constants.js";
import { createStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js"
import handlerMapping from "./handlerMapping.js";

export const handleConnection = (socket, userUUID) => {
    console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
    console.log('Current users:', getUser());
  
    // 스테이지 빈 배열 생성
    createStage(userUUID);
  
    socket.emit('connection', { uuid: userUUID });
  };
  
  export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id); // 사용자 삭제
    console.log(`User disconnected: ${socket.id}`);
    console.log('Current users:', getUser());
  };
  
  export const handleEvent = (io, socket, data) => {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
      socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
      return;
    }
  
    const handler = handlerMapping[data.handlerId];
    if (!handler) {
      socket.emit('response', { status: 'fail', message: 'Handler not found' });
      return;
    }
  
    const response = handler(data.userId, data.payload);
    if (response.broadcast) {
      io.emit('response', response);
      return;
    }
    socket.emit('response', response);
  };