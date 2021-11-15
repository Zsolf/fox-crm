import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StorageService } from '../services/firebase-file.service';
import { UserService } from '../services/firebase-user.service';

@Component({
  selector: 'fcrm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  form: FormGroup = new FormGroup ({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required])
  })

  alertMessage = '';
  alertsList: any = {
    user: () => 'Hibás E-mail cím vagy jelszó!',
    server: () => 'A szolgáltatás nem elérhető!',
    false: () =>  ''
  }

  @HostListener('document:keydown.enter') onKeyDownHandler(){
    this.login();
  }

  ngOnInit(): void {
    this.authService.logout();
  }

  login(){
    if(this.form.invalid){
    return;
    }
    this.authService.login(this.form.value.email, this.form.value.password).then(
      result => { 
            this.router.navigateByUrl('/home') 
      },
      (error) => {
        this.alertMessage = (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password')
          ? this.alertsList.user() : this.alertsList.server();
      }
    );
      
  }


}
