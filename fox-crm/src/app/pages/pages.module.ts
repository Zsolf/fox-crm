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
import { FieldsetModule } from 'primeng/fieldset'
import {TimelineModule} from 'primeng/timeline';
import {DropdownModule} from 'primeng/dropdown';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {ListboxModule} from 'primeng/listbox';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';




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
    ProfilePageModule,
    FieldsetModule,
    TimelineModule,
    DropdownModule,
    SelectButtonModule,
    InputTextareaModule,
    FileUploadModule,
    HttpClientModule,
    ListboxModule,
    CalendarModule,
    DialogModule,
    DividerModule
  ],
  exports: []
})
export class PagesModule { }
