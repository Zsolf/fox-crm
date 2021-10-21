import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { IUser } from 'src/app/shared/models/user.model';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/firebase-user.services';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'fcrm-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  animations: [
    trigger('fadeAnimation', [

      state('in', style({opacity: 1})),

      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class ProfilePageComponent implements OnInit {

  constructor( private userService: UserService, public dialog: MatDialog, private authService: AuthService,) { }

  user: IUser;

  form: FormGroup;


  ngOnInit(): void {
    this.user = {firstName: "", lastName: ""} as IUser;

    let queryRunning = true;

    this.authService.currentUserObserable().subscribe(result =>{
      if(result != null){
      this.userService.getByEmail(result.email).subscribe( result => {
        this.user = result[0]
        this.form.setValue({
          email: result[0].email,
          firstName: result[0].firstName,
          lastName: result[0].lastName,
          phone: result[0].phone,
          position: result[0].position
        })
      })
    
      }
    })


    this.form = new FormGroup ({
      email: new FormControl(this.user.email, [Validators.email, Validators.required]),
      firstName: new FormControl(this.user.firstName, [Validators.minLength(1),Validators.required]),
      lastName: new FormControl(this.user.lastName, [Validators.minLength(1), Validators.required]),
      phone: new FormControl (this.user.phone, [Validators.required, Validators.pattern("^[0-9]*$")]),
      position: new FormControl(this.user.position, [Validators.required])
  })

  }

  save(){
    this.userService.update(this.user.id, this.form.value)
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {
      width: '250px',
      data: {user: this.user}
      
    });


    dialogRef.afterClosed().subscribe(async result => {
      this.authService.newPassword(result.password)
    });
  }
}
