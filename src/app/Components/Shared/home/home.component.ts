import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Category } from '../../../Interfaces/category';
import { DataService } from '../../../Services/data.service';
import { LoadingComponent } from '../loading/loading.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoadingComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit{
    packages : any | undefined;
    pageInfo: any | undefined;
    categories : Category[] | undefined;
    message: string | undefined;
    maxPrice : string = "500000000000000000000000000000000000";
    minPrice : string = "0";
    orderBy : string = "timesSold";
    lir : string = "desc";
    page : number = 1;
    isLoading : boolean = true;

    breakpoints: Record<number, { slidesPerView: number }> = {
      480: {
        slidesPerView: 1, // 1 slide visible for small screens
      },
      768: {
        slidesPerView: 2, // 2 slides visible for medium screens
      },
      1024: {
        slidesPerView: 3, // 3 slides visible for larger screens
      }
    };


    constructor(private dService : DataService,    private cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object){}

    ngOnInit(): void {

      this.getPackages();
      this.getPopularCategories();
    }

    async getPackages(){

        if (isPlatformBrowser(this.platformId)) {
          try {
            const data = await this.dService.getPackages(this.page.toString(),this.orderBy,this.lir,this.maxPrice,this.minPrice).toPromise();
            if (data) {
              console.log(data);
              this.packages = data.packages.results;
              this.pageInfo = data.packages;
            } else {
              console.warn('No se recibieron datos');
              this.packages = [];
            }
          

          } catch (error) {
            console.error('Error en getPackages:', error);
            this.packages = [];
          }
        } else {
        }
  
      this.isLoading = true;

    }

    async getPopularCategories() {
      if (isPlatformBrowser(this.platformId)) {
        try {
          const data = await this.dService.getCategories().toPromise();
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

    number(){
      console.log("Si");
    }
}
