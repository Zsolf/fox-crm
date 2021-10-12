import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { CompanyPageComponent } from './pages/main-page/company-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { SalePageComponent } from './pages/sale-page/sale-page.component';

const routes: Routes = [ 
  { path: 'products', component: ProductPageComponent},
  { path: 'company', component: CompanyPageComponent},
  { path: 'sale', component: SalePageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
