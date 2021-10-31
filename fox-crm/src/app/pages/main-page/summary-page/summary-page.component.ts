import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/firebase-file.service';
import { UserService } from 'src/app/services/firebase-user.services';
import Firebase from 'firebase';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { ISale } from 'src/app/shared/models/sale.model';
import { IHistory } from 'src/app/shared/models/sales-history.model';

type TimeStamp = Firebase.firestore.Timestamp;


@Component({
  selector: 'fcrm-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['../company-page.component.scss', './summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {

  constructor(private userService: UserService, private fileService: StorageService, private route:ActivatedRoute,
     private fbService: FirebaseBaseService, private storageService: StorageService) { }

  statuses: any[]

  options: string[];

  users: any[];

  selectedUser: any;

  uploadedFiles: any[] = [];

  productGroups: string[];

  displayClosing: boolean;

  oldSale: ISale;
  newSale: ISale;

  oldStatus: string;
  newStatus: string;

  histories: {history: IHistory[], avatar: string}[]

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    saleId: new FormControl(''),
    status: new FormControl(''),
    companyId: new FormControl(''),
    responsibleId: new FormControl(''), 
    expectedDate: new FormControl(''), 
    products: new FormControl([]), 
    createdAt: new FormControl(''),
    createdBy: new FormControl(Firebase.firestore.Timestamp.fromDate(new Date())),
    closingDate: new FormControl(''),
    expectedIncome: new FormControl(''),
    closingIncome: new FormControl(''),
    concerns: new FormControl(''),
    closingReason: new FormControl(''),
    customerType: new FormControl('Egyszeri'), 
    surveyInfo: new FormControl(''),
    progressInfo: new FormControl(''),
    comeFrom: new FormControl('Ajánlás'), 

  })

  ngOnInit(): void {
    this.histories = []
    this.oldSale = {} as ISale;
    this.newSale = {} as ISale;
    this.oldStatus = ""
    this.newStatus = ""
    this.displayClosing = false;
    this.selectedUser = []
    this.productGroups = []
    this.route.params.subscribe(result =>{
      this.form.value.companyId = result['comp']
      if(result['sale'] != undefined){
      this.form.value.saleId = result['sale']
      }
    })
 
    this.changeTimeLine()

    this.options = [ "Ajánlás", "Hirdetés", "Megkeresés", "Már ügyfelünk"]
    this.getData();
    this.getFile();
  }

  getData(){
    this.form.value.createdBy = this.userService.user.id
    this.userService.getAll().subscribe(result =>{
      if(result != undefined && result != null){
        this.users = []
        result.forEach(element => {
          let name = this.userService.user.firstName == element.firstName && this.userService.user.lastName == element.lastName ?
          "(Én) " + element.lastName + " " + element.firstName :  element.lastName + " " + element.firstName;
          this.users.push({name: name, id: element.id})
        });
        this.users.sort((a: any, b: any): any =>{
          if(a.name.charAt(0) == '('){
            return -1
          }
          if(b.name.charAt(0) == '('){
            return 1
          }

          if(b.name < a.name){
            return 1
          }

          if(b.name > a.name){
            return 1
          }

        })
        this.selectedUser = this.users[0]
        this.changeTimeLine()
      }
    })
    this.fbService.getAll("groups").subscribe(result =>{
      if(result != null || result != undefined){
        result.forEach(element => {
          this.productGroups.push(element.name)
        });
      }
    })
    this.fbService.getByTwoElements("sales","companyId", this.form.value.companyId, "saleId", this.form.value.saleId).subscribe(result =>{
      this.oldSale = result[0];
      this.newSale = result[0];
      this.newStatus = result[0].status;
      this.form.value.id = result[0].id;
      this.form.value.responsibleId = result[0].responsibleId; 
      this.selectedUser = this.users.find(res => res.id == result[0].responsibleId)
      this.form.value.createdAt = result[0].createdAt;
      this.form.value.createdBy = result[0].createdBy;
      this.form.value.concerns = result[0].concerns;
      this.form.value.surveyInfo = result[0].surveyInfo;
      this.form.value.comeFrom = result[0].comeFrom;
      this.form.value.customerType = result[0].customerType;
      this.form.value.status = result[0].status;
      this.form.value.expectedDate =  result[0].expectedDate == null ? null:  new Date(result[0].expectedDate.seconds * 1000);
      this.form.value.expectedIncome = result[0].expectedIncome;
      this.form.value.products = result[0].products;
      this.form.value.closingDate =  result[0].closingDate == null ? null : new Date(result[0].closingDate.seconds * 1000);
      this.form.value.closingIncome = result[0].closingIncome;
      this.form.value.closingReason = result[0].closingReason;
      this.form.value.progressInfo = result[0].progressInfo;
      this.fbService.getFilteredByIdList("sales-history", result[0].id, "salesId").subscribe( res =>{
        res.forEach(element => {
          this.storageService.getAvatarFile(element.createdBy).subscribe(r => {
            this.histories.push({history: element, avatar: r})
            
          },error =>{
            this.histories.push({history: element,  avatar: "assets/avatar-icon.png" })
          })
        });

      })
      
      this.changeTimeLine()
    })


  }

  ngDoCheck(): void {
  }

  changeTimeLine(){
    this.statuses = [
      {status: 'Felmérés',icon: 'pi pi-search', color: this.form.value.status != 'Survey' ? "rgba(0,0,0,0.1)" : '#E8591B'},
      {status: 'Folyamatban', icon: 'pi pi-spinner', color: this.form.value.status != 'In Progress' ? "rgba(0,0,0,0.1)" : '#673AB7'},
      {status: 'Lezárt', icon: 'pi pi-question-circle', color: "rgba(0,0,0,0.1)"}
    ];

    if(this.form.value.status == 'closedOk'){
      this.statuses[2] = {status: 'Lezárt', icon: 'pi pi-check-circle', color: "rgb(104, 180, 104)"}
    }else if(this.form.value.status == 'closedNo'){
      this.statuses[2] = {status: 'Lezárt', icon: 'pi pi-times-circle', color: "rgb(221, 70, 70)"}
    }else{
      this.statuses[2] ={status: 'Lezárt', icon: 'pi pi-question-circle', color: "rgba(0,0,0,0.1)"}
    }
  }

  saveSale(){
    let sale = {
      id: this.form.value.id,
      saleId: this.form.value.saleId,
      status: this.form.value.status,
      companyId: this.form.value.companyId,
      responsibleId: this.selectedUser.id, 
      expectedDate: this.form.value.expectedDate == null ||
       this.form.value.expectedDate == "" ? null : Firebase.firestore.Timestamp.fromDate(this.form.value.expectedDate) ,
      products: this.form.value.products,
      createdAt: this.form.value.createdAt,  
      createdBy: this.form.value.createdBy,     
      closingDate: this.form.value.closingDate == null ||
       this.form.value.closingDate == "" ? null : Firebase.firestore.Timestamp.fromDate(this.form.value.closingDate),
      expectedIncome: this.form.value.expectedIncome, 
      closingIncome: this.form.value.closingIncome,
      concerns: this.form.value.concerns,
      closingReason: this.form.value.closingReason,
      customerType: this.form.value.customerType,
      surveyInfo: this.form.value.surveyInfo,    
      progressInfo: this.form.value.progressInfo,   
      comeFrom: this.form.value.comeFrom 
    } as ISale

    this.newSale = sale;
    if((this.oldStatus != "closedOk" && this.oldStatus != "closedNo") || this.newStatus != "In Progress" ){
      this.raiseHistoryEvent("Módosítás", this.newSale, this.oldSale);
    }
    
    this.fbService.update("sales",sale.id,sale)
    
  }

  getFile(){
    this.fileService.getSaleFile(this.form.value.companyId, "1").subscribe(result => {
      this.uploadedFiles = [result]
    })
  }

  onUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles = []
        this.uploadedFiles =["Sikeres feltöltés"];
        this.fileService.uploadSaleFile(this.form.value.companyId, "1",file)
    }
  }

  showDialog(){
    this.displayClosing = true;
  }

  changeStatus(status: string){
    this.form.value.closingDate = null;
    this.form.value.closingReason = ""
    this.form.value.closingIncome = ""
    this.oldStatus = this.form.value.status
    this.form.value.status = status;
    this.newStatus = status
    this.saveSale();
    this.displayClosing=false
    this.changeTimeLine()
    this.raiseStatusEvent(this.oldStatus, this.newStatus)
  }



  raiseHistoryEvent(title: string, newSale: ISale, oldSale: ISale){
    if(newSale == oldSale){
      return
    }
    let saleHistory ={
      id: "",
      createdAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      createdBy: this.userService.user.id,
      name: title,
      salesId: oldSale.id,
      dataName: [],
      oldData: [],
      newData: []
    } as IHistory

    for(let itemOld of Object.entries(oldSale)){
      for(let itemNew of Object.entries(newSale)){
        if(itemOld[0] == itemNew[0] && itemOld[1] !== itemNew[1] && itemOld[0] != 'status'){
          if(typeof itemOld[1] == 'object'){ 
            if(itemOld[0] == 'products'){
              let productsOld = ""
              let productsNew = ""
              itemOld[1].forEach(element => {
                productsOld += element + ", "
              });
              productsOld = productsOld.slice(0,-2)

              itemNew[1].forEach(element => {
                productsNew += element + ", "
              });
              productsNew = productsNew.slice(0,-2)
              saleHistory.dataName.push(this.getOriginalName(itemOld[0]))
              saleHistory.oldData.push(productsOld)
              saleHistory.newData.push(productsNew)
            }else if(itemOld[1] == null || itemNew[1] == null){
              saleHistory.dataName.push(this.getOriginalName(itemOld[0]))
              
              saleHistory.oldData.push(itemOld[1] == null ? " " : 
              new Date(itemOld[1].seconds *1000).getFullYear() + "-" + (new Date(itemOld[1].seconds *1000).getMonth()+ 1)  + "-" + new Date(itemOld[1].seconds *1000).getDate()  )
              
              saleHistory.newData.push(itemNew[1] == null ? " " :             
               new Date(itemNew[1].seconds *1000).getFullYear() + "-" + (new Date(itemNew[1].seconds *1000).getMonth()+ 1)  + "-" + new Date(itemNew[1].seconds *1000).getDate()  )
            
              }else if(itemOld[1].seconds *1000 != itemNew[1].seconds * 1000){

              saleHistory.dataName.push(this.getOriginalName(itemOld[0]))
              saleHistory.oldData.push(new Date(itemOld[1].seconds *1000).getFullYear() + "-" + (new Date(itemOld[1].seconds *1000).getMonth() + 1) + "-" + new Date(itemOld[1].seconds *1000).getDate())
              saleHistory.newData.push(new Date(itemNew[1].seconds *1000).getFullYear() + "-" + (new Date(itemNew[1].seconds *1000).getMonth() + 1) + "-" + new Date(itemNew[1].seconds *1000).getDate())
            }
          }else{
            if(itemOld[0] == 'responsibleId'){
              saleHistory.dataName.push("Felelős kolléga")
              saleHistory.oldData.push(this.users.find(res => res.id == itemOld[1]).name.charAt(0) == '(' ? this.users.find(res => res.id == itemOld[1]).name.slice(5) : this.users.find(res => res.id == itemOld[1]).name )
              saleHistory.newData.push(this.selectedUser.name.charAt(0) == '(' ? this.selectedUser.name.slice(5) : this.selectedUser.name)
            }else{
              saleHistory.dataName.push(this.getOriginalName(itemOld[0]))
              saleHistory.oldData.push(itemOld[1])
              saleHistory.newData.push(itemNew[1])
            }
          }
        }
      }
    }

    if(saleHistory.dataName != [] && saleHistory.newData.length != 0){
      this.fbService.add("sales-history",saleHistory)
    }

  }

  raiseStatusEvent(oldStatus: string, newStatus: string){
    let saleHistory ={
      id: "",
      createdAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      createdBy: this.userService.user.id,
      name: "Státuszváltozás",
      salesId: this.form.value.id,
      dataName: [],
      oldData: [],
      newData: []
    } as IHistory

    if(oldStatus != newStatus && oldStatus != null && newStatus != null){
      saleHistory.dataName.push("Státusz")
      saleHistory.oldData.push(this.getOriginalName(oldStatus))
      saleHistory.newData.push(this.getOriginalName(newStatus))
      this.fbService.add("sales-history",saleHistory)
    }
  }

  getOriginalName(name: string): string{
    switch(name){
      case 'status':
        return 'Státusz'
      case 'expectedDate':
        return 'Várható befejezés dátuma'
      case 'products':
        return 'Termékcsoportok'
      case 'closingDate':
        return 'Befejezés dátuma'
      case 'expectedIncome':
        return 'Várható bevétel'
      case 'closingIncome' :
        return 'Bevétel'
      case 'concerns':
        return 'Aggályok'
      case 'closingReason':
        return 'Lezárás oka'
      case 'customerType':
        return 'Ügyfél típusa'
      case 'surveyInfo':
        return 'Felmérési infó'
      case 'progressInfo':
        return 'Értékesítési infók'
      case 'comeFrom':
        return 'Honnan jött'
      case 'In Progress':
        return 'Folyamatban van'
      case 'closedOk':
        return 'Lezárt (Sikeres)'
      case 'closedNo':
        return 'Lezárt (Sikertelen)'
      case 'Survey':
        return 'Felmérés'
    }
  }

  deleteSale(){

  }


}
