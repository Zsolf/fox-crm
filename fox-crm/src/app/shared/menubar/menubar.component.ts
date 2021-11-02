import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/firebase-file.service';
import { UserService } from 'src/app/services/firebase-user.services';
import { IUser } from '../models/user.model';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
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
export class MenubarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private userService: UserService,
     private storageService: StorageService) { }

  email: string;
  emailTwo: string;
  avatarURL: string;
  user: IUser;

  ngOnInit(): void {
    this.storageService.usersAvatar = []
    console.log("asd")
    this.userService.getAll().subscribe(result =>{
        result.forEach(element => {
        this.storageService.getAvatarByPath(element.avatarPath).subscribe(res =>{
            if(this.storageService.usersAvatar.find(elem => elem.id == element.id) == undefined){
                this.storageService.usersAvatar.push({id: element.id, avatar: res})
            }
        })
        });
    })
    this.email = ""
    this.user = {firstName: "", lastName: ""} as IUser;

    this.authService.currentUserObserable().pipe(take(1)).subscribe(result =>{
      if(result != null){
      this.email = result.email;
      this.userService.getByEmail(this.email).pipe(take(1)).subscribe( result => {
        if(this.storageService.fileUrl == undefined){
          this.getAvatarQuery(result[0].avatarPath)
        } 
      })
      this.userService.getByEmail(this.email).subscribe( result => {
        this.user = result[0]
      })
      }
    })




  }

  getAvatarQuery(userAvatarPath: string){
    this.storageService.getCurrentUserAvatarByPath(userAvatarPath).pipe(take(1)).subscribe( result => {
      this.avatarURL = result},
      error =>{
      })
  }

  ngDoCheck(): void {
    this.storageService.fileUrl == undefined ? this.avatarURL= "assets/avatar-icon.png" : this.avatarURL = this.storageService.fileUrl
  }

  logout(){
    this.storageService.fileUrl = undefined
    this.authService.logout()
    this.router.navigateByUrl("/login")
  }


}
