import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/firebase-user.services';
import { IUser } from '../models/user.model';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  email: string;
  emailTwo: string;

  user: IUser;

  ngOnInit(): void {
    this.email = ""
    this.emailTwo = ""
    this.user = {firstName: "", lastName: ""} as IUser;

    this.authService.currentUserObserable().subscribe(result =>{
      if(result != null){
      this.email = result.email;
      this.userService.getByEmail(this.email).subscribe( result => {
        this.user = result[0]
      })
      this.emailTwo = this.email
    
      }
    })
  }


}
