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

io.sockets.on("connection", function(socket){ // TODO: restaurer roomCode si uuid isOwner
    sockets.push(socket)
    let currentUser = socket
    let roomId = null, socket_uuid = null //

    print("New connection from " + currentUser.handshake.address)

    let roomCode = ""
    let _genCode = () => {
        const abcxyz = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        for(let i = 0; i < 6; i++){
            roomCode += abcxyz[Math.floor(Math.random() * abcxyz.length)]
        }
    }
    _genCode()

    while(rooms[roomCode] !== undefined){ // Si la room existe à la génération, on refait un nouveau code
        console.log("Generating a new code")
        _genCode()
    }

    socket.on("join", (uuid) => {
        socket_uuid = uuid
        roomId = roomCode
        rooms[roomId] = new Room(roomCode, "", [new User(uuid, "nil", "nil", Math.floor(Date.now() / 3), Math.floor(Date.now() / 3), "walking", true, new Coordinates(0, 0))])

        socket.emit("naive_attach", rooms[roomId])
        // TODO: Check if room exists after generated ? generate new code || continue
        
        // TODO: Check if room exists before attaching when join_click and if users_in < 2

        // roomId = req.room // pass roomId instead of full room

        // TODO: On leave a room and empty, delete it from the array
        // TODO: When room travel's done, delete it from the array

        // socket.broadcast.to(currentRoom).emit('newplayer', rooms[data.room].players[rooms[data.room].players.length - 1])
        // socket.join(data.room)
        // socket.emit("loadroom", rooms[currentRoom])
        // io.in(currentRoom).emit("started")
    })

    socket.on("room_attach", (requestRID) => {
        requestedRoomId = requestRID.toUpperCase()

        console.log(requestedRoomId)
        console.log(rooms[requestedRoomId])
        
        if (rooms[requestedRoomId] !== undefined) {
            if (rooms[requestedRoomId].users.length < 2) {

                rooms[requestedRoomId].users.push(new User(socket_uuid, "nil", "nil", Math.floor(Date.now() / 3), Math.floor(Date.now() / 3), "walking", true, new Coordinates(0, 0)))

                socket.emit("room_attach", {
                    success: true,
                    message: "room_found",
                    room: rooms[requestedRoomId]
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
})
console.log("Server up and running on port " + process.env.PORT)