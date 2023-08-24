import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe',
  standalone: true,
})
export class TimePipe implements PipeTransform {

  transform(value: String): String {
    //2023-08-30T11:41:36.000Z
    return this.convert(value)
  }

  private convert(value:String){
    if(value.length<20){
      return value
    }

    var date = value.substring(0,10)
    var time = value.substring(11,19)
    return date + " " + time 
  }
}
