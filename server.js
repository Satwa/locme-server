const settings = require('./settings')

const http = require('http')
const requestify = require("requestify")
const io = require("socket.io")(settings.PORT)
const sequelize = require("sequelize")

// const Models = require("./Models")
// const Walk = Models.Walk,
//       Coordinates = Models.Coordinates,
//       Place = Models.Place

let print = (info) => { console.log(info) }

let rooms = {},
    sockets = []
/*
    roomId: {
        users: [ // max. 2 for now
            uuid: {
                latitude: 
                longitude:
                name:
                color:
                lastUpdated:
                joinedAt:
                isOwner:
            },
            uuid: {
                latitude:
                longitude:
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

io.sockets.on("connection", function(socket){
    sockets.push(socket)
    let currentUser = socket
    print("New connection from " + currentUser.handshake.address)

    let roomCode = ""
    const abcxyz = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for(let i = 0; i < 6; i++){
        roomCode += abcxyz[Math.floor(Math.random() * abcxyz.length)]
    }

    // Socket
})