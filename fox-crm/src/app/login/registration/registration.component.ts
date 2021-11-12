import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
  selector: 'fcrm-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
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
export class RegistrationComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private fbService: FirebaseBaseService) { }

  @HostListener('document:keydown.enter') onKeyDownHandler(){
    this.register();
  }

  form: FormGroup = new FormGroup ({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
    firstName: new FormControl('', [Validators.minLength(1),Validators.required]),
    lastName: new FormControl('', [Validators.minLength(1), Validators.required]),
    phone: new FormControl ('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    position: new FormControl('', [Validators.required]),
    passwordAgain: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.authService.logout();
  }

  alertMessage = '';
  alertsList: any = {
    password: () => 'A jelszavak nem egyeznek!',
    email: () => 'Az e-mail már létezik!',
    server: () => 'A szolgáltatás nem elérhető!',
    false: () =>  ''
  }

  register(){
    if(this.form.invalid){
      return;
    }else if(this.form.value.password !== this.form.value.passwordAgain){
      this.alertMessage = this.alertsList.password();
      return;
    }

    this.authService.createdUser(this.form.value.email, this.form.value.password).then( 
      result => {
        this.fbService.add("users", {
          id: '',
          firstName: this.form.value.firstName,
          lastName: this.form.value.lastName,
          position: this.form.value.position,
          phone: this.form.value.phone,
          email: this.form.value.email,
          avatarPath: '/avatars/avatar-icon.png'
        } as IUser).then(res => {
          this.router.navigateByUrl("/login")
        }
        )

        },
    (error) => {
      if(error.code === 'auth/email-already-in-use'){
        this.alertMessage = this.alertsList.email();
      }else{
        this.alertMessage = this.alertsList.server();
      }
    }
    )

    

  }

}
