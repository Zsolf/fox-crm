import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageComponent } from './profile-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';



@NgModule({
  declarations: [ProfilePageComponent, PasswordDialogComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ProfilePageModule { }
