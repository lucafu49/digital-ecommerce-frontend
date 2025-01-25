import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, Inject, inject, OnInit, PLATFORM_ID} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Category } from '../../../Interfaces/category';
import { DataService } from '../../../Services/data.service';
import { error } from 'node:console';
import { AuthService } from '../../../Services/auth.service';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  activeDropdown: string | null = null;
  isMenuOpen: boolean = false;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  categories : Category[] = [];
  message : string = '';
  toastr= inject(ToastrService);


  constructor(
    private dService: DataService,
    private authService: AuthService, private router:Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
async getPopularCategories() {
  if (isPlatformBrowser(this.platformId)) {
    try {
      const data = await this.dService.getPopularCategories().toPromise();
      if (data) {
        console.log('Datos recibidos:', data);
        this.categories = data.categories || [];
        this.cdr.detectChanges();
      } else {
        console.warn('No se recibieron datos');
        this.categories = [];
      }
    
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error en getPopularCategories:', error);
      this.categories = [];
    }
  } else {
  }
}


ngOnInit() {

  this.authService.isLoggedIn$.subscribe((loggedIn) => {
    this.isLoggedIn = loggedIn;
    this.cdr.detectChanges();
  });

  this.authService.isAdmin$.subscribe((admin) => {
    this.isAdmin = admin;
    this.cdr.detectChanges();
  });

  this.getPopularCategories();
  

}

updateUserState() {
  this.isLoggedIn = this.authService.isLoggedIn();
  this.isAdmin = this.authService.isUserAdmin();
}

logout() {
  this.authService.logout();
  this.updateUserState();
  this.router.navigate(['/login']);
}

closeMenu() {

  const menuBar = document.getElementById('menu-bar') as HTMLInputElement;
  if (menuBar) {
    menuBar.checked = false;
  }
}

checkAdmin():boolean{
  if(this.authService.isUserAdmin()) {
    return true;
  } else{
    this.toastr.warning('Admin privileges are required to access this section.');
    return false;
  }
}

}
