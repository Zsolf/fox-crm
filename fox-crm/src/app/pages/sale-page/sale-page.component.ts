import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { ICompany } from 'src/app/shared/models/company.model';
import { SaleDialogComponent } from './sale-dialog/sale-dialog.component';
import { ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/firebase-user.service';

@Component({
  selector: 'fcrm-sale-page',
  templateUrl: './sale-page.component.html',
  providers: [DialogService],
  styleUrls: ['./sale-page.component.scss', '../sale-page/sale-page.component.scss'],
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
export class SalePageComponent implements OnInit {

  constructor (private dialogService: DialogService, private fbService: FirebaseBaseService, private cd: ChangeDetectorRef, 
    private router: Router, private userService: UserService){ }

    data: TreeNode[];
    
    selectedNode: TreeNode;

    modeSelect: boolean;
    oldMode: boolean;

    tree: TreeNode[][]
    closedTree: TreeNode[][]
    allTree: TreeNode[][]

    companies: ICompany[]

    tmp: any []

    saleCounter: number
    saleMax: number

    compCounter: number
    compMax: number

    ngOnInit(): void {
      
      this.fbService.getAll("sales").subscribe(result =>{
        this.saleMax = result.length
      })

      this.fbService.getAll("companies").subscribe(result =>{
        this.compMax = result.length
      })

      this.saleCounter = 0
      this.compCounter = 0
      this.modeSelect = false
      this.oldMode = false
      this.tree = [[]]
      this.closedTree = [[]]
      this.allTree = [[]]
        this.getData()
  }

  onNodeSelect(event) {
    if(event.node.companyId == undefined){
      let companyTree = this.tree.find(elem =>{
        if(elem[0] != undefined){
         return elem[0].label == event.node.label
        }
      })[0]
      let company = this.companies.find(elem => elem.name == event.node.label)
      this.userService.companyPageStart = "company"
      let allTreeItem = this.allTree.find(elem=>{
        if(elem[0] != undefined){
        return elem[0].label == event.node.label
       }
     })[0]
      this.router.navigateByUrl("/company/"+company.id+"/"+allTreeItem.children[allTreeItem.children.length-1].label[1])
    }else{  
      this.router.navigateByUrl("/company/"+event.node.companyId+"/"+event.node.label[1])
    }
  }

  getData(){
    this.fbService.getAll("companies").subscribe(result =>{
      this.companies = result

      result.forEach(element => {
        this.fbService.getFilteredByIdList("sales",element.id,"companyId").subscribe(res =>{
          let isExist = true;
          if(this.tree[0].find(elem => elem.label == element.name) == undefined ){
            let children = []
            let closedChildren = []
          res.forEach(el => {
                  if(el.status == "closedOk" || el.status == "closedNo"){
                  this.saleCounter = this.saleCounter + 1;
                    closedChildren.push({label: "#"+el.saleId, styleClass: this.getStyleClass(el.status), companyId: element.id })
                  }else{
                    
                  this.saleCounter = this.saleCounter + 1;
                  children.push({label: "#"+el.saleId, styleClass: this.getStyleClass(el.status), companyId: element.id })
                  }
          });
          let allChildren = closedChildren.concat(children)
          
          children.sort((a: any, b: any): any =>{
            if(Number(a.label[1]) < Number(b.label[1])){
              return -1
            }
  
            if(Number(a.label[1]) > Number(b.label[1])){
              return 1
            }
  
          })

          closedChildren.sort((a: any, b: any): any =>{
            if(Number(a.label[1]) < Number(b.label[1])){
              return -1
            }
  
            if(Number(a.label[1]) > Number(b.label[1])){
              return 1
            }
  
          })

          allChildren.sort((a: any, b: any): any =>{
            if(Number(a.label[1]) < Number(b.label[1])){
              return -1
            }
  
            if(Number(a.label[1]) > Number(b.label[1])){
              return 1
            }
  
          })

          if (this.tree.find(eleme => {
              if(eleme[0] != undefined){
                return eleme[0].label == element.name
              }
            }
            ) == undefined){
          this.tree.push(new Array ({label: element.name, styleClass: "company", expanded: true , children: children} as TreeNode))
          this.closedTree.push(new Array ({label: element.name, styleClass: "company", expanded: true , children: closedChildren} as TreeNode))
          this.allTree.push(new Array ({label: element.name, styleClass: "company", expanded: true , children: allChildren} as TreeNode))
            this.compCounter++
          } 
          }
        })
      });
    })
  }

  getStyleClass(status: string): string{
    switch(status){
      case 'Survey':
        return 'surveyText'
      case 'In Progress':
        return 'inProgressText'
      case 'closedOk':
        return 'closedOkText'
      case 'closedNo':
        return 'closedNoText'
    }
  }



  showDialog() {
    const ref = this.dialogService.open(SaleDialogComponent, {
        data:{companies: this.companies},
        header: 'Új Értékesítés/Vállalat hozzáadása',
        width: '920px'
        
    });

    ref.onClose.subscribe(res =>{
      this.tree = [[]]
      this.closedTree = [[]]
      this.getData()
      this.cd.detectChanges()
    }) 
  }

  ngDoCheck(): void {
    if(this.oldMode != this.modeSelect){
      this.oldMode = this.modeSelect
      this.tree = [[]]
      this.closedTree = [[]]
      this.getData()
    }
  }

}
