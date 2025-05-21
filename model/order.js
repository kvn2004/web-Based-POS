export class Order {
    #Oid
    #date
    #total

    constructor(Oid,date,total) {
        this.#Oid = Oid
        this.#date = date
        this.#total = total
        this._Oid = Oid;
        this._date = date;
        this._total = total;

    }

    getOid() {
        return this._Oid;
    }

    setOid(value) {
        this._Oid = value;
    }

    getdate() {
        return this._date;
    }

    setdate(value) {
        this._date = value;
    }

    gettotal() {
        return this._total;
    }

    settotal(value) {
        this._total = value;
    }
}