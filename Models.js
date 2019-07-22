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






class Walk {
    constructor(id, name, passCode, photoUrl, locked, isStatic, coordinates, places) {
        // String
        this.id = id
        this.name = name
        this.passCode = passCode
        this.photoUrl = photoUrl

        // Bool
        this.locked = locked
        this.isStatic = isStatic

        // Coordinates
        this.coordinates = coordinates

        // Places
        this.places = places
    }
}

class Coordinates {
    constructor(latitude, longitude) {
        this.latitude = latitude
        this.longitude = longitude
    }
}

class Place {
    constructor() {
        // String
        this.id = id
        this.name = name
        this.provider = provider
        this.description = description
        this.photoUrl = photoUrl

        // Coordinates
        this.coordinates = coordinates
    }
}

module.exports = { Room, User, Coordinates }