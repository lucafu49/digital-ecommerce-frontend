import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { CommonModule } from '@angular/common';
import { Category } from '../../../Interfaces/category';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../Services/client.service';
import { AddCartRequest } from '../../../Interfaces/add-cart-request';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

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
  maxPrice : string = "500000000000000000000000000000000000";
  minPrice : string = "0";
  orderBy : string = "price";
  lir : string = "asc";
  page : number = 1;

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
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 1024;
  }

  toggleFilterMenu(): void {
    if (this.isSmallScreen) {
      this.isFilterMenuOpen = !this.isFilterMenuOpen;
    }
  }

  constructor(private dService : DataService, private cService : ClientService, private route:ActivatedRoute) {}


  ngOnInit(): void {
    this.getCategories();
    this.checkScreenSize();

    this.route.params.subscribe((params) => {
      const categoryId = params['category']; // Obtiene el ID de la categoría
      if (categoryId) {
        this.filters.categoryId = categoryId;
        this.filters.isActiveCat = true;
        this.filters.isActiveWord = false;
        this.getPackagesByCategory(categoryId); // Llama a los paquetes de la categoría
      } else {
        this.getPackages(); // Llama al método general si no hay categoría
      }
    });
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
      this.message = "Por favor ingresa una palabra para buscar.";
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

  addToCart(requestId: string): void {

    const request : AddCartRequest = {
      packageId : requestId
    }

    this.cService.addItemtoCart(request).subscribe({
      next: (response) => {
        alert('Paquete agregado al carrito con éxito.');
      },
      error: (error) => {
        console.error(`Error al agregar el paquete ${request} al carrito:`, error);
        alert('No se pudo agregar el paquete al carrito. Inténtalo de nuevo.');
      }
    });
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

  applyFilters(): void {
    this.fetchPackages(); // Usa la lógica centralizada para aplicar los filtros
    
  }
  
  quitFilters():void{
    this.orderBy = 'name';
    this.lir = 'asc';
    this.minPrice = '0';
    this.maxPrice = '5000';
    this.filters.isActiveCat = false;
    this.filters.isActiveWord = false;
    this.fetchPackages();
  }
}
