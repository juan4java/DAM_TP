import { Injectable } from '@angular/core';
import { Dispositivo } from '../class/Dispositivo';
import { LogRiego } from '../class/LogRiego';
import { Medicion } from '../class/Medicion';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  /**Sensores de humedad*/
  public diArray:Array<Dispositivo> = new Array;
  /**Regustro de la medicion*/
  public meArray:Array<Medicion> = new Array;
  /**Historico de apertura y cierre de electrovalvulas*/
  public lrArray:Array<LogRiego> = new Array;

  constructor(private _http: HttpClient) { }

  public loadDispostivo(id:Number){
    if(this.diArray.length==0){
      this.getDispositivoList()
    }
    return this.diArray
  }
  
  public getDispositivoList (): Promise<any> {
    return firstValueFrom(this._http.get(`http://localhost:8000/dispositivo/list`))
  }

  public getDispositivo(id:Number): Promise<any> {
    return firstValueFrom(this._http.get(`http://localhost:8000/dispositivo/${id}`))
  }

  public getMedicionLast(dispostivoId:Number) : Promise<any> {
    return firstValueFrom(this._http.get(`http://localhost:8000/medicion/last/${dispostivoId}`))
  }

  public getResgistroActual(electrovalvulaId:Number) : Promise<any> {
    return firstValueFrom(this._http.get(`http://localhost:8000/registro/last/${electrovalvulaId}`))
  }  

  public getRegistroRiegoList(electrovalvulaId:Number) : Promise<any> {
    return firstValueFrom(this._http.get(`http://localhost:8000/registro/${electrovalvulaId}`))
  }  
  
  public getMedicionList(dispostivoId:Number) : Promise<any> {
    return firstValueFrom(this._http.get(`http://localhost:8000/medicion/${dispostivoId}`))
  }

  public putRegistroRiego(logRiego:JSON) : Promise<any> {
    return firstValueFrom(this._http.put(`http://localhost:8000/registro`,logRiego))
  }

  public putMedicion(medicion:JSON) : Promise<any> {
    return firstValueFrom(this._http.put(`http://localhost:8000/medicion`,medicion))
  }

  public getDispositivoOld(id:Number){

    return { "dispositivoId" : id
    , "nombre" : `Sensor ${id}`
    , "ubicacion" : "Patio"
    , "electrovalvulaId" : id
    }

  }

  private getDispositivoListOld (){
  return ([
      { "dispositivoId" : 1
      , "nombre" : "Sensor 1"
      , "ubicacion" : "Patio"
      , "electrovalvulaId" : 1
      },
      { "dispositivoId" : 2
      , "nombre" : "Sensor 2"
      , "ubicacion" : "Cocina"
      , "electrovalvulaId" : 2
      },
      { "dispositivoId" : 3
      , "nombre" : "Sensor 3"
      , "ubicacion" : "Jardin Delantero"
      , "electrovalvulaId" : 3
      },
      { "dispositivoId" : 4
      , "nombre" : "Sensor 2"
      , "ubicacion" : "Living"
      , "electrovalvulaId" : 4
      }])
  }

  /** Obtener ultima medicion o todas las mediciones para 
   * un determinado dispositivo
   */
  public getMedicionListOld(dispostivoId:Number){
    return ([
      { "medicionId" : 10
      , "fecha" : 1692576861990
      , "valor" : "60"
      , "dispostivoId" : dispostivoId
      },
      { "medicionId" : 9
      , "fecha" : 1692576861990
      , "valor" : "55"
      , "dispostivoId" : dispostivoId
      },
    ]);
  }

  public getMedicionOld(dispostivoId:Number){
    return  { "medicionId" : 10
      , "fecha" : 16000001000
      , "valor" : "60"
      , "dispostivoId" : dispostivoId
      };
  }

  /** Obtener registros de riego */
  public getRegistroRiegoListOld(electrovalvulaId:Number){
    return ([
      { "logRiegoId" : 100
      , "fecha" : 1692576061990
      , "apertura" :1
      , "electrovalvulaId" : electrovalvulaId
      },
      { "logRiegoId" : 99
      , "fecha" : 1692506861990
      , "apertura" : 0
      , "electrovalvulaId" :  electrovalvulaId
      }
    ]);
  }
}