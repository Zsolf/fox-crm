import { Component, OnInit } from '@angular/core';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { ICompany } from 'src/app/shared/models/company.model';
import { IPerson } from 'src/app/shared/models/person.model';
import { MatDialog} from '@angular/material/dialog';
import { CompanyDialogComponent } from './company-dialog/company-dialog.component';
import { IComment } from 'src/app/shared/models/comment.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Firebase from 'firebase';

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

  
  form: FormGroup = new FormGroup ({
    textArea: new FormControl('', Validators.maxLength(500))
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
          }) == undefined){
          this.comments.push(result)
          this.showEditIcon.push({id: result.id, show: false})
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
      console.log(result);
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

  createComment(){
    let comment = {
      id: "",
      text: this.form.get("textArea").value,
      createdBy: "Én",
      createdAt: Firebase.firestore.Timestamp.fromDate(new Date())
    }
    
    this.fbService.add("comments",comment).then(res => {
      this.fbService.add("company-comments",{commentId: res, companyId: this.comp.id})
      comment.id = res
    })
    this.comments.push(comment)
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
    console.log(this.showEditIcon)
  }

  isShowIconTrue(id: string): boolean{
    let elem = this.showEditIcon.find( value => (value.id == id))
    return elem.show
  }


}


