import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Dispositivo } from '../class/Dispositivo';
import { ActivatedRoute } from '@angular/router';
import { LogRiego } from '../class/LogRiego';
import { Electrovalvula } from '../class/Electrovalvula';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public dispositivo:Dispositivo = new Dispositivo()
  public electrovalvula:Electrovalvula = new Electrovalvula()
  public logArray:Array<LogRiego> = new Array
  public service:DataService
  public title:String = "Registro de electrovalvula"
  public dispositivoId:Number = 0

  constructor(service:DataService, router:ActivatedRoute) {
    
    this.service = service
    const dispId = router.snapshot.paramMap.get( 'dispositivo_id' );
    //const electrovalvulaId = router.snapshot.paramMap.get( 'electrovalvula_id' );
    console.log(`constructor historico`)

    this.electrovalvula = new Electrovalvula()
    
    if(Number.isNaN(dispId)){
      console.log(`${dispId} no es un numero valido`)
    } else {
      this.dispositivoId = Number(dispId)
      this.getRegistroRiegoList()
    }
  }

  async getRegistroRiegoList() {

    await this.service.getRegistroRiegoList(this.dispositivoId)
      .then((dList) => {
        console.log(dList)
        for (let e of dList) {
          var log:LogRiego = new LogRiego()
          
          log.logRiegoId = e.logRiegoId
          log.apertura = e.apertura
          log.electrovalvulaId = e.electrovalvulaId
          log.fecha = e.fecha

          this.logArray.push(log)
        }
        console.log(dList)
      })
      .catch((error) => {
        console.log(error)
      })
    console.log('Cargue los registros')
  }

  ngOnInit() {
  }
}