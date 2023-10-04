const express = require('express')
const app = express()
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["https://hackathon-test-iota.vercel.app", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})


let users = {}

io.on("connection", (socket) => {
    // console.log(`User connected ${socket.id}`);
    let current_room = 0
    socket.on('room_number', (room) => {
        socket.join(room.room)
        current_room = room.room
        io.to(current_room).emit('user_list', Object.values(users))
    })

    socket.on("joined_username", (data) => {
        users[socket.id] = data
        console.log(users);
        io.to(current_room).emit('user_list', Object.values(users))
    })

    socket.on('send_message', (data) => {
        console.log(users);
        socket.broadcast.to(current_room).emit("receive_message", { message: data.message, username: data.username })
    })

    socket.on("disconnect", () => {
        delete users[socket.id]
        console.log(users);
        io.to(current_room).emit('user_list', Object.values(users))
    })
})



const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log("SERVER IS RUNNING");
})