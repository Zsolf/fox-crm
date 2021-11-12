import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalePageComponent } from './sale-page.component';
import {PanelModule} from 'primeng/panel';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {InputSwitchModule} from 'primeng/inputswitch';
import { SharedModule } from 'src/app/shared/shared.module';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { SaleDialogComponent } from './sale-dialog/sale-dialog.component';
import {DividerModule} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {InputNumberModule} from 'primeng/inputnumber';




@NgModule({
  declarations: [SalePageComponent, SaleDialogComponent],
  imports: [
    CommonModule,
    PanelModule,
    OrganizationChartModule,
    InputSwitchModule,
    SharedModule,
    DynamicDialogModule,
    DividerModule,
    DropdownModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    BrowserModule,
    InputNumberModule
  ]
})
export class SalePageModule { }
