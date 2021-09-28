import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'toDate' })
export class toDate implements PipeTransform {
  transform(stamp: any): string {
    let date = stamp.toDate()
    let year = date.getYear()+1900
    let month = date.getMonth() + 1
    let day = date.getDate()
    let sysDate = new Date()
    if(sysDate.getFullYear() == year && (sysDate.getMonth() + 1) == month && sysDate.getDate() == day){
      return "Ma " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : "") + date.getMinutes()
    }
   return year + "-" + month + "-" + day
  }
}