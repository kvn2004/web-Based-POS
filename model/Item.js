 export class Item {
    #iId
    #itemName
    #price
    #quantity

    constructor(iId, itemName, price, quantity) {
        this.#iId = iId;
        this.#itemName = itemName;
        this.#price = price;
        this.#quantity = quantity;
        this._iId = iId;
        this._itemName = itemName;
        this._price = price;
        this._quantity = quantity;
    }

    getiId() {
        return this._iId;
    }

    setiId(value) {
        this._iId = value;
    }

    getitemName() {
        return this._itemName;
    }

    setitemName(value) {
        this._itemName = value;
    }

    getprice() {
        return this._price;
    }

    setprice(value) {
        this._price = value;
    }

    getquantity() {
        return this._quantity;
    }

    setquantity(value) {
        this._quantity = value;
    }
}