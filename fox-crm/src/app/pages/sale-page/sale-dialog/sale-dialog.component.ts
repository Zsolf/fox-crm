import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { UserService } from 'src/app/services/firebase-user.service';
import { ICompany } from 'src/app/shared/models/company.model';
import { IPerson } from 'src/app/shared/models/person.model';
import { ISale } from 'src/app/shared/models/sale.model';
import Firebase from 'firebase';
import { IHistory } from 'src/app/shared/models/sales-history.model';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'fcrm-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.scss'],
})
export class SaleDialogComponent implements OnInit {

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig, private fbService: FirebaseBaseService
    , private userService: UserService, private messageService: MessageService) { }

  selectedStatus: {name: string, id: string}

  statuses: {name: string, id: string}[]

  selectedCompany: any

  users: any[];

  selectedUser: any;

  biggestId: string;

  companies: {company: ICompany, contact: IPerson}[]
  filteredCompany: ICompany[]

  companyForm: FormGroup;
  personForm: FormGroup;

  ngOnInit(): void {
    this.biggestId = "0"

    this.companyForm = new FormGroup({
      name: new FormControl(''),
      ceoName: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      taxNumber: new FormControl(''),
      webpage: new FormControl(''),
      address: new FormControl(''),
    })

    this.personForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      position: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
    })

    this.statuses =[{
      name: "Felmérés", id: "Survey"
    },{
      name: "Folyamatban van", id: "In Progress"
    }]

    this.selectedStatus = this.statuses[0]

    this.companies = []
    this.filteredCompany = []

    this.getData()
  }

  getData(){
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
      }
    })

    this.config.data.companies.forEach(element => {
      this.fbService.getById("persons",element.contactPersonId).subscribe(result =>{
        if(this.companies.find(elem => elem.contact.id == result.id) == undefined && result != undefined){
            this.companies.push({company: element, contact: result})
            this.filteredCompany.push(element)
        }
      })
    });
    
  }

  filterComp(event){
    this.filteredCompany = []
    this.companies.forEach(element => {
      if(element.company.name.toLowerCase().includes(event.query.toLowerCase())){
        this.filteredCompany.push(element.company)
      }
    });
  }

  choosedComp(event){
    let company = this.companies.find(elem => elem.company.id == event.id)

    this.companyForm.value.name = company.company.name
    this.companyForm.value.ceoName = company.company.ceoName
    this.companyForm.value.email = company.company.email
    this.companyForm.value.phone = company.company.phone
    this.companyForm.value.taxNumber = company.company.taxNumber
    this.companyForm.value.webpage = company.company.webpage
    this.companyForm.value.address = company.company.address

    this.personForm.value.firstName = company.contact.firstName
    this.personForm.value.lastName = company.contact.lastName
    this.personForm.value.position = company.contact.position
    this.personForm.value.email = company.contact.email
    this.personForm.value.phone = company.contact.phone

    this.fbService.getFilteredByIdList("sales",company.company.id,"companyId").subscribe(result =>{
      result.forEach(element => {
        if(Number(element.saleId) >= Number(this.biggestId)){
          this.biggestId = element.saleId
        }
      });
    })

  }

  newSale(){


    let hasData = false;
    let newSale = {
      status: this.selectedStatus.id,
      companyId: "",
      responsibleId: this.selectedUser.id,
      createdAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      createdBy: this.userService.user.id,
      expectedIncome: 0,
      closingIncome: 0,
      concerns: "",
      customerType: "",
      surveyInfo: "",
      progressInfo: "",
      comeFrom: "",
      closingReason: "",

    } as ISale

    let historyEvent = {
      createdAt: Firebase.firestore.Timestamp.fromDate(new Date()),
      createdBy: this.userService.user.id,
      name: "Értékesítés indítása",
    } as IHistory
    
    if(this.companies.find(elem => elem.company.name == this.selectedCompany.name) == undefined){
      
      let newCompany = {
        id: "",
        name: this.selectedCompany, 
        ceoName: this.companyForm.value.ceoName,
        email: this.companyForm.value.email ,
        phone: this.companyForm.value.phone,
        taxNumber: this.companyForm.value.taxNumber ,
        webpage: this.companyForm.value.webpage,
        address: this.companyForm.value.address ,
      } as ICompany

      let newPerson = {
        id: "",
        firstName: this.personForm.value.firstName ,
        lastName: this.personForm.value.lastName ,
        position: this.personForm.value.position ,
        email: this.personForm.value.email ,
        phone: this.personForm.value.phone ,
      } as IPerson

      this.fbService.add("persons", newPerson).then(result =>{
        newCompany.contactPersonId = result
        this.fbService.add("companies", newCompany).then(res =>{
          newSale.companyId = res
          newSale.saleId = "1"
          this.fbService.add("sales", newSale).then(r =>{
            historyEvent.salesId = r
            this.fbService.add("sales-history",historyEvent).then( () =>{
                this.ref.destroy()
                 this.ref.close()
            })
          })
        })
      })

    }else{
      newSale.companyId = this.selectedCompany.id
     
        newSale.saleId = (Number(this.biggestId) + 1).toString()
        if(hasData == false){
        this.fbService.add("sales",newSale).then(res =>{
          historyEvent.salesId = res
          hasData = true
          this.fbService.add("sales-history",historyEvent).then(r =>{
            this.ref.destroy()
            this.ref.close()
          })
        })
       }
    }

    this.messageService.add({severity:'success', summary:'Sikeres létrehozás'});

  }

  

}
