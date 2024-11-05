'use strict'


class gastosCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = precioViaje
    }

    convertToJSON() {
        return JSON.stringify(this);
    }
}

