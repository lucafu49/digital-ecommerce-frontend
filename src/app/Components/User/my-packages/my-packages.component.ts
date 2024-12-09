import { Component } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../Services/client.service';

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
  page : number = 1;

  searchWord: string = "";

  isFilterMenuOpen: boolean = false;
  isSmallScreen: boolean = false;


  filters = {
    categoryId : "",
    isActiveCat : true,
    isActiveWord : false
  }

  constructor(private cService : ClientService) {}


  ngOnInit(): void {
    this.getPackages();
  }


  getPackages(){

    if(this.filters.isActiveCat === true || this.filters.isActiveWord === true){
      this.page = 1;
      this.filters.isActiveCat = false;
      this.filters.isActiveWord = false;
    }

    this.cService.getPurchasedPackages().subscribe({
      next : (data) => {
        console.log(data);
        this.packages = data;
      },
      error: (error) => {
        this.message = error.message;
      }
    })
  }

}
