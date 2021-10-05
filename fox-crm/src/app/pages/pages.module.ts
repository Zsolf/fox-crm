import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CompanyPageComponent } from './main-page/company-page.component';
import { CompanyDataPageComponent } from './main-page/company-data-page/company-data-page.component';
import { ContactPageComponent } from './main-page/contact-page/contact-page.component';
import { SummaryPageComponent } from './main-page/summary-page/summary-page.component';
import { CompanyDialogComponent } from './main-page/company-data-page/company-dialog/company-dialog.component';
import { ConfirmDialogComponent } from './main-page/company-data-page/confirm-dialog/confirm-dialog.component';
import { ContactDialogComponent } from './main-page/contact-page/contact-dialog/contact-dialog.component';
import { ProductPageComponent } from './product-page/product-page.component';

@NgModule({
  declarations: [CompanyPageComponent, CompanyDataPageComponent, ContactPageComponent, SummaryPageComponent, CompanyDialogComponent, ConfirmDialogComponent, ContactDialogComponent, ProductPageComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [CompanyPageComponent]
})
export class PagesModule { }
