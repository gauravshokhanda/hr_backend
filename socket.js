const socketIo = require("socket.io");

// Export a function that accepts the HTTP server as a parameter
module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001", // Update this to match your frontend's origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Set up Socket.io event handlers here
  io.on("connection", (socket) => {
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    // For example, you can handle attendance updates here
    socket.on("attendanceUpdate", (data) => {
      socket.emit("attendanceUpdate", data);
      console.log("Received attendance update:", data);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
    });
  });


  return io;
};
