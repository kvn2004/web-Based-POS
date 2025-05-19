export class Customer {
  #cId
  #cName
  #cTel

  constructor(cId,cName,cTel){
    this.#cId=cId;
    this.#cName=cName;
    this.#cTel=cTel;
    this._cId = cId;
    this._cName = cName;
    this._cTel = cTel;
  }

  getcId() {
    return this._cId;
  }

  setcId(value) {
    this._cId = value;
  }

  getcName() {
    return this._cName;
  }

  setcName(value) {
    this._cName = value;
  }

  getcTel() {
    return this._cTel;
  }

  setcTel(value) {
    this._cTel = value;
  }
}
