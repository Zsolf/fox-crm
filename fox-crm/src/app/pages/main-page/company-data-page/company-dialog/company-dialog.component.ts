import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ICompany } from 'src/app/shared/models/company.model';
@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.scss']
})
export class CompanyDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {company: ICompany, dialogType: string}) { }

    isContactDialog: boolean;
    isMainDialog: boolean;
    isWebpageDialog: boolean;

  form: FormGroup = new FormGroup ({
    id: new FormControl (this.data.company.id),
    name: new FormControl(this.data.company.name),
    ceoName: new FormControl(this.data.company.ceoName),
    address: new FormControl(this.data.company.address),
    email: new FormControl(this.data.company.email),
    taxNumber: new FormControl(this.data.company.taxNumber),
    phone: new FormControl(this.data.company.phone),
    webpage: new FormControl(this.data.company.webpage)
  });

  ngOnInit(): void {
    this.isContactDialog = false;
    this.isMainDialog = false;
    this.isWebpageDialog = false;

    switch(this.data.dialogType){
     case "mainDialog":{
       this.isMainDialog = true;
       break;
     }
     case "contactDialog":{
       this.isContactDialog = true;
       break;
     }
     case "webpageDialog":{
       this.isWebpageDialog = true;
       break;
     }

    }
  }



}
