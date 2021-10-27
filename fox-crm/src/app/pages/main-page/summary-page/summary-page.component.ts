import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fcrm-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['../company-page.component.scss', './summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {

  constructor() { }

  events1: any[]

  ngOnInit(): void {
    this.events1 = [
      {status: 'Felmérés',icon: 'pi pi-search', color: '#E8591B'},
      {status: 'Folyamatban', icon: 'pi pi-spinner', color: '#673AB7'},
      {status: 'Lezárt)', icon: 'pi pi-check', color: 'green'},
  ];

  this.events1 = [
    {status: 'Felmérés',icon: 'pi pi-search', color: '#E8591B'},
    {status: 'Folyamatban', icon: 'pi pi-spinner', color: '#673AB7'},
    {status: 'Lezárt', icon: 'pi pi-times', color: 'red'}
];
  }

}
