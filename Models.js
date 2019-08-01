class Room {
    constructor(id, polyline, users) {
        // String
        this.id = id
        this.polyline = polyline

        // Users
        this.users = users
    }
}

class User {
    constructor(id, name, color, lastUpdated, joinedAt, transportation, isOwner, coordinates){
        // String
        this.id = id // uuid
        this.name = name
        this.color = color
        this.lastUpdated = lastUpdated
        this.joinedAt = joinedAt
        // String [walking, driving, cycling]
        this.transportation = transportation


        // Coorditnates
        this.coordinates = coordinates

        // Bool
        this.isOwner = isOwner
    }
}

class Coordinates {
    constructor(latitude, longitude) {
        this.latitude = latitude
        this.longitude = longitude
    }
}

module.exports = { Room, User, Coordinates }