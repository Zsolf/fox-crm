import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { UserService } from 'src/app/services/firebase-user.service';
import { ISale } from 'src/app/shared/models/sale.model';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
  selector: 'fcrm-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss'],
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
export class StatisticPageComponent implements OnInit {

  constructor(private fbService: FirebaseBaseService, private userService: UserService, private route: ActivatedRoute) { }

  sales: ISale[]

  
  data: any;
  productData: {labels: string[], datasets: any[]};
  userData: any;
  financeData: any;

  statusesByMonth: {closedOk: number, closedNo: number, survey: number, inProgress: number }[]
  productsByMonth: {name: string, occurence: number }[][]
  usersStatusesByMonth: {name: string, statuses: {closedOk: number, closedNo: number}}[][]
  financialByMonth: {expectedIncome: number, closingIncome: number}[]

  months = [{name:'Január', id: 0}, {name:'Február', id: 1}, {name:'Március', id: 2}, {name:'Április', id: 3}, {name:'Május', id: 4},
  {name:'Június', id: 5}, {name:'Július', id: 6}, {name:'Augusztus', id: 7}, {name:'Szeptember', id: 8}, {name:'Október', id: 9}, {name:'November', id: 10}, {name:'December', id: 11},]

  products: {id: string, name: string}[]
  users: IUser[]

  selectedMonthStatus: {name: string, id: number}
  selectedMonthFirst: {name: string, id: number}
  selectedMonthSecond: {name: string, id: number}
  selectedMonthUsers: {name: string, id: number}
  chartOptions: any;

  isFinancial: boolean;
  isSale: boolean;

  currentExpectedIncome: number;
  currentClosingIncome: number;

  ngOnInit(): void {

    this.selectedMonthFirst = this.months[new Date().getMonth()]
    this.selectedMonthSecond = this.months[(new Date().getMonth() == 0 ? 12 : new Date().getMonth() - 1)]
    this.selectedMonthStatus = this.months[new Date().getMonth()]
    this.selectedMonthUsers = this.months[new Date().getMonth()]

        this.route.params.subscribe(result =>{
            this.products = []
                this.productsByMonth = []
                this.users = []
                this.statusesByMonth = []
                this.usersStatusesByMonth = []
                this.data = {}
                this.productData = {} as {labels: string[], datasets: any[]};
                this.userData = {};
                this.financialByMonth = []
                this.financeData = {};
                this.currentClosingIncome = 0;
                this.currentExpectedIncome = 0;

                this.isSale = false
                this.isFinancial = true;
                this.fbService.getAll("sales").subscribe(result =>{
                    this.sales = result
                    this.getFirstData()
                    this.getFinancialData()
                    this.fbService.getAll("groups").subscribe(res =>{
                        this.products = res
                        this.getSecondData()
                    })
                    this.fbService.getAll("users").subscribe(res =>{
                        this.users = res
                        this.getUserData()
                    })
                })
            if(result['type'] == 'financial'){
                this.isSale = false
                this.isFinancial = true;
            }else{
                this.isSale = true;
                this.isFinancial = false
            }
        })

        
  }

    ngDoCheck(): void {
    }

    getFinancialData(){
        for (let i = 1; i <= 12; i++) {
            let finance = {expectedIncome: 0, closingIncome: 0}
            this.sales.forEach(element =>{
                if(element.expectedDate != null){
                    let expectedDate = new Date(element.expectedDate.seconds *1000)
                    if(expectedDate.getMonth() + 1 == i && expectedDate.getFullYear() == (new Date().getFullYear())){
                        finance.expectedIncome += element.expectedIncome
                    }
                }
                if(element.closingDate != null){
                    let closingDate = new Date(element.closingDate.seconds *1000)
                    if(closingDate.getMonth() + 1 == i && closingDate.getFullYear() == (new Date().getFullYear())){
                        finance.closingIncome += element.closingIncome
                    }
                }
                
            })
            this.financialByMonth.push(finance)
        }

        let labels = []
        let eData = []
        let cData = []

        for (let i = 0; i <= this.months.length - ( 12 - new Date().getMonth()); i++) {
            eData.push(this.financialByMonth[i].expectedIncome)
            cData.push(this.financialByMonth[i].closingIncome)
            labels.push(this.months[i].name)
        }

        this.financeData = {
            labels: labels,
            datasets: [
                {
                    label: 'Várható bevétel',
                    data: eData,
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: .4
                },
                {
                    label: 'Valódi bevétel',
                    data: cData,
                    fill: true,
                    borderColor: '#E8591B',
                    tension: .4,
                    backgroundColor: 'rgba(232,89,27,0.2)'
                }
            ]
        };

        this.currentExpectedIncome = this.financialByMonth[new Date().getMonth()].expectedIncome
        this.currentClosingIncome = this.financialByMonth[new Date().getMonth()].closingIncome
        
    }

    getUserData(){
        for (let i = 1; i <= 12; i++) {
            let usersName: {name: string, statuses: {closedOk: number, closedNo: number}}[] = []
            this.users.forEach(element =>{
                usersName.push({name: element.lastName + " " + element.firstName, statuses: {closedOk: 0, closedNo : 0}})
            })
            this.sales.forEach(element => {
                let createdAt = new Date(element.createdAt.seconds *1000)
                if(createdAt.getMonth()+1 == i && createdAt.getFullYear() == (new Date().getFullYear())){
                    this.users.forEach(elem =>{
                        if(elem.id == element.responsibleId){
                            usersName.forEach(e =>{
                                if(e.name == (elem.lastName + " " + elem.firstName) && (element.status == "closedOk" || element.status == "closedNo")){
                                   element.status == "closedOk" ? e.statuses.closedOk++ : e.statuses.closedNo++
                                }
                            })
                        }
                    })
                }
            });
            
        this.usersStatusesByMonth.push(usersName)
        }

        let users = this.usersStatusesByMonth[this.selectedMonthUsers.id]
        let labels = []
        this.users.forEach(element => {
            labels.push(element.lastName + " " + element.firstName)
        });
        let data = []
        let data2 = []

        for (let i = 0; i < labels.length; i++) {
            data.push(users.find(e => e.name == labels[i]).statuses.closedOk)
            data2.push(users.find(e => e.name == labels[i]).statuses.closedNo)
        }

        this.userData = {
            labels: labels,
            datasets: [
                {
                    label: 'Lezárt (Sikeres)',
                    backgroundColor: '#7DC17D',
                    data: data
                },
                {
                    label: 'Lezárt (Sikertelen)',
                    backgroundColor: '#E25D5D',
                    data: data2
                }
            ]
            };
    
    }

    getFirstData(){
        for (let i = 1; i <= 12; i++) {
            let statuses = [0,0,0,0]
            this.sales.forEach(element => {
                let createdAt = new Date(element.createdAt.seconds *1000)
            if(createdAt.getMonth()+1 == i && createdAt.getFullYear() == (new Date().getFullYear())){
                element.status == 'Survey' ? statuses[2]++ : element.status == 'In Progress' ? statuses[3]++ : element.status == 'closedNo' ? statuses[1]++ : statuses[0]++
            } 
            });
            this.statusesByMonth.push({closedOk: statuses[0], closedNo: statuses[1], survey: statuses[2], inProgress: statuses[3]})
        }
        let statuses = this.statusesByMonth[this.selectedMonthStatus.id]
        this.data ={
            labels: ['Felmérés', 'Folyamatban van', 'Lezárt (Sikeres)', 'Lezárt (Sikertelen)'],
            datasets: [
                {
                    data: [statuses.survey, statuses.inProgress, statuses.closedOk, statuses.closedNo],
                    backgroundColor: [
                        "#E8591B",
                        "#9680BE",
                        "#7DC17D",
                        "#E25D5D"
                    ],
                    hoverBackgroundColor: [
                        "#E8591B",
                        "#9680BE",
                        "#7DC17D",
                        "#E25D5D"
                    ]
                }
            ]
        }

    }

