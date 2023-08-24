import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Dispositivo } from '../class/Dispositivo';

import * as Highcharts from 'highcharts';
import { ControlService } from '../services/control.service';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);


enum ESTADO {
  abierta = 1,
  cerrada = 0
}

enum ACCION {
  abrir = 1,
  cerrar = 0
}

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
})
export class DispositivoPage implements OnInit, OnDestroy {

  private service:DataService
  private control:ControlService
  
  public title:string = "Dispositivo"
  private valorObtenido:number=0;
  public myChart:any;
  private chartOptions:any;
  public dispositivo:Dispositivo = new Dispositivo()
  public estado:Number = ESTADO.cerrada

  constructor(service:DataService, control:ControlService, router:ActivatedRoute) {
    this.control = control
    this.service = service
    const id = router.snapshot.paramMap.get( 'id' );
    console.log(`Constructor de dispositivo ${id}`)

    let numero = Number(id)
    if(Number.isNaN(numero)){
      console.log(`No es un numero valido ${numero}`)
    } else {
      this.dispositivo = new Dispositivo()
      this.dispositivo.dispositivoId = numero
    }
  }
  
  ngOnInit() {
    this.getDispositivo()
  }
  
  ngOnDestroy(): void {
    console.log("destroy")
      this.myChart = undefined
  }
  
  ionViewDidEnter() {
    console.log(`nombre ion view did enter : ${this.dispositivo.nombre}`)
    this.generarChart();
    this.getRegistroActual()
    this.getMedicionActual()
  }

  private async getDispositivo(){
    await this.service.getDispositivo(this.dispositivo.dispositivoId)
      .then((dList) => {
        console.log(dList)
        for (let d of dList) {
          
          this.dispositivo = new Dispositivo() 
          this.dispositivo.dispositivoId = d.dispositivoId
          this.dispositivo.electrovalulaId = d.electrovalvulaId
          this.dispositivo.nombre = d.nombre
          this.dispositivo.ubicacion = d.ubicacion
          
          console.log(`Dispositivo encontrado ${this.dispositivo.nombre}`)
        }
        console.log(dList)
      })
      .catch((error) => {
        console.log("ERROR " +error)
    })
    console.log('Cargue los dispositivos')
  }

  private async getMedicionActual(){
    await this.service.getMedicionLast(this.dispositivo.dispositivoId)
      .then((dList) => {
        console.log(dList)
          this.valorObtenido = parseInt(dList.valor)
          console.log(`valor obtenido ${this.valorObtenido}`)
          this.updateValor()
    })
    .catch((error) => {
      console.log("ERROR " + error)
    })
  }

  private async getRegistroActual(){
    await this.service.getResgistroActual(this.dispositivo.electrovalulaId)
      .then((e) => {
        console.log(e)
          this.estado = e.apertura
          console.log(`valor obtenido ${this.valorObtenido}`)
    })
    .catch((error) => {
      console.log("ERROR " + error)
    })
  }

  generarChart() {
    this.chartOptions={
      chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false
        }
        ,title: {
          text: ""
        }
        ,credits:{enabled:true}
        ,pane: {
            startAngle: -150,
            endAngle: 150
        } 
        // the value axis
      ,yAxis: {
        min: 0,
        max: 100,
  
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
  
        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: 'kPA'
        },
        plotBands: [{
            from: 0,
            to: 10,
            color: '#55BF3B' // green
        }, {
            from: 10,
            to: 30,
            color: '#DDDF0D' // yellow
        }, {
            from: 30,
            to: 100,
            color: '#DF5353' // red
        }]
    },
    series: [{
        name: 'kPA',
        data: [this.valorObtenido],
        tooltip: {
            valueSuffix: ' kPA'
        }
    }]};

    this.myChart = Highcharts.chart('highcharts', this.chartOptions );
    console.log("Cargue el grafico")

  }

  private updateValor(){
      console.log("update grafico , valor " + this.valorObtenido)
        //llamo al update del chart para refrescar y mostrar el nuevo valor

        this.myChart.update({series: [{
          name: 'kPA',
          data: [this.valorObtenido],
          tooltip: {
              valueSuffix: ' kPA'
          }
      }]});
  }

  public accionarValvula(accion:Number){
    console.log("accion " + accion)
    this.valorObtenido = Math.floor((Math.random() * 100) + 1)
    var date = this.getDate();
    
    var bodyRiego = `{"apertura":${accion},"electrovalvulaId":${this.dispositivo.electrovalulaId},"fecha":"${date}"}`
    console.log(bodyRiego)
    
    this.service.putRegistroRiego(JSON.parse(bodyRiego))
      .then((res) => {
      console.log(res)
        console.log(`id registro insertado ${res.insertId}`)
        
        if(accion == ACCION.cerrar) {
      
          var bodyMedicion = `{"valor":${this.valorObtenido},"dispositivoId":${this.dispositivo.dispositivoId},"fecha":"${date}"}`
          console.log(bodyMedicion)
          this.service.putMedicion(JSON.parse(bodyMedicion))
            .then((res) => {
              console.log(`id medicion insertada ${res.insertId}`)
            })
            .catch((error) => {
              console.log("ERROR " + error)
            })
          }
            
          if(accion == ACCION.cerrar){
            this.estado = ESTADO.cerrada
          } else {
            this.estado = ESTADO.abierta
          }
      
          this.control.accionarElectrovalvula(this.dispositivo.electrovalulaId, accion)
          this.updateValor()
      })
      .catch((error) => {
        console.log("ERROR " + error)
    })
  }

  private getDate(){
    var date = new Date();
    
    var month = (date.getMonth() + 1) + ""
    if(month.length == 1)
      month = "0" + month

    var hours = date.getHours() + ""
    if(hours.length == 1){
      hours = "0"+ hours
    }

    var minutes = date.getMinutes() + ""
    if(minutes.length == 1){
      minutes = "0"+ minutes
    }
    var seconds = date.getSeconds() + ""
    if(seconds.length == 1){
      seconds = "0"+ seconds
    }

    return date.getFullYear() + 
            "/" + month + 
            "/" + date.getDate() +
            " " + hours +
            ":" + minutes +
            ":" + seconds ;
  }
}