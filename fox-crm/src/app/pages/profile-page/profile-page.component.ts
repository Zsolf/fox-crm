import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { IUser } from 'src/app/shared/models/user.model';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/firebase-user.services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/firebase-file.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor( private userService: UserService, 
    public dialog: MatDialog,
    private authService: AuthService,
    private storageService: StorageService, 
    private route: ActivatedRoute,
    private router: Router ) { }

  user: IUser;
  form: FormGroup;
  fileError: string = ""
  filePath: any;

  avatarURL: string;

  isMyProfile: boolean
  userId: string;


  ngOnInit(): void {
    this.user = {firstName: "", lastName: ""} as IUser;

    this.route.params.subscribe(result =>{
      if(result['uid'] == undefined){
        this.isMyProfile = true
        console.log(this.isMyProfile)
      }else{
        this.isMyProfile = false
        this.userId = result['uid']
      }
    })

  this.authService.currentUserObserable().subscribe(result =>{
    if(result != null){
     
      console.log(result)
    }
  })
  

    if(this.isMyProfile){
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
        this.getAvatar();
      })
    
      }
    })
  }else{
    this.authService.currentUserObserable().subscribe(result =>{
      if(result != null){
      this.userService.getByEmail(result.email).subscribe( result => {
          if(this.userId == result[0].id){
            this.router.navigateByUrl('/my-profile')
          }
      })
    }
    })

    this.userService.getById(this.userId).subscribe(result =>{
      if(result[0] == undefined){
      this.router.navigateByUrl('/my-profile')
      }
      this.user = result[0]
      this.form.setValue({
        email: result[0].email,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        phone: result[0].phone,
        position: result[0].position
      })
      let user = this.storageService.usersAvatar.find(elem => elem.id == this.userId)
      if(user == undefined){
        this.storageService.getAvatarByPath(this.user.avatarPath).subscribe(res =>{
          this.avatarURL = res
        })
      }else{
        this.avatarURL = user.avatar
      }

    },
    error =>{
      this.router.navigateByUrl('/my-profile')
    })
  }




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

  upload($event){
    this.filePath = $event.target.files[0]

    if(this.filePath.type != "image/png" && this.filePath.type != "image/jpg" && this.filePath.type != "image/jpeg" ){
      this.fileError = "A fájl formátuma nem megfelelő"
      return
    }

    
    

    this.fileError = " "
    this.storageService.upload(this.user.id,this.filePath).then( () =>{
      this.user.avatarPath = '/avatars/'+this.user.id
      this.userService.update(this.user.id, this.user)
      this.getAvatarQuery(this.user.id)
    })
      

  }

  getAvatarQuery(userId: string){
    this.storageService.getAvatarByPath(this.user.avatarPath).subscribe( result => {
      this.avatarURL = result
      this.storageService.currenUserAvatar =this.avatarURL
      this.storageService.usersAvatar.forEach(element =>{
        if(element.id == this.user.id){
          element.avatar =this.avatarURL
        }
      })
    },
      error =>{
        this.avatarURL="assets/avatar-icon.png"
      })

  }

  getAvatar(){
    let url = this.storageService.fileUrl
    this.avatarURL = url
  }

  getFileServiceAvatar(): string{
    return this.storageService.currenUserAvatar;
  }


}
