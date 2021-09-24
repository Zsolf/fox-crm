import { Component, OnInit } from '@angular/core';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { ICompany } from 'src/app/shared/models/company.model';
import { IPerson } from 'src/app/shared/models/person.model';
import { MatDialog} from '@angular/material/dialog';
import { CompanyDialogComponent } from './company-dialog/company-dialog.component';

@Component({
  selector: 'fcrm-company-data-page',
  templateUrl: './company-data-page.component.html',
  styleUrls: ['./company-data-page.component.scss']
})
export class CompanyDataPageComponent implements OnInit {

  constructor( private fbService: FirebaseBaseService, public dialog: MatDialog) { }

  comp: ICompany;
  ceo: IPerson;

  firstEditIconVisible: boolean;
  secondEditIconVisible: boolean;

  ngOnInit(): void {
    this.comp = {
      id: "",
      name: "",
      contactPersonId:"",
      ceoName: "",
      email: "",
      phone: "",
      taxNumber: "",
      address: "",
      webpage: "",
    }

    this.getCompany();

    this.firstEditIconVisible = false;
    this.secondEditIconVisible = false;
  }

    getCompany(){
    this.fbService.getById("companies","3t92wuZZJdLVM0zrUaGB").subscribe(result =>{
      this.comp.id = result.id;
      this.comp.name = result.name;
      this.comp.ceoName = result.ceoName;
      this.comp.contactPersonId = result.contactPersonId;
      this.comp.email = result.email;
      this.comp.phone = result.phone;
      this.comp.taxNumber = result.taxNumber;
      this.comp.address = result.address;
      this.comp.webpage = result.webpage;
     })
     
  }

  mouseEnterFirst(){
    this.firstEditIconVisible = true;
    console.log("first")
  }

  mouseLeaveFirst(){
    this.firstEditIconVisible = false;
  }

  mouseEnterSecond(){
    this.secondEditIconVisible = true;
  }

  mouseLeaveSecond(){
    this.secondEditIconVisible = false;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '250px',
      data: this.comp
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.comp.name = result.name
      this.comp.ceoName = result.ceoName
      this.comp.address = result.address
    });
  }
}
