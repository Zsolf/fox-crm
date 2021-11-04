import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';


@Component({
  selector: 'fcrm-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.scss']
})
export class SaleDialogComponent implements OnInit {

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) { }

  selectedStatus: {name: string, id: string}

  statuses: {name: string, id: string}[]

  ngOnInit(): void {
    this.statuses =[{
      name: "Felmérés", id: "survey"
    },{
      name: "Folyamatban van", id: "inProgress"
    }]
  }

}
