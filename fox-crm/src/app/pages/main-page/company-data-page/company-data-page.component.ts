import { Component, OnInit } from '@angular/core';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { ICompany } from 'src/app/shared/models/company.model';
import { IPerson } from 'src/app/shared/models/person.model';

@Component({
  selector: 'fcrm-company-data-page',
  templateUrl: './company-data-page.component.html',
  styleUrls: ['./company-data-page.component.scss']
})
export class CompanyDataPageComponent implements OnInit {

  constructor( private fbService: FirebaseBaseService) { }

  comp: ICompany;
  ceo: IPerson;

  ngOnInit(): void {
    this.comp = {
      name: "",
      contactPersonId:"",
      ceoName: "",
      email: "",
      phone: "",
      taxNumber: "",
      address: "",
    }

    this.getCompany();
  }

  getCompany(){
    this.fbService.getById("companies","3t92wuZZJdLVM0zrUaGB").subscribe(result =>{
      this.comp.id = result.id;
      this.comp.name = result.name;
     })
     
  }
}
