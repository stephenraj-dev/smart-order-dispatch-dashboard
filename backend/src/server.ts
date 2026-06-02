import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import orderRoutes from "./routes/orderRoutes";
import riderRoutes from "./routes/riderRoutes";
import { initSocket } from "./socket/socket";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

initSocket(io);

app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/riders", riderRoutes);

app.get("/token", (req, res) => {

    const token = jwt.sign(
        {
        role: "admin"
        },
        "interview-secret"
    );

    res.json({ token });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});