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

module.exports = {Walk, Coordinates, Place }