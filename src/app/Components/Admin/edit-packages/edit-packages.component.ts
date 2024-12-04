import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { Package } from '../../../Interfaces/package';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../Services/admin.service';
import { Category } from '../../../Interfaces/category';

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

  editingPackage: any = {};

  toggleForm : boolean = false;



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

  onCategoryChange(category: Category, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    if (isChecked) {
      // Agregar el ID de la categoría si no está presente
      if (!this.editingPackage.categories) {
        this.editingPackage.categories = [];
      }
      if (!this.editingPackage.categories.includes(category.id)) {
        this.editingPackage.categories.push(category.id);
      }
    } else {
      // Eliminar el ID de la categoría si está presente
      this.editingPackage.categories = this.editingPackage.categories.filter(
        (catId: string) => catId !== category.id
      );
    }
  }

  enableEditPackage(pack: any) {
    this.editingPackage = { ...pack }; // Clonar los datos del paquete seleccionado
    this.toggleForm = true;
  }

  savePackageUpdate(pack: any) {
    console.log('Categories IDs to save:', pack.categories);

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

    this.toggleForm = false;

    this.getPackages();
  }

  cancelEditPackage(pack: any) {
    if(this.toggleForm == true){
      this.toggleForm = false;
      pack.isEditing = false;
    }
  }


}