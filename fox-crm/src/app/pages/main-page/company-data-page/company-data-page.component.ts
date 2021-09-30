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

@Component({
  selector: 'fcrm-company-data-page',
  templateUrl: './company-data-page.component.html',
  styleUrls: ['./company-data-page.component.scss']
})
export class CompanyDataPageComponent implements OnInit {

  constructor( private fbService: FirebaseBaseService, public dialog: MatDialog) { }

  comp: ICompany;
  ceo: IPerson;

  comments: IComment[];
  commentIds: string[];

  firstEditIconVisible: boolean;
  secondEditIconVisible: boolean;
  thirdEditIconVisible: boolean;

  isCommentSet: boolean;
  fbReadFinished: boolean;

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
    this.comp = {
      id: "",
      name: "",
      contactPersonId:"",
      ceoName: "",
      email: "",
      phone: "",
      taxNumber: "",
      address: "",
      webpage: "",
    }


    this.comments = []
    this.commentIds = []
    this.showEditIcon = []
    this.showEditArea = []

    this.editRemainingText = 0
    this.commentRemainingText = 0

    await this.getData();
    this.firstEditIconVisible = false;
    this.secondEditIconVisible = false;
    this.thirdEditIconVisible = false;
    this.isCommentSet = false;
    await this.getComments()
    

  }

  ngDoCheck(){
    if(!this.isCommentSet && this.commentIds.length > 0 && this.fbReadFinished){
    this.getComments()
    this.isCommentSet = true;
    }
  }


    async getData(){
      await this.fbService.getById("companies","3t92wuZZJdLVM0zrUaGB").subscribe(async result =>{
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

  openDialog(dialogType: string): void {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '250px',
      data: {company: this.comp, dialogType: dialogType}
      
    });

    dialogRef.afterClosed().subscribe(result => {
      this.comp.name = result.name
      this.comp.ceoName = result.ceoName
      this.comp.address = result.address
      this.comp.taxNumber = result.taxNumber
      this.comp.email = result.email
      this.comp.phone = result.phone
      this.comp.webpage = result.webpage

      this.fbService.update("companies",this.comp.id, this.comp)
    });


  }

  openConfirmDialog(id: string): void {
    let com = this.comments.find(value => value.id == id)
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {comment: this.comments.find(value => value.id == id)}    
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == "delete"){
        let index = this.comments.indexOf(com)
        if (index !== -1) {
          this.comments.splice(index, 1);
        }
        this.fbService.delete("comments",com.id)
        this.fbService.getIdFromLinkedDB("company-comments",com.id,"commentId","id").subscribe( res => {
          this.fbService.delete("company-comments",res[0])
        })
      }
    });


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
      this.fbService.add("company-comments",{commentId: res, companyId: this.comp.id})
      comment.id = res
    })
    this.comments.push(comment)
    this.showEditArea.push({id:  comment.id, show: false})
    this.showEditIcon.push({id:  comment.id, show: false})
    this.resetCommentField()
    console.log(comment.text)
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


