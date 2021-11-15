import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/firebase-user.service';

@Component({
  selector: 'fcrm-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.scss'],
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
export class CompanyPageComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.userService.companyPageStart = "sale"
  }

}
