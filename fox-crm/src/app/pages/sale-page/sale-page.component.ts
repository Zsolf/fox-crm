import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import { SaleDialogComponent } from './sale-dialog/sale-dialog.component';

@Component({
  selector: 'fcrm-sale-page',
  templateUrl: './sale-page.component.html',
  providers: [DialogService],
  styleUrls: ['./sale-page.component.scss', '../sale-page/sale-page.component.scss']
})
export class SalePageComponent implements OnInit {

  constructor (private dialogService: DialogService){ }

    data: TreeNode[];
    
    selectedNode: TreeNode;

    modeSelect: boolean;

    ngOnInit(): void {
        this.data = [{
            label: 'Vállalatok',
            styleClass: 'compRoot',
            expanded: true,
            children: [
                {
                    label: 'Erős Pista kft',
                    styleClass: 'company',
                    expanded: false,
                    children: [
                        {
                            label: '#1',
                            styleClass: 'inProgressText'
                        },
                        {
                            label: '#2',
                            styleClass: 'surveyText',
                        },
                        {
                          label: '#1',
                          styleClass: 'inProgressText',
                      },
                      {
                          label: '#2',
                          styleClass: 'inProgressText',
                      },
                      {
                        label: '#1',
                        styleClass: 'inProgressText',
                    },
                    {
                        label: '#2',
                        styleClass: 'inProgressText',
                    }
                    ]
                },
                {
                    label: 'Világos Cserép Zrt.',
                    styleClass: 'company',
                    expanded: false,
                    children: [
                        {
                            label: '#1',
                            styleClass: 'inProgressText',
                        },
                        {
                            label: '#2',
                            styleClass: 'inProgressText',
                        }
                    ]
                }
            ]
        }];
  }

  onNodeSelect(event) {
    console.log(event)
  }

  showDialog() {
    const ref = this.dialogService.open(SaleDialogComponent, {
        data:{},
        header: 'Új Értékesítés/Vállalat hozzáadása',
        width: '1000px'
    });

    ref.onClose.subscribe()
}

}
