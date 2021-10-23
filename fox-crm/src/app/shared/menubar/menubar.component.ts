import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/firebase-file.service';
import { UserService } from 'src/app/services/firebase-user.services';
import { IUser } from '../models/user.model';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private userService: UserService,
     private storageService: StorageService) { }

  email: string;
  emailTwo: string;
  avatarURL: string;
  user: IUser;

  ngOnInit(): void {
    this.email = ""
    this.user = {firstName: "", lastName: ""} as IUser;

    this.authService.currentUserObserable().subscribe(result =>{
      if(result != null){
      this.email = result.email;
      this.userService.getByEmail(this.email).subscribe( result => {
        this.user = result[0]
        if(this.storageService.fileUrl == undefined){
          this.getAvatarQuery(result[0].id)
        }
        
      })
    
      }
    })
  }

  getAvatarQuery(userId: string){
    this.storageService.getFileForCurrentUser(this.user.id).subscribe( result => {
      this.avatarURL = result},
      error =>{
        this.avatarURL="assets/avatar-icon.png"
      })
  }

  ngDoCheck(): void {
    this.storageService.fileUrl == undefined ? this.avatarURL= "assets/avatar-icon.png" : this.avatarURL = this.storageService.fileUrl
  }


}
