export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('live-chat:join', (room) => {
      socket.join(room || 'support');
    });
    socket.on('live-chat:message', (payload) => {
      const room = payload.room || 'support';
      io.to(room).emit('live-chat:message', {
        id: socket.id,
        text: payload.text,
        author: payload.author || 'Guest',
        at: new Date().toISOString(),
      });
    });
    socket.on('video-call:signal', (payload) => {
      socket.to(payload.to).emit('video-call:signal', { from: socket.id, signal: payload.signal });
    });
    socket.on('video-call:join-room', (room) => {
      socket.join(room);
      socket.to(room).emit('video-call:user-joined', { id: socket.id });
    });
  });
}
