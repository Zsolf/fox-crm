import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { CompanyPageComponent } from './pages/main-page/company-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SalePageComponent } from './pages/sale-page/sale-page.component';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { StatisticPageComponent } from './pages/statistic-page/statistic-page.component';
import { AuthGuard } from './shared/guards/auth.guards';

const routes: Routes = [ 
  { path: 'home', component: StartPageComponent, canActivate: [AuthGuard]},
  { path: 'products', component: ProductPageComponent, canActivate: [AuthGuard]},
  { path: 'statistic/:type', component: StatisticPageComponent, canActivate: [AuthGuard]},
  { path: 'company/:comp/:sale', component: CompanyPageComponent, canActivate: [AuthGuard]},
  { path: 'sale', component: SalePageComponent, canActivate: [AuthGuard]},
  { path: 'my-profile', component: ProfilePageComponent, canActivate: [AuthGuard]},
  { path: 'profile/:uid', component: ProfilePageComponent, canActivate: [AuthGuard]},
  { path: 'registration', component: RegistrationComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }]

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