    getSecondData(){
        for (let i = 1; i <= 12; i++) {
            let productsName: {name: string, occurence: number}[] = []
            this.products.forEach(element => {
                productsName.push({name: element.name, occurence: 0})
            });
            this.sales.forEach(element => {
                let createdAt = new Date(element.createdAt.seconds *1000)
                if(createdAt.getMonth()+1 == i && element.products != null && createdAt.getFullYear() == (new Date().getFullYear())){
                    element.products.forEach(elem =>{
                        productsName.forEach(e => {
                            if(elem == e.name){
                                e.occurence++;
                            }
                        });
                    })
                }
            });
            this.productsByMonth.push(productsName)
        }

        let products = this.productsByMonth[this.selectedMonthFirst.id]
        let productsName: string[] = []
            this.products.forEach(element => {
                productsName.push(element.name)
            });
        let data = []

        let products2 = this.productsByMonth[this.selectedMonthSecond.id] 
        let data2 = []

        for (let i = 0; i < productsName.length; i++) {
            data.push(products.find(e => e.name == productsName[i]).occurence)
            data2.push(products2.find(e => e.name == productsName[i]).occurence)
        }
        
        this.productData ={
            labels: productsName,
            datasets: [
                {
                    label: this.selectedMonthFirst.name + "i termékstatisztika " ,
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: data
                },
                {
                    label: this.selectedMonthSecond.name + "i termékstatisztika " ,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: data2
                }
            ]
        }
    }

    getDarkTheme() {
        return {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            }
        }
    }

    changeMonthFirst(event){
        let products = this.productsByMonth[event.value.id]
        let productsName: string[] = []
            this.products.forEach(element => {
                productsName.push(element.name)
            });
        let data = []

        for (let i = 0; i < productsName.length; i++) {
            data.push(products.find(e => e.name == productsName[i]).occurence)
        }

        let oldDataset = this.productData.datasets[1]
        
        this.productData= {labels: productsName,
            datasets: [
                {
                label: event.value.name + "i termékstatisztika " ,
                backgroundColor: 'rgba(179,181,198,0.2)',
                borderColor: 'rgba(179,181,198,1)',
                pointBackgroundColor: 'rgba(179,181,198,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(179,181,198,1)',
                data: data
                 },
                 oldDataset
             ]
        }

        console.log(this.productData.datasets)
    }

    changeMonthSecond(event){
        let products = this.productsByMonth[event.value.id]
        let productsName: string[] = []
            this.products.forEach(element => {
                productsName.push(element.name)
            });
        let data = []

        for (let i = 0; i < productsName.length; i++) {
            data.push(products.find(e => e.name == productsName[i]).occurence)
        }
        
        let oldDataset = this.productData.datasets[0]
        
        this.productData= {labels: productsName,
            datasets: [
                oldDataset,
                {
                label: event.value.name + "i termékstatisztika " ,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                pointBackgroundColor: 'rgba(255,99,132,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,99,132,1)',
                data: data
                 }
             ]
        }
        console.log(this.usersStatusesByMonth)
        
    }

    changeMonthStatus(event){
        let statuses = this.statusesByMonth[event.value.id]
        this.data ={
            labels: ['Felmérés', 'Folyamatban van', 'Lezárt (Sikeres)', 'Lezárt (Sikertelen)'],
            datasets: [
                {
                    data: [statuses.survey, statuses.inProgress, statuses.closedOk, statuses.closedNo],
                    backgroundColor: [
                        "#E8591B",
                        "#9680BE",
                        "#7DC17D",
                        "#E25D5D"
                    ],
                    hoverBackgroundColor: [
                        "#E8591B",
                        "#9680BE",
                        "#7DC17D",
                        "#E25D5D"
                    ]
                }
            ]
        }
    }

    changeMonthUsers(event){
        let users = this.usersStatusesByMonth[event.value.id]
        let labels = []
        this.users.forEach(element => {
            labels.push(element.lastName + " " + element.firstName)
        });
        let data = []
        let data2 = []

        for (let i = 0; i < labels.length; i++) {
            data.push(users.find(e => e.name == labels[i]).statuses.closedOk)
            data2.push(users.find(e => e.name == labels[i]).statuses.closedNo)
        }

        this.userData = {
            labels: labels,
            datasets: [
                {
                    label: 'Lezárt (Sikeres)',
                    backgroundColor: '#7DC17D',
                    data: data
                },
                {
                    label: 'Lezárt (Sikertelen)',
                    backgroundColor: '#E25D5D',
                    data: data2
                }
            ]
            };
    }


}
