export class Electrovalvula {
    
    private _electrovalvulaId: Number = 0 
    private _nombre: String = ''
   
    
    public Electrovalvula(){
    }

    public get ElectrovalvulaId(): Number {
        return this._electrovalvulaId
    }

    public set ElectrovalvulaId(value: Number) {
        this._electrovalvulaId = value
    }

    public get nombre(): String {
        return this._nombre
    }
    public set nombre(value: String) {
        this._nombre = value
    }
}