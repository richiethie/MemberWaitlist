const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174", "http://localhost:5173"], // Your frontend URLs
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let members = []; // Store active waitlist members

app.post("/check-in", (req, res) => {
    const { member } = req.body;
  
    if (!member || !member._id) {
      return res.status(400).json({ error: "Invalid member data" });
    }

    // Add a timestamp to the member object
    const checkInTime = new Date().toISOString();
    const memberWithTime = { ...member, checkInTime };

    // Add member to the waitlist
    members.push(memberWithTime);

    // Notify all connected clients via WebSockets
    io.emit("memberCheckedIn", memberWithTime);

    res.status(200).json({ message: "Check-in successful", member: memberWithTime });
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current waitlist to newly connected client
  socket.emit("currentMembers", members);

  // Handle new check-ins
  socket.on("checkIn", (member) => {
    members.push(member);
    io.emit("memberCheckedIn", member); // Broadcast to all clients
  });

  // Handle completed appointments
  socket.on("completeMember", (memberId) => {
    members = members.filter((m) => m._id !== memberId);
    io.emit("memberCompleted", memberId); // Notify all clients
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(5001, () => console.log("Server running on port 5001"));
