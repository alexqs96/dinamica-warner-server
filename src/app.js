import "dotenv/config";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
const app = express();
const port = process.env.PORT || 4000;

// Manejo de cors, peticiones y datos de express js
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// Rutas
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server Dinamica Warner 2023",
  });
});
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

const server = app.listen(port, () =>
  console.log(`Servidor conectado, puerto: ${port}`),
);

// Socket io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado:", socket.id);

  socket.on("connected", () => {
    io.sockets.emit("refreshVotes");
  });

  socket.on("vote", (vote) => {
    console.log("Votaron: "+vote);
    io.sockets.emit("refreshVotes");
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
});