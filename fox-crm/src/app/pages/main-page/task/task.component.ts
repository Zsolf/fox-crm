import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Firebase from 'firebase';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { StorageService } from 'src/app/services/firebase-file.service';
import { UserService } from 'src/app/services/firebase-user.services';
import { ISale } from 'src/app/shared/models/sale.model';
import { ITask } from 'src/app/shared/models/task.model';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
  selector: 'fcrm-task',
  templateUrl: './task.component.html',
  providers: [ConfirmationService],
  styleUrls: ['./task.component.scss', '../company-page.component.scss', '../summary-page/summary-page.component.scss'],
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
export class TaskComponent implements OnInit {
  @Input() dialog = {show: false, saleForm: {} as ISale , users: []}

  @Output() closeEvent = new EventEmitter<boolean>();

  constructor( private route: ActivatedRoute, private fbService: FirebaseBaseService, private userService: UserService,
     private storageService: StorageService, private confirmationService: ConfirmationService) { }

  selectedUser: any;
  tasks: {task: ITask, user: IUser, avatar: string}[]
  tasksAll: {task: ITask, user: IUser, avatar: string}[]
  hasData : boolean;
  showEditIcon: {id: string, show: boolean} []

  editTask: ITask;
  editId: string;

  onGoingEdit: boolean;
  
  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    dueTo: new FormControl(''),
    description: new FormControl('')

  })

  ngOnInit(): void {
    this.editTask = {} as ITask
    this.showEditIcon = []
    this.editId = "";
    this.tasks = []
    this.tasksAll = []
    this.hasData = false
    this.onGoingEdit = false;
  }

  getTasks(){
    this.fbService.getFilteredByIdList("tasks",this.dialog.saleForm.id, "salesId").subscribe(result => {
      result.forEach(element => {
        if(this.tasksAll.find(elem => {
          return elem.task.id == element.id
        })== undefined && element != undefined){
          this.userService.getById(element.responsibleId).subscribe(res => {
              let av = this.storageService.usersAvatar.find(elem => elem.id == res[0].id).avatar
              if(this.tasksAll.find(elem => elem.task.id == element.id)== undefined && element != undefined){
                if(element.dueTo > Firebase.firestore.Timestamp.fromDate(new Date)){ 
                  this.tasks.push({task: element, user: res[0], avatar: av})
                  this.showEditIcon.push({id: element.id, show: false})
                }
              this.tasksAll.push({task: element, user: res[0], avatar: av})
            
                this.tasks.sort((a,b)=> {
                  if(a.task.dueTo > b.task.dueTo){
                    return 1
                  }
                  if(a.task.dueTo == b.task.dueTo){
                    return 0
                  }
                  if(a.task.dueTo < b.task.dueTo){
                    return -1
                  }
                }
              )
              }
            
          })
        }
      });
    })
  }

  getTask(){
    this.fbService.getById("tasks",this.editId).subscribe(result =>{
      this.editTask = result
      this.form.value.title = result.title
      this.form.value.description = result.description
      this.form.value.dueTo = result.dueTo == null ? null:  new Date(result.dueTo.seconds * 1000);
      this.selectedUser =  this.dialog.users.find(elem => elem.id == result.responsibleId)
    })
  }

  ngDoCheck(): void {
    if(this.dialog.saleForm.id != "" && this.hasData== false && this.dialog.users != undefined){
      this.selectedUser = this.dialog.users[0]
      
      this.getTasks()
      this.hasData = true
    }else if(this.editId != "" && this.onGoingEdit == false && this.dialog.show == true){
        this.onGoingEdit = true;
        this.getTask()
    }
  }

  openEdit(id: string){
    this.editId = id
    this.closeEvent.emit(true)
  }

  close(){
    this.dialog.show = false;
    this.closeEvent.emit(false)
    this.form = new FormGroup({
      title: new FormControl(''),
      dueTo: new FormControl(''),
      description: new FormControl('')
    })
    this.selectedUser = this.dialog.users[0]
    this.onGoingEdit = false;
    this.editId = ""
  }

  saveTask(){
    if(this.editId != ""){
      this.editTask.dueTo = Firebase.firestore.Timestamp.fromDate(this.form.value.dueTo)
      this.editTask.updatedAt = Firebase.firestore.Timestamp.fromDate(new Date()),
      this.editTask.updatedBy = this.userService.user.id,
      this.editTask.responsibleId = this.selectedUser.id
      this.editTask.title = this.form.value.title
      this.editTask.description = this.form.value.description
      this.editTask.saleStatus = this.dialog.saleForm.status

      this.fbService.update("tasks",this.editTask.id, this.editTask)
      this.tasks.forEach(element => {
        if(element.task.id == this.editTask.id){
          this.userService.getById(this.selectedUser.id).subscribe( res =>{
            
          element.task = this.editTask
          element.user = res[0]
          element.avatar = this.storageService.usersAvatar.find(elem => elem.id == element.user.id).avatar
          })
          
          console.log(element)
        }
      });
      this.tasksAll.forEach(element => {
        if(element.task.id == this.editTask.id){
          element.task = this.editTask
        }
      });
      this.close()
      return
    }
    let task = {
      id: "",
      salesId: this.dialog.saleForm.id,
      responsibleId: this.selectedUser.id,
      title: this.form.value.title,
      createdAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      createdBy: this.userService.user.id,
      updatedAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      updatedBy: this.userService.user.id,
      dueTo: this.form.value.dueTo == null ||
        this.form.value.dueTo == "" ? null : Firebase.firestore.Timestamp.fromDate(this.form.value.dueTo),
      companyId: this.dialog.saleForm.companyId,
      saleStatus: this.dialog.saleForm.status,
      description: this.form.value.description
    } as ITask

    this.fbService.add("tasks",task)
    this.close()
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

  confirmDelete(id: string) {
    this.confirmationService.confirm({
        message: 'Biztos szeretnéd törölni ezt a teendőt?',
        header: 'Teendő törlése',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.tasks.forEach(element => {
              if(element.task.id == id){
                this.tasks.splice(this.tasks.indexOf(element),1)
              }
            });
           this.fbService.delete("tasks", id)
        },
        reject: (type) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    
                break;
                case ConfirmEventType.CANCEL:
                    
                break;
            }
        }
    });
}


}
