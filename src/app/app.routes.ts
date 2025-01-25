import { Routes } from '@angular/router';
import { RegisterComponent } from './Components/User/register/register.component';
import { LoginComponent } from './Components/User/login/login.component';
import { authGuard } from './Guards/auth.guard';
import { CartComponent } from './Components/User/cart/cart.component';
import { CategoriesComponent } from './Components/Admin/categories/categories.component';
import { SourceFilesComponent } from './Components/Admin/source-files-crud/source-files.component';
import { PackagesComponent } from './Components/Shared/packages/packages.component';
import { PackageDetailComponent } from './Components/Shared/package-detail/package-detail.component';
import { MyPackagesComponent } from './Components/User/my-packages/my-packages.component';
import { EditPackagesComponent } from './Components/Admin/edit-packages/edit-packages.component';
import { AllCategoriesComponent } from './Components/Shared/all-categories/all-categories.component';
import { SuccessComponent } from './Components/User/success/success.component';
import { CancelComponent } from './Components/User/cancel/cancel.component';
import { adminGuard } from './Guards/admin.guard';
import { NotFoundComponent } from './Components/Shared/not-found/not-found.component';
import { HomeComponent } from './Components/Shared/home/home.component';

export const routes: Routes = [
    {path: 'register', component: RegisterComponent },
    {path: 'login', component: LoginComponent},
    {path: 'allcategories', component: AllCategoriesComponent},
    {path: 'home', component: HomeComponent},
    {path: 'packages', component: PackagesComponent},
    {path: 'packages/:category', component: PackagesComponent},
    {path: 'packages/:word', component: PackagesComponent},
    {path: 'detail/:id', component: PackageDetailComponent},
    {path: 'success', component: SuccessComponent},
    {path: 'cancel', component: CancelComponent,canActivate:[authGuard]},

    {path: 'cart', component: CartComponent, canActivate:[authGuard]},
    {path: 'edit-packages', component: EditPackagesComponent, canActivate:[authGuard,adminGuard]},
    {path: 'admin/category', component: CategoriesComponent, canActivate:[authGuard,adminGuard]},
    {path: 'user/mypackages', component: MyPackagesComponent, canActivate:[authGuard]},

    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
];
