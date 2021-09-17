import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainPageComponent } from './main-page/main-page.component';
import { CompanyDataPageComponent } from './main-page/company-data-page/company-data-page.component';
import { ContactPageComponent } from './main-page/contact-page/contact-page.component';
import { SummaryPageComponent } from './main-page/summary-page/summary-page.component';

@NgModule({
  declarations: [MainPageComponent, CompanyDataPageComponent, ContactPageComponent, SummaryPageComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [MainPageComponent]
})
export class PagesModule { }
