import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Category } from '../../../Interfaces/category';
import { DataService } from '../../../Services/data.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [CommonModule,RouterLink,LoadingComponent],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent implements OnInit{
  categories : Category[] = [];
  message : string = '';
  isLoading : boolean = false;

  constructor(
    private dService: DataService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getPopularCategories();
  }

async getPopularCategories() {
  if (isPlatformBrowser(this.platformId)) {
    try {
      const data = await this.dService.getPopularCategories().toPromise();
      if (data) {
        console.log('Datos recibidos:', data);
        this.categories = data.categories || [];
      } else {
        console.warn('No se recibieron datos');
        this.categories = [];
      }
    
      // Forzar la actualización de la vista
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error en getPopularCategories:', error);
      this.categories = [];
    }
  } else {
  }
}

}
