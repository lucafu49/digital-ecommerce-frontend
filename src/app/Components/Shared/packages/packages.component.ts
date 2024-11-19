import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { CommonModule } from '@angular/common';
import { Packages } from '../../../Interfaces/Responses/packages';
import { error } from 'node:console';
import { Category } from '../../../Interfaces/category';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule],
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
  page : number = 2;


  constructor(private dService : DataService) {}

  ngOnInit(): void {
    this.getPackages();
    this.getCategories();
  }


  getPackages(){
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

  getPackagesByCategory(categoryId: string){
    this.dService.getPackagesByCategory(categoryId,this.page.toString(),this.orderBy,this.lir,this.maxPrice,this.minPrice).subscribe({
      next : (data) =>{
        console.log(data);
        this.packages = data.packages;
      },
      error: (error) => {
        this.message = error.message;
      }
    })
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
    if (this.page > 1) {  // Verifica que no estés en la primera página
      this.page--;
      this.getPackages();
    }
  }
  
  nextPage(): void {
    if (this.packages?.next) {  // Verifica si hay una siguiente página
      this.page++;
      this.getPackages();
    }
  }
}
