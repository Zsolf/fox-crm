import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { CompanyPageComponent } from './pages/main-page/company-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SalePageComponent } from './pages/sale-page/sale-page.component';
import { AuthGuard } from './shared/guards/auth.guards';

const routes: Routes = [ 
  { path: 'products', component: ProductPageComponent, canActivate: [AuthGuard]},
  { path: 'company', component: CompanyPageComponent, canActivate: [AuthGuard]},
  { path: 'sale', component: SalePageComponent, canActivate: [AuthGuard]},
  { path: 'my-profile', component: ProfilePageComponent,},
  { path: 'registration', component: RegistrationComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }]

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
