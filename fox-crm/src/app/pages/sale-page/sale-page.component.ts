import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import { FirebaseBaseService } from 'src/app/services/firebase-base.service';
import { ICompany } from 'src/app/shared/models/company.model';
import { SaleDialogComponent } from './sale-dialog/sale-dialog.component';
import { ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/firebase-user.services';

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

    tree: TreeNode[][]
    closedTree: TreeNode[][]

    companies: ICompany[]

    tmp: any []

    ngOnInit(): void {
      this.modeSelect = false
      this.tree = [[]]
      this.closedTree = [[]]
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
      this.router.navigateByUrl("/company/"+company.id+"/"+companyTree.children[companyTree.children.length-1].label[1])
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
            let isFind = false;
                  if(el.status == "closedOk" || el.status == "closedNo"){
                    closedChildren.push({label: "#"+el.saleId, styleClass: this.getStyleClass(el.status), companyId: element.id })
                  }else{
                  children.push({label: "#"+el.saleId, styleClass: this.getStyleClass(el.status), companyId: element.id })
                  }
          
          });
          children.sort((a: any, b: any): any =>{
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
  }

}
