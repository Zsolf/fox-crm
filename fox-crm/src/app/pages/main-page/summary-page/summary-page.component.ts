import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/firebase-file.service';
import { UserService } from 'src/app/services/firebase-user.services';
import Firebase from 'firebase';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { ISale } from 'src/app/shared/models/sale.model';


@Component({
  selector: 'fcrm-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['../company-page.component.scss', './summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {

  constructor(private userService: UserService, private fileService: StorageService, private route:ActivatedRoute, private fbService: FirebaseBaseService) { }

  statuses: any[]

  options: string[];

  users: any[];

  selectedUser: any;

  uploadedFiles: any[] = [];

  productGroups: string[];

  displayClosing: boolean;

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
    this.displayClosing = false;
    this.selectedUser = []
    this.productGroups = []
    this.route.params.subscribe(result =>{
      console.log(result)
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
    console.log(this.userService.user)
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
    this.form.value.status = status;
    this.saveSale();
    this.displayClosing=false
    this.changeTimeLine()
  }

  deleteSale(){

  }


}
