import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { CommonModule } from '@angular/common';
import { Category } from '../../../Interfaces/category';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent implements OnInit {
  packages: any | undefined;
  categories : Category[] | undefined;
  showFilterMenu: boolean = false; // Controla el estado del menú de filtros
  message: string | undefined;
  maxPrice : string = "5000";
  minPrice : string = "0";
  orderBy : string = "price";
  lir : string = "asc";
  page : number = 1;

  searchWord: string = "";


  filters = {
    categoryId : "",
    isActiveCat : false,
    isActiveWord : false
  }




  constructor(private dService : DataService) {}

  ngOnInit(): void {
    this.getPackages();
    this.getCategories();
  }


  getPackages(){

    if(this.filters.isActiveCat === true || this.filters.isActiveWord === true){ //Si esta activado la busqueda con filtro, la desactiva y vuelve "al inicio"
      this.page = 1;
      this.filters.isActiveCat = false;
      this.filters.isActiveWord = false;
    }

    this.dService.getPackages(this.page.toString(),this.orderBy,this.lir,this.maxPrice,this.minPrice).subscribe({
      next : (data) => {
        console.log(data);
        this.packages = data.packages;
      },
      error: (error) => {
        this.message = error.message;
      }
    })
  }

  getPackagesByCategory(pickedCat: string){

    if(this.filters.isActiveCat === false){ //Si ya estaba en otra pagina en el inicio, setea la paginba en uno asi empieza desde el principio y no desde la ultima pagina del inicio
      this.page = 1;
      this.filters.isActiveCat = true;
      this.filters.isActiveWord = false;
    }
    
    this.filters.categoryId = pickedCat;

    this.dService.getPackagesByCategory(this.filters.categoryId,this.page.toString(),this.orderBy,this.lir,this.maxPrice,this.minPrice).subscribe({
      next : (data) =>{
        console.log(data);
        this.packages = data.packages;
      },
      error: (error) => {
        this.message = error.message;
      }
    })
  }

  getPackagesByWord(): void {
    if (!this.searchWord.trim()) {
      this.message = "Por favor ingresa una palabra para buscar.";
      return;
    }

    this.filters.isActiveWord = true;
    this.filters.isActiveCat = false;
    
    this.dService.getPackageByWord(
      this.searchWord,
      this.page.toString(),
      this.orderBy,
      this.lir,
      this.maxPrice,
      this.minPrice
    ).subscribe({
      next: (data) => {
        console.log(data);
        this.packages = data.packages;
        this.filters.isActiveCat = false; // Desactiva otros filtros
      },
      error: (error) => {
        this.message = error.message;
      }
    });
  }
  

  getCategories(){
    this.dService.getCategories().subscribe({
      next: (data) =>{
        this.categories = data.categories;
        console.log(this.categories);
      },
      error: (error) =>{
        this.message = error.message;
      }
    })
  }
  


  // Abre o cierra el menú de filtros
  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }
  
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchPackages(); // Método centralizado
    }
  }
  
  nextPage(): void {
    if (this.packages?.next) {
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
}
