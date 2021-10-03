import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainPageComponent } from './main-page/main-page.component';
import { CompanyDataPageComponent } from './main-page/company-data-page/company-data-page.component';
import { ContactPageComponent } from './main-page/contact-page/contact-page.component';
import { SummaryPageComponent } from './main-page/summary-page/summary-page.component';
import { CompanyDialogComponent } from './main-page/company-data-page/company-dialog/company-dialog.component';
import { ConfirmDialogComponent } from './main-page/company-data-page/confirm-dialog/confirm-dialog.component';
import { ContactDialogComponent } from './main-page/contact-page/contact-dialog/contact-dialog.component';

@NgModule({
  declarations: [MainPageComponent, CompanyDataPageComponent, ContactPageComponent, SummaryPageComponent, CompanyDialogComponent, ConfirmDialogComponent, ContactDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [MainPageComponent]
})
export class PagesModule { }
