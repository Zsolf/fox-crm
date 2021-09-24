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
    @Inject(MAT_DIALOG_DATA) public data: ICompany) { }

  form: FormGroup = new FormGroup ({
    name: new FormControl(this.data.name),
    ceoName: new FormControl(this.data.ceoName),
    address: new FormControl(this.data.address),
  });

  ngOnInit(): void {
  }



}
