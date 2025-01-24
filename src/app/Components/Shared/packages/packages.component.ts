import { Component, HostListener, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Category } from '../../../Interfaces/category';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../Services/client.service';
import { AddCartRequest } from '../../../Interfaces/add-cart-request';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { AuthService } from '../../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,LoadingComponent],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent implements OnInit {
  packages: any | undefined;
  pageInfo: any | undefined;
  categories : Category[] | undefined;
  message: string | undefined;
  maxPrice : string = "5000000000000000";
  minPrice : string = "0";
  orderBy : string = "timesSold";
  lir : string = "asc";
  page : number = 1;
  toastr= inject(ToastrService);
  searchWord: string = "";

  isFilterMenuOpen: boolean = false;
  isSmallScreen: boolean = false;

  isLoading : boolean = false;


  filters = {
    categoryId : "",
    isActiveCat : true,
    isActiveWord : false
  }


  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isSmallScreen = window.innerWidth < 1024;
    }
  }

  toggleFilterMenu(): void {
    if (this.isSmallScreen) {
      this.isFilterMenuOpen = !this.isFilterMenuOpen;
    }
  }

  constructor(private dService : DataService, private cService : ClientService, private route:ActivatedRoute, private auth:AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}


  ngOnInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize(); // Solo se ejecuta en el navegador
      this.getCategories();

      this.route.params.subscribe((params) => {
        const categoryId = params['category'];
        const keyword = params['keyword']; // Obtiene el ID de la categoría
        if (categoryId) {
          this.filters.categoryId = categoryId;
          this.filters.isActiveCat = true;
          this.filters.isActiveWord = false;
          this.getPackagesByCategory(categoryId); // Llama a los paquetes de la categoría
        }else if (keyword) {
          this.searchWord = keyword;
          this.filters.isActiveWord = true;
          this.filters.isActiveCat = false; // No hay categoría
          this.getPackagesByWord(); // Llama al backend por palabra clave
        } else {
          this.getPackages(); // Llama al método general si no hay categoría
        }
      });
    }
  }


  getPackages(){

    if(this.filters.isActiveCat === true || this.filters.isActiveWord === true){ //Si esta activado la busqueda con filtro, la desactiva y vuelve "al inicio"
      this.page = 1;
      this.filters.isActiveCat = false;
      this.filters.isActiveWord = false;
    }

    this.isLoading = true;
    this.dService.getPackages(this.page.toString(),this.orderBy,this.lir,this.maxPrice,this.minPrice).subscribe({
      next : (data) => {
        this.packages = data;
        this.pageInfo = data.packages;
      },
      error: (error) => {
        this.message = error.message;
      },
      complete: () => {
        this.isLoading = false; // Ocultar el loading
      }
    })
  }

  getPackagesByCategory(pickedCat: string){

    if(this.searchWord !== ''){
      this.searchWord = '';
    }

    if(this.filters.isActiveCat === false){ //Si ya estaba en otra pagina en el inicio, setea la paginba en uno asi empieza desde el principio y no desde la ultima pagina del inicio
      this.page = 1;
      this.filters.isActiveCat = true;
      this.filters.isActiveWord = false;
    }
    
    this.filters.categoryId = pickedCat;

    this.isLoading = true;
    this.dService.getPackagesByCategory(this.filters.categoryId,this.page.toString(),this.orderBy,this.lir,this.maxPrice,this.minPrice).subscribe({
      next : (data) =>{
        this.packages = data;
        this.pageInfo = data.packages;
      },
      error: (error) => {
        this.message = error.message;
      },
      complete: () => {
        this.isLoading = false; // Ocultar el loading
      }
    })
  }

  getPackagesByWord(): void {

    if(this.filters.isActiveWord === false && this.page !== 1){
      this.page = 1;
    }

    if (!this.searchWord.trim()) {
      this.toastr.warning("Please enter a word to search.","Warning");
      return;
    }

    this.filters.isActiveWord = true;
    this.filters.isActiveCat = false;
    
    this.isLoading = true;
    this.dService.getPackageByWord(
      this.searchWord,
      this.page.toString(),
      this.orderBy,
      this.lir,
      this.maxPrice,
      this.minPrice
    ).subscribe({
      next: (data) => {
        this.packages = data;
        this.pageInfo = data.packages;
        this.filters.isActiveCat = false; // Desactiva otros filtros
      },
      error: (error) => {
        this.message = error.message;
      },
      complete: () => {
        this.isLoading = false; // Ocultar el loading
      }
    });
  }
  

  getCategories(){
    this.dService.getPopularCategories().subscribe({
      next: (data) =>{
        this.categories = data.categories;
      },
      error: (error) =>{
        this.message = error.message;
      }
    })
  }

  onOrderChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
  
    switch (value) {
      case 'timesSold':
        this.orderBy = 'timesSold';
        this.lir = 'desc';
        break;
      case 'price-low-high':
        this.orderBy = 'price';
        this.lir = 'asc';
        break;
      case 'price-high-low':
        this.orderBy = 'price';
        this.lir = 'desc';
        break;
      case 'name-asc':
        this.orderBy = 'name';
        this.lir = 'asc';
        break;
      case 'name-desc':
        this.orderBy = 'name';
        this.lir = 'desc';
        break;
      default:
        this.orderBy = 'timesSold';
        this.lir = 'desc';
    }

    this.page = 1;
  
    this.fetchPackages(); // Llama a la función para recargar los paquetes con los nuevos parámetros
  }

  addToCart(requestId: string): void {

    if(this.auth.isLoggedIn()){
      const request : AddCartRequest = {
        packageId : requestId
      }
  
      this.cService.addItemtoCart(request).subscribe({
        next: (response) => {
          this.toastr.success('Package added to cart.',"Added to cart");
        },
        error: (error) => {
          this.message = error.message;
          const statusCode = error.status;
    
  
          this.toastr.error(this.message,statusCode);
        }
      });
    } else{
      this.toastr.warning("You must be logged in to add a product to your cart.","Warning");
    }


  }
  
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchPackages(); // Método centralizado
    }
  }
  
  nextPage(): void {
    if (this.pageInfo?.next) {
      this.page++;
      this.fetchPackages(); // Método centralizado
    }
  }
  
  fetchPackages(): void {
    if (this.filters.isActiveWord) {
      this.getPackagesByWord();
    } else if (this.filters.isActiveCat) {
      this.getPackagesByCategory(this.filters.categoryId);
    } else {
      this.getPackages();
    }
  }

  validatePriceFilters(): void {
    // Si los valores están vacíos o son null, se asignan los valores predeterminados
    this.minPrice = this.minPrice?.trim() ? this.minPrice : '0';
    this.maxPrice = this.maxPrice?.trim() ? this.maxPrice : '5000000000000000';
  }

  applyFilters(): void {
    this.validatePriceFilters(); // Asegura valores válidos
    this.fetchPackages(); // Lógica centralizada
    this.isFilterMenuOpen = false;
  }
  
  quitFilters():void{
    this.orderBy = 'name';
    this.lir = 'asc';
    this.minPrice = '0';
    this.maxPrice = '5000000000000000';
    this.filters.isActiveCat = false;
    this.filters.isActiveWord = false;
    this.fetchPackages();
  }
}
