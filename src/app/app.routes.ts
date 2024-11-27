import { Routes } from '@angular/router';
import { RegisterComponent } from './Components/User/register/register.component';
import { LoginComponent } from './Components/User/login/login.component';
import { authGuard } from './Guards/auth.guard';
import { CartComponent } from './Components/User/cart/cart.component';
import { adminGuard } from './Guards/admin.guard';
import { CategoriesComponent } from './Components/Admin/categories/categories.component';
import { SourceFilesComponent } from './Components/Admin/source-files-crud/source-files.component';
import { PackagesComponent } from './Components/Shared/packages/packages.component';
import { PackageDetailComponent } from './Components/Shared/package-detail/package-detail.component';

export const routes: Routes = [
    {path: 'register', component: RegisterComponent },
    {path: 'login', component: LoginComponent},
    {path: 'cart', component: CartComponent, canActivate:[authGuard]},
    {path: 'category', component: CategoriesComponent, canActivate:[authGuard]},
    {path: 'source-file', component: SourceFilesComponent, canActivate:[authGuard]},
    {path: 'packages', component: PackagesComponent, canActivate:[authGuard]},
    {path: 'detail', component: PackageDetailComponent, canActivate:[authGuard]}
];
