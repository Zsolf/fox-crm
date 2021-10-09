import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { IComment } from 'src/app/shared/models/comment.model';
import { IPerson } from 'src/app/shared/models/person.model';
import Firebase from 'firebase';
import { ConfirmDialogComponent } from '../company-data-page/confirm-dialog/confirm-dialog.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'fcrm-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['../company-page.component.scss', './contact-page.component.scss'],
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
export class ContactPageComponent implements OnInit {

  constructor( private fbService: FirebaseBaseService, public dialog: MatDialog) { }

  person: IPerson;

  comments: IComment[];
  commentIds: string[];
  toBeDeletedId: string[];

  isCommentSet: boolean;
  fbReadFinished: boolean;
  isCommentNeedToBeDeleted: boolean;
  firstEditIconVisible: boolean;
  secondEditIconVisible: boolean;

  showEditIcon: {id: string, show: boolean}[];
  showEditArea: {id: string, show: boolean}[];

  editRemainingText: number;
  commentRemainingText: number;

  
  form: FormGroup = new FormGroup ({
    textArea: new FormControl('', Validators.maxLength(500))
  })

  editForm: FormGroup = new FormGroup({   
    editTextArea: new FormControl('', Validators.maxLength(500))
  })

  async ngOnInit(): Promise<void> {

    this.person = {} as IPerson

    this.comments = []
    this.commentIds = []
    this.showEditIcon = []
    this.showEditArea = []

    this.editRemainingText = 0
    this.commentRemainingText = 0
    this.toBeDeletedId = []

    await this.getData();
    this.firstEditIconVisible = false;
    this.secondEditIconVisible = false;
    this.isCommentSet = false;
    this.isCommentNeedToBeDeleted = false;
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
  }

  async getData(){
    await this.fbService.getById("persons","uZVmugS6F4jN1WbfLInz").subscribe(async result =>{
      this.person = result

    await this.fbService.getIdFromLinkedDB("person-comments",this.person.id,"personId","commentId").subscribe(async result => {   
      this.commentIds = await result;
      this.fbReadFinished = true;
    }) ;  
  }) 
  }

  getComments(){
    this.commentIds.forEach(element => {
      this.fbService.getById("comments",element).subscribe(async result =>{
        if(this.comments.find(elem =>{ 
          return elem.id == element
        }) == undefined && result != undefined){
          this.comments.push(result)
          this.showEditIcon.push({id: result.id, show: false})
          this.showEditArea.push({id: result.id, show: false})
        }
        this.comments.sort((a,b)=> {
          if(a.createdAt > b.createdAt){
            return 1
          }
          if(a.createdAt == b.createdAt){
            return 0
          }
          if(a.createdAt < b.createdAt){
            return -1
          }
        }
      )
      })
    });
  }

  openDialog(dialogType: string): void {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '250px',
      data: {person: this.person, dialogType: dialogType}
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.person = result

        this.fbService.update("persons",this.person.id, this.person)
      }
    });


  }

  openConfirmDialog(id: string): void {
    let com = this.comments.find(value => value.id == id)
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {comment: this.comments.find(value => value.id == id)}    
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result == "delete"){
        let index = this.comments.indexOf(com)
        if (index !== -1) {
          this.comments.splice(index, 1);
        }
        let id = ""
        this.fbService.delete("comments",com.id)
        await this.fbService.getIdFromLinkedDB("person-comments",com.id,"commentId","id").subscribe( async res => {
          this.toBeDeletedId = await res
          this.isCommentNeedToBeDeleted = true;
        })
      }
    });
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

  deleteComment(){
    this.fbService.delete("person-comments", this.toBeDeletedId[0]).then(value => {this.toBeDeletedId = []})
  }

  createComment(){
    let comment = {
      id: "",
      text: this.form.get("textArea").value.trim(),
      createdBy: "Én",
      createdAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      isEdited: false,
      updatedAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      updatedBy: "Én"
    }
    
    this.fbService.add("comments",comment).then(res => {
      this.fbService.add("person-comments",{commentId: res, personId: this.person.id})
      comment.id = res
    })
    this.comments.push(comment)
    this.showEditArea.push({id:  comment.id, show: false})
    this.showEditIcon.push({id:  comment.id, show: false})
    this.resetCommentField()
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
    let comment = this.comments.find( com =>{
      if(com.id == id){
        com.updatedAt = Firebase.firestore.Timestamp.fromDate(new Date());
        com.isEdited = true;
        com.text = this.editForm.get("editTextArea").value.trim()
        return com
      }
    })
    this.fbService.update("comments",id ,comment)
    this.showArea(comment.id, false)
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
