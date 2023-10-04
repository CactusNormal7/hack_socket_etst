const express = require('express')
const app = express()
const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin : ["https://hackathon-test-iota.vercel.app", "http://localhost:3000"],
        methods : ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    let current_room = 0
    console.log(`User connected ${socket.id}`);
    socket.on('room_number', (room) => {
        socket.join(room.room)
        current_room = room.room
    })
    
    socket.on('send_message', (data) => {
        socket.broadcast.to(current_room).emit("receive_message", {data : data, sender : socket.id})
    })
})      


const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log("SERVER IS RUNNING");
})