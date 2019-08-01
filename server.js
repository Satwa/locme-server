require('dotenv').config()

const http = require('http')
const requestify = require("requestify")
const io = require("socket.io")(process.env.PORT)
const sequelize = require("sequelize")

const Models = require("./Models")
const Room = Models.Room,
      User = Models.User
      Coordinates = Models.Coordinates

let print = (info) => { console.log(info) }

let rooms = {},
    sockets = []
/*
    CONFORMS TO MODEL CLASSES
    roomId: {
        users: [ // max. 2 for now
            uuid: {
                latitude: 
                longitude:
                profile: // driving, walking, cycling
                name:
                color:
                lastUpdated:
                joinedAt:
                isOwner:
            },
            uuid: {
                latitude:
                longitude:
                profile: // driving, walking, cycling
                name:
                color:
                lastUpdated:
                joinedAt:
                isOwner:
            }
        ],
        polyline: 
        directions: // not sure, A->B != B->A (+ depending of the mean of transport)
    }
*/


// DEBUG PURPOSE
rooms["FFFEEE"] = new Room("FFFEEE", "", [])


io.sockets.on("connection", function(socket){ // TODO: restaurer roomCode si uuid isOwner
    sockets.push(socket)
    let socket_roomId = null, // This is the room where socket is owner
        socket_uuid = null, // This is the uuid of the device
        in_room = null // This is the room where socket is guest

    print("New connection from " + socket.handshake.address)

    socket.on("join", (uuid) => {
        socket_uuid = uuid

        // Detect if user already owner
        for (let rkey in rooms) { // Pour chaque room [rip optimisation]
            let room = rooms[rkey]
            for (let user of room.users) {
                if (user.id == socket_uuid && user.isOwner) {
                    console.log("Socket already owner of room " + rkey)
                    socket_roomId = rkey
                    break
                }
            }
            if (socket_roomId != null) break
        }

        // Socket not owner yet, we generate a room
        if (socket_roomId == null) {
            print("Generating a new room where socket is owner..")
            let roomCode = ""
            let _genCode = () => {
                const abcxyz = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                for (let i = 0; i < 6; i++) {
                    roomCode += abcxyz[Math.floor(Math.random() * abcxyz.length)]
                }
                socket_roomId = roomCode
            }
            _genCode()

            while (rooms[roomCode] !== undefined) { // Si la room existe à la génération, on refait un nouveau code
                console.log("Generating a new code")
                _genCode()
            }
        }
        
        rooms[socket_roomId] = new Room(socket_roomId, "", [new User(uuid, "nil", "nil", Math.floor(Date.now() / 3), Math.floor(Date.now() / 3), "walking", true, new Coordinates(0, 0))])
        socket.join(socket_roomId) // On attache la socket à la room
        socket.emit("naive_attach", rooms[socket_roomId])

        // TODO: When room travel's done, delete it from the array

        // socket.broadcast.to(currentRoom).emit('newplayer', rooms[data.room].players[rooms[data.room].players.length - 1]) // emit à tous sauf socket actuelle
        // io.in(currentRoom).emit("started") // emit à tous
    })

    socket.on("room_attach", (requestRID) => {
        in_room = requestRID.toUpperCase()

        console.log("Trying to attach socket to requested room: " + in_room)
        
        if (rooms[in_room] !== undefined) {
            if (rooms[in_room].users.length < 2 || rooms[in_room].users.filter(e => e.id === socket_uuid).length > 0) {
                if(rooms[in_room].users.filter(e => e.id === socket_uuid).length === 0) { 
                    // If user was not in the room, we add a new one to the room
                    // TODO: Fetch name, color, transport_mode, coordinates
                    rooms[in_room].users.push(new User(socket_uuid, "nil", "nil", Math.floor(Date.now() / 3), Math.floor(Date.now() / 3), "walking", false, new Coordinates(0, 0)))

                    // Emit new user to room
                    socket.broadcast.to(in_room).emit("room_userjoin", {
                        roomId: in_room,
                        user: rooms[in_room].users[rooms[in_room].users.length - 1]
                    }) // We send user
                }

                socket.join(in_room)
                socket.emit("room_attach", {
                    success: true,
                    message: "room_found",
                    room: rooms[in_room]
                })
            } else {
                socket.emit("room_attach", {
                    success: false,
                    message: "room_full"
                })
            }
        }else{
            // Room is undefined
            socket.emit("room_attach", {
                success: false,
                message: "room_not_found"
            })
        }
    })

    // Socket

    // TODO: onDisconnect -> alert 
})
console.log("Server up and running on port " + process.env.PORT)