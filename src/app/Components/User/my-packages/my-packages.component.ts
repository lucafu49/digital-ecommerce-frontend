import { Component } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-packages.component.html',
  styleUrl: './my-packages.component.css'
})
export class MyPackagesComponent {
  packages: any | undefined;
  message: string | undefined;
  maxPrice : string = "5000";
  minPrice : string = "0";
  orderBy : string = "price";
  lir : string = "asc";
  page : number = 1;

  searchWord: string = "";

  isFilterMenuOpen: boolean = false;
  isSmallScreen: boolean = false;


  filters = {
    categoryId : "",
    isActiveCat : true,
    isActiveWord : false
  }

  constructor(private dService : DataService) {}


  ngOnInit(): void {
    this.getPackages();
    this.function();
  }


  getPackages(){

    if(this.filters.isActiveCat === true || this.filters.isActiveWord === true){
      this.page = 1;
      this.filters.isActiveCat = false;
      this.filters.isActiveWord = false;
    }

    this.dService.getPackagesByAdmin(this.page.toString(),this.orderBy,this.lir,this.maxPrice,this.minPrice).subscribe({
      next : (data) => {
        console.log(data);
        this.packages = data;
      },
      error: (error) => {
        this.message = error.message;
      }
    })
  }

  function(){
    console.log(this.packages);
  }


}
