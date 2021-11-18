import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUser } from 'src/app/shared/models/user.model';
import { ProfilePageComponent } from '../profile-page.component';

@Component({
  selector: 'fcrm-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<ProfilePageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {user: IUser}) { }


  form: FormGroup;
  error: string = "";

  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
      passwordAgain: new FormControl('', Validators.required)
    })
  }

  save(){
    if(this.form.value.password != this.form.value.passwordAgain){
      this.error = "A két jelszó nem egyezik!"
      return
    }
    this.dialogRef.close(this.form.value)
  }

}
