import { Electrovalvula } from './Electrovalvula';
export class Dispositivo {
    
    private _dispositivoId: Number = 0 
    private _nombre: String = ''
    private _ubicacion: String = ''
    private _electrovalula: Electrovalvula = new Electrovalvula()
   
    
    public Dispositivo(){
    }

    public get dispositivoId(): Number {
        return this._dispositivoId
    }

    public set dispositivoId(value: Number) {
        this._dispositivoId = value
    }

    public get electrovalulaId(): Number {
        return this._electrovalula.ElectrovalvulaId
    }
    public set electrovalulaId(value: Number) {
        this._electrovalula.ElectrovalvulaId = value
    }

    public get ubicacion(): String {
        return this._ubicacion
    }
    public set ubicacion(value: String) {
        this._ubicacion = value
    }

    public get nombre(): String {
        return this._nombre
    }
    public set nombre(value: String) {
        this._nombre = value
    }
}