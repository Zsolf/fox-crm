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
import { MatTableModule} from '@angular/material/table';
import { ProductDialogComponent } from './product-page/product-dialog/product-dialog.component'
import { MatSortModule } from '@angular/material/sort';
import { BrowserModule } from '@angular/platform-browser';
import { SalePageModule } from './sale-page/sale-page.module';
import { ProfilePageModule } from './profile-page/profile-page.module';

@NgModule({
  declarations: [CompanyPageComponent, 
    CompanyDataPageComponent, 
    ContactPageComponent, 
    SummaryPageComponent, 
    CompanyDialogComponent,
    ConfirmDialogComponent,
    ContactDialogComponent,
    ProductPageComponent,
    ProductDialogComponent,],
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    BrowserModule,
    SalePageModule,
    ProfilePageModule
  ],
  exports: []
})
export class PagesModule { }
