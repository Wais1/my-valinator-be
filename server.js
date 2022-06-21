const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
// const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getRandomUsername } = require('./utils/users')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Valinator'
const rooms = []

// Run when client connects
io.on('connection', socket => {
    console.log('User connected')
    //  pause to all
    socket.on('pause', ({ username, room }) => {
        // sending to all clients except sender
        socket.broadcast.emit('pause', "this is a test");

        // Broascast to all including client to test on same client.
        // io.sockets.emit('pause', '');

        console.log(`A user requested to pause`)
    })

    // change video to all
    socket.on('changeVideo', ({ link }) => {
        // sending to all clients except sender
        socket.broadcast.emit('changeVideo', link );

        // Broascast to all including client to test on same client.
        // io.sockets.emit('pause', '');

        console.log(`A user requested to change videos with this link ${link}`)
    })

    socket.on('joinRoom', ({ username, room }) => {
        // can check if room available here
        const user = userJoin(socket.id, username, room);

        socket.join(user.room)
        // Welcome current user
        // socket.emit('message', formatMessage(botName, 'Welcome to ClassApp, ask your first question!'))

        // Broadcast when a user connects to all but client
        const randUsername = getRandomUsername()
        socket.broadcast.to(user.room).emit('alert', formatMessage(randUsername, 'has joined the class'));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)

        //const username = user.username;
        // Possibly randomize username here by default.
        const randUsername = getRandomUsername()

        try {
            io.to(user.room).emit('message', formatMessage(randUsername, msg))
        } catch (error) {
            console.log(error)
        }
    })

    // Listen for student feelings
    socket.on('feeling', (val) => {
        const user = getCurrentUser(socket.id)
        
        // Update user feel value
        user.feelVal=val

        // Send users and room info to update the users in the room's feels
        io.to(user.room).emit('updFeel', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    // Runs when client disconnects. Broadcast to all
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('alert', formatMessage('A student', 'left the class'))

            // Send users and room info to update participant list after leave)
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));