import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { StorageService } from 'src/app/services/firebase-file.service';
import { UserService } from 'src/app/services/firebase-user.service';
import { ICompany } from 'src/app/shared/models/company.model';
import { ISale } from 'src/app/shared/models/sale.model';
import { IHistory } from 'src/app/shared/models/sales-history.model';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
  selector: 'fcrm-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['../main-page/company-page.component.scss','./start-page.component.scss','../main-page/summary-page/summary-page.component.scss'],
  animations: [  trigger('fadeAnimation', [

    state('in', style({opacity: 1})),

    transition(':enter', [
      style({opacity: 0}),
      animate(600 )
    ]),

    transition(':leave',
      animate(600, style({opacity: 0})))
  ])]
})
export class StartPageComponent implements OnInit {

  constructor(private userService: UserService, private fbService: FirebaseBaseService, private storageService: StorageService) { }

  isDataSet: boolean

  ngOnInit(): void {
    this.groupedHistories = []
    this.isDataSet = false;
  }

  groupedHistories: {company: ICompany, history: IHistory, user: IUser, avatar: string, sale: ISale}[]

  getUser(): IUser{
    return this.userService.user
  }

  getHistories(){
    this.fbService.getFilteredByIdList("sales",this.userService.user.id,"responsibleId").subscribe(result =>{
      result.forEach(sale => {
        this.fbService.getById("companies",sale.companyId).subscribe(res =>{
          this.fbService.getLimitedList("sales-history",sale.id,"salesId").subscribe(r =>{
              r.forEach(history => { 
                this.userService.getById(history.createdBy).subscribe(resu =>{
                if(this.groupedHistories.find(elem =>{
                  return elem.history.id == history.id
                })== undefined && sale.status != "closedOk" && sale.status != "closedNo"){
                    let av = this.storageService.usersAvatar.find(elem => elem.id == resu[0].id).avatar
                    this.groupedHistories.push({company: res, sale: sale, history: history, user: resu[0], avatar: av})
                    this.groupedHistories.sort((a,b)=> {
                      if(a.history.createdAt > b.history.createdAt){
                        return -1
                      }
                      if(a.history.createdAt == b.history.createdAt){
                        return 0
                      }
                      if(a.history.createdAt < b.history.createdAt){
                        return 1
                      }
                    }
                  )
                }
                })
              })
          })
        })
      });
    })
  }

  ngDoCheck(): void {
    if(this.userService.user != undefined && this.storageService.usersAvatar.length > 0 && this.isDataSet == false){
    this.getHistories()
    this.isDataSet = true
    }
  }


}
