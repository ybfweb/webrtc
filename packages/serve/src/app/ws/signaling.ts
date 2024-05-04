import { Server, Socket } from 'socket.io';
import { namespace } from "../../config/namespace";

/*
export const initSignalServe = (ioIns: any) => {
  const io = ioIns.of(namespace.SIGNALING);
  io.on('connection', (socket: any) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}
*/
/**
 * 1.等待链接
 * 2.链接接入时获取用信息，判断用户是否存在，保存用户信息
 * 3.事件处理，直接转发给房间中除了自己的所有其他人
 */

export class SignalServe {
  private Io: any;
  private namespace: string = namespace.SIGNALING;
  // private userList: {
  //   userId: string | number,
  //   userName:
  // } = [];
  constructor(ioIns: Server) {
    this.Io = ioIns.of(this.namespace);
    this.Io.on('connection', (socket: Socket) => {
      socket.onAny((event, data)=> {
        socket.broadcast.emit(event, data);
      });
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }
  getAllClient() {
    return this.Io.fetchSockets();
  }
  getUserId(socket: Socket) {
    return socket.handshake.query.userId;
  }
  getUsername(socket: Socket) {
    return socket.handshake.query.username;
  }
}