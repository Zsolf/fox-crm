import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { IComment } from 'src/app/shared/models/comment.model';
import { IPerson } from 'src/app/shared/models/person.model';
import Firebase from 'firebase';

@Component({
  selector: 'fcrm-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['../main-page.component.scss']
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

    this.person = {
      id: "",
      firstName: "",
      lastName: "",
      position: "",
      email: "",
      phone: ""
    }

    this.comments = []
    this.commentIds = []
    this.showEditIcon = []
    this.showEditArea = []

    this.editRemainingText = 0
    this.commentRemainingText = 0
    this.toBeDeletedId = []

    await this.getData();
    this.firstEditIconVisible = false;

    this.isCommentSet = false;
    this.isCommentNeedToBeDeleted = false;
    await this.getComments()
    

  }

  async getData(){
    await this.fbService.getIdFromLinkedDB("person-comments",this.person.id,"personId","commentId").subscribe(async result => {   
      this.commentIds = await result;
      this.fbReadFinished = true;
    }) ;   
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

  openDialog(): void {
    
  }

  mouseEnterFirst(){
    this.firstEditIconVisible = true;
  }

  mouseLeaveFirst(){
    this.firstEditIconVisible = false;
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
