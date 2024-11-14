import { Routes } from '@angular/router';
import { RegisterComponent } from './Components/User/register/register.component';
import { LoginComponent } from './Components/User/login/login.component';
import { NavbarComponent } from './Components/Shared/navbar/navbar.component';
import { authGuard } from './Guards/auth.guard';
import { CartComponent } from './Components/User/cart/cart.component';
import { adminGuard } from './Guards/admin.guard';
import { CategoriesComponent } from './Components/Admin/categories/categories.component';
import { SourceFilesComponent } from './Components/Admin/source-files/source-files.component';

export const routes: Routes = [
    {path: 'register', component: RegisterComponent },
    {path: 'login', component: LoginComponent},
    {path: 'cart', component: CartComponent, canActivate:[authGuard,adminGuard]},
    {path: 'category', component: CategoriesComponent, canActivate:[authGuard]},
    {path: 'source-file', component: SourceFilesComponent, canActivate:[authGuard]},
];
