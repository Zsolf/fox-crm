import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPerson } from 'src/app/shared/models/person.model';

@Component({
  selector: 'fcrm-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {person: IPerson, dialogType: string}) { }

    isContactDialog: boolean;
    isMainDialog: boolean;

  form: FormGroup = new FormGroup ({
    id: new FormControl(this.data.person.id),
    firstName: new FormControl(this.data.person.firstName),
    lastName: new FormControl(this.data.person.lastName),
    position: new FormControl(this.data.person.position),
    phone: new FormControl(this.data.person.phone),
    email: new FormControl(this.data.person.email)
  });

  ngOnInit(): void {
    this.isContactDialog = false;
    this.isMainDialog = false;

    switch(this.data.dialogType){
     case "mainDialog":{
       this.isMainDialog = true;
       break;
     }
     case "contactDialog":{
       this.isContactDialog = true;
       break;
     }
    }
  }


}
