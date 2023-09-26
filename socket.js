const socketIo = require("socket.io");

// Export a function that accepts the HTTP server as a parameter
module.exports = (server) => {
  const io = socketIo(server);

  // Set up Socket.io event handlers here
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    // You can add more event handlers for your application's needs
    // For example, handling notifications as mentioned earlier.
  });

  return io;
};
