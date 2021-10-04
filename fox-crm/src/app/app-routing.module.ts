import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyDataPageComponent } from './pages/main-page/company-data-page/company-data-page.component';

const routes: Routes = [ 
  { path: 'company', component: CompanyDataPageComponent },
  { path: '**', component: CompanyDataPageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
