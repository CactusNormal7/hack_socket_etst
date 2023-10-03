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
    console.log(`User connected ${socket.id}`);

    socket.on('send_message', (data) => {
        console.log(data.message);
        socket.broadcast.emit("receive_message", data)
    })
})      
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log("SERVER IS RUNNING");
})