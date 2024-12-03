import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { Package } from '../../../Interfaces/package';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../Services/admin.service';

@Component({
  selector: 'app-edit-packages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-packages.component.html',
  styleUrl: './edit-packages.component.css'
})
export class EditPackagesComponent {
  packages: any | undefined;
  message: string | undefined;
  maxPrice : string = "5000";
  minPrice : string = "0";
  orderBy : string = "price";
  lir : string = "asc";
  page : number = 1;

  expandedRows: boolean[] = [];

  listCategories : any [] = [];



  constructor(private dService : DataService, private aService : AdminService) {
    
  }

  ngOnInit(): void {
    this.getPackages();
   this.getCategories();
  }

  getPackages() {
    this.dService
      .getPackagesByAdmin(this.page.toString(), this.orderBy, this.lir, this.maxPrice, this.minPrice)
      .subscribe({
        next: (data) => {
          this.packages = data.packages.results.map((pack: any) => ({
            ...pack,
            isEditing: false
          }));
          this.expandedRows = Array(this.packages.length).fill(false); // Inicializar después de cargar los datos
          console.log(this.packages);
        },
        error: (error) => {
          this.message = error.message;
        },
      });
  }

  getCategories(){
    this.dService.getCategories().subscribe({
      next: (data) =>{
        this.listCategories = data.categories;
        console.log(this.listCategories);
      },
      error: (error) =>{
        this.message = error.message;
      }
    })
  }

  toggleDescription(index: number): void {
    this.expandedRows[index] = !this.expandedRows[index];
  }

  updatePackage(packages : any){

    const request : Package = {
      categories : packages.categories,
      sourceFile : packages.sourceFile,
      id : packages.id,
      description : packages.description,
      name : packages.name,
      previewImage : packages.previewImage,
      price : packages.price

    }
    
    this.aService.updatePackage(request).subscribe({
      next: () => {
        packages.isEditing = false;
        console.log("Category updated:", packages);
      },
      error: (error) => {
        this.message = error.message;
        console.error("Error updating category:", this.message);
      }
    });
  }

  enableEditPackage(pack: any) {
    pack.isEditing = true;
  }

  savePackageUpdate(pack: any) {
    this.aService.updatePackage(pack).subscribe({
      next: () => {
        pack.isEditing = false;
        console.log("Package updated:", pack);
      },
      error: (error) => {
        this.message = error.message;
        console.error("Error updating package:", this.message);
      }
    });
  }

  cancelEditPackage(pack: any) {
    pack.isEditing = false;
    this.getPackages();
  }


}