import { Component, OnInit } from '@angular/core';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { ICompany } from 'src/app/shared/models/company.model';
import { IPerson } from 'src/app/shared/models/person.model';
import { MatDialog} from '@angular/material/dialog';
import { CompanyDialogComponent} from './company-dialog/company-dialog.component';
import { IComment } from 'src/app/shared/models/comment.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Firebase from 'firebase';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserService } from 'src/app/services/firebase-user.service';
import { IUser } from 'src/app/shared/models/user.model';
import { StorageService } from 'src/app/services/firebase-file.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'fcrm-company-data-page',
  templateUrl: './company-data-page.component.html',
  styleUrls: ['../company-page.component.scss'],
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
export class CompanyDataPageComponent implements OnInit {

  constructor( private fbService: FirebaseBaseService, public dialog: MatDialog,
     private userService: UserService, private storageService: StorageService, private route: ActivatedRoute,  private messageService: MessageService) { }

  comp: ICompany;
  contactPerson: IPerson;
  oldComp: ICompany;
  companyId: string;
  comments: IComment[];
  commentIds: string[];
  toBeDeletedId: string[];
  firstEditIconVisible: boolean;
  secondEditIconVisible: boolean;
  thirdEditIconVisible: boolean;
  fourthEditIconVisible: boolean;
  isCommentSet: boolean;
  fbReadFinished: boolean;
  isCommentNeedToBeDeleted: boolean;
  isPersonSet: boolean;
  isCompanyNeedToBeUpdated: boolean;
  showEditIcon: {id: string, show: boolean}[];
  showEditArea: {id: string, show: boolean}[];
  userComments: {comment: IComment, user: IUser, avatar: string}[];
  editRemainingText: number;
  commentRemainingText: number;

  form: FormGroup = new FormGroup ({
    textArea: new FormControl('', Validators.maxLength(500))
  })

  editForm: FormGroup = new FormGroup({   
    editTextArea: new FormControl('', Validators.maxLength(500))
  })

  async ngOnInit(): Promise<void> {
    this.comp = {} as ICompany
    this.comp = {} as ICompany
    this.contactPerson = {} as IPerson
    this.companyId = ""

    this.userComments = []
    this.commentIds = []
    this.showEditIcon = []
    this.showEditArea = []

    this.editRemainingText = 0
    this.commentRemainingText = 0
    this.toBeDeletedId = []

    this.route.params.subscribe(result =>{
      this.companyId = result['comp']
    })

    await this.getData();
    this.firstEditIconVisible = false;
    this.secondEditIconVisible = false;
    this.thirdEditIconVisible = false;
    this.fourthEditIconVisible = false;
    this.isCommentSet = false;
    this.isCommentNeedToBeDeleted = false;
    this.isPersonSet = false;
    this.isCompanyNeedToBeUpdated = false;
    await this.getComments()
    

  }

  ngDoCheck(){
    if(!this.isCommentSet && this.commentIds.length > 0 && this.fbReadFinished){
    this.getComments()
    this.isCommentSet = true;
    }
    if(this.isCommentNeedToBeDeleted && this.toBeDeletedId.length > 0){
      this.deleteComment();
      this.isCommentNeedToBeDeleted = false;
    }
    if(this.isPersonSet == false && this.fbReadFinished ){
      this.getPerson();
      this.isPersonSet = true;
    }
    if(this.isCompanyNeedToBeUpdated && this.oldComp != this.comp){
      this.isCompanyNeedToBeUpdated = false;
      this.updateCompany()
    }
  }


  updateCompany() {
    this.messageService.add({severity:'success', summary:'Sikeres mentés'});
    this.fbService.update("companies",this.comp.id, this.comp)
  }


    async getData(){
      await this.fbService.getById("companies",this.companyId).subscribe(async result =>{
      this.comp.id = result.id;
      this.comp.name = result.name;
      this.comp.ceoName = result.ceoName;
      this.comp.contactPersonId = result.contactPersonId;
      this.comp.email = result.email;
      this.comp.phone = result.phone;
      this.comp.taxNumber = result.taxNumber;
      this.comp.address = result.address;
      this.comp.webpage = result.webpage;

      
      await this.fbService.getIdFromLinkedDB("company-comments",this.comp.id,"companyId","commentId").subscribe(async result => {   
        this.commentIds = await result;
        this.fbReadFinished = true;
      }) ;   
     })
    }


    getComments(){
      this.commentIds.forEach(element => {
        this.fbService.getById("comments",element).subscribe(async result =>{
          if(this.userComments.find(elem =>{ 
            return elem.comment.id == element
          }) == undefined && result != undefined){
            this.userService.getById(result.userId).subscribe(async res =>{
              let av = this.storageService.usersAvatar.find(elem => elem.id == res[0].id).avatar
                if(this.userComments.find(elem =>{ 
                  return elem.comment.id == element
                }) == undefined && result != undefined){
                  this.userComments.push( {comment: result, user: res[0], avatar: av })
                  this.showEditIcon.push({id: result.id, show: false})
                  this.showEditArea.push({id: result.id, show: false})
                  this.userComments.sort((a,b)=> {
                    if(a.comment.createdAt > b.comment.createdAt){
                      return -1
                    }
                    if(a.comment.createdAt == b.comment.createdAt){
                      return 0
                    }
                    if(a.comment.createdAt < b.comment.createdAt){
                      return 1
                    }
                  }
                )
                }
            })
        }
        })
      });
    }

    getPerson(){
      this.fbService.getById("persons", this.comp.contactPersonId).subscribe(result =>{
        this.contactPerson = result;
      })
    }

  mouseEnterFirst(){
    this.firstEditIconVisible = true;
  }

  mouseLeaveFirst(){
    this.firstEditIconVisible = false;
  }

  mouseEnterSecond(){
    this.secondEditIconVisible = true;
  }

  mouseLeaveSecond(){
    this.secondEditIconVisible = false;
  }

  mouseEnterThird(){
    this.thirdEditIconVisible = true;
  }

  mouseLeaveThird(){
    this.thirdEditIconVisible = false;
  }

  mouseEnterFourth(){
    this.fourthEditIconVisible = true;
  }

  mouseLeaveFourth(){
    this.fourthEditIconVisible = false;
  }

  openDialog(dialogType: string): void {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '250px',
      data: {company: this.comp, dialogType: dialogType}
    });


    dialogRef.afterClosed().subscribe(async result => {
      if(result != undefined){
       this.oldComp = this.comp
       this.comp = result
       this.isCompanyNeedToBeUpdated = true;
      }
    });


  }

  openConfirmDialog(id: string): void {
    let com = this.userComments.find(value => value.comment.id == id)
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {comment: this.userComments.find(value => value.comment.id == id)}    
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result == "delete"){
        this.messageService.add({severity:'success', summary:'Sikeres törlés'});
        let index = this.userComments.indexOf(com)
        if (index !== -1) {
          this.userComments.splice(index, 1);
        }
        let id = ""
        this.fbService.delete("comments",com.comment.id)
        await this.fbService.getIdFromLinkedDB("company-comments",com.comment.id,"commentId","id").subscribe( async res => {
          this.toBeDeletedId = await res
          this.isCommentNeedToBeDeleted = true;
        })
      }
    });
  }

  deleteComment(){
    this.fbService.delete("company-comments", this.toBeDeletedId[0]).then(value => {this.toBeDeletedId = []})
  }

  createComment(){
    let comment = {
      id: "",
      text: this.form.get("textArea").value.trim(),
      createdBy: this.userService.user.id,
      createdAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      isEdited: false,
      updatedAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      updatedBy: this.userService.user.id,
      userId: this.userService.user.id
    }
    
    this.fbService.add("comments",comment).then(res => {
      this.fbService.add("company-comments",{commentId: res, companyId: this.comp.id})
      comment.id = res
    })

    this.userComments.push({comment: comment, user: this.userService.user, 
      avatar: this.storageService.fileUrl == undefined ? "assets/avatar-icon.png" : this.storageService.fileUrl })
    this.showEditArea.push({id:  comment.id, show: false})
    this.showEditIcon.push({id:  comment.id, show: false})
    this.resetCommentField()

    this.userComments.sort((a,b)=> {
      if(a.comment.createdAt > b.comment.createdAt){
        return -1
      }
      if(a.comment.createdAt == b.comment.createdAt){
        return 0
      }
      if(a.comment.createdAt < b.comment.createdAt){
        return 1
      }
    })
  }

  resetCommentField(){
    this.form.get("textArea").setValue('')
  }

  showIcon(id: string, show: boolean){
    this.showEditIcon.find( value => {
      if(value.id == id){
        value.show = show
      }
      if(value.id != id && value.show == true){
        value.show = false
      }
    })
  }

  isShowIconTrue(id: string): boolean{
    return this.showEditIcon.find( value => (value.id == id)).show
  }

  showArea(id: string, show: boolean, text?: string){
    this.showEditArea.find( value => {
      if(value.id == id){
        value.show = show
        if(show == true){
          this.editForm.get("editTextArea").setValue(text)
          this.valueChange('E')
        }
      }
      if(value.id != id && value.show == true){
        value.show = false
      }
    })
  }

  isShowAreaTrue(id: string): boolean{
    return this.showEditArea.find( value => (value.id == id)).show    
  }

  editComment(id: string){
    let comment = this.userComments.find( com =>{
      if(com.comment.id == id){
        com.comment.updatedAt = Firebase.firestore.Timestamp.fromDate(new Date());
        com.comment.updatedBy = this.userService.user.id
        com.comment.isEdited = true;
        com.comment.text = this.editForm.get("editTextArea").value.trim()
        return com
      }
    })
    this.fbService.update("comments",id ,comment.comment)
    this.showArea(comment.comment.id, false)
    this.editForm.get("editTextArea").setValue('')
  }

  valueChange(id: string) {
    switch(id){
      case "E":
        this.editRemainingText = this.editForm.get("editTextArea").value.length
        break;
      case "C":
        this.commentRemainingText = this.form.get("textArea").value.length
        break;
    }
   }
}


