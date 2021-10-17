import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'fcrm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

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
      result => { this.router.navigateByUrl('/company') },
      (error) => {
        this.alertMessage = (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password')
          ? this.alertsList.user() : this.alertsList.server();
      }
    );
      
  }


}
