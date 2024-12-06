import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { Package } from '../../../Interfaces/package';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../Services/admin.service';
import { Category } from '../../../Interfaces/category';
import { SourceFile } from '../../../Interfaces/source-file';
import { DeleteSourcefRequest } from '../../../Interfaces/delete-sourcef-request';

@Component({
  selector: 'app-edit-packages',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './edit-packages.component.html',
  styleUrl: './edit-packages.component.css'
})
export class EditPackagesComponent {
  packages: any | undefined;
  pageInfo : any | undefined;
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



  constructor(private dService : DataService, private aService : AdminService){
  }

  ngOnInit(): void {
    this.getPackages();
   this.getCategories();
  }

  getPackages() {
    this.aService
      .getPackagesByAdmin(this.page.toString(), this.orderBy, this.lir, this.maxPrice, this.minPrice)
      .subscribe({
        next: (data) => {
          this.packages = data.packages.results.map((pack: any) => ({
            ...pack,
            isEditing: false
          }));
          this.expandedRows = Array(this.packages.length).fill(false); // Inicializar después de cargar los datos
          console.log(this.packages);
          this.pageInfo = data;
          console.log(this.pageInfo);
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

  toggleRowExpansion(index: number): void {
    this.expandedRows[index] = !this.expandedRows[index];
  }

  onCategoryChange(category: Category, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    if (isChecked) {
      // Agregar la categoría si no está presente
      if (!this.editingPackage.categories) {
        this.editingPackage.categories = [];
      }
      if (!this.editingPackage.categories.some((cat: Category) => cat.id === category.id)) {
        this.editingPackage.categories.push(category);
      }
    } else {
      // Eliminar la categoría si está presente
      this.editingPackage.categories = this.editingPackage.categories.filter(
        (cat: Category) => cat.id !== category.id
      );
    }
  }

  enableEditPackage(pack: any) {
    this.editingPackage = {
      ...pack,
      sourceFiles: pack.sourceFiles?.map((file: any) => ({
        id: file.id || '',
        name: file.name || '',
        link: file.link || '',
      })) || [],
    };

    console.log(this.editingPackage);

    this.toggleForm = true;
      const formElement = document.getElementById('editForm');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  }

  isCategorySelected(category: Category): boolean {
    return this.editingPackage.categories?.some((cat: Category) => cat.id === category.id) ?? false;
  }

  isFormValid(packageData: any): boolean {
    // Validar que el nombre no esté vacío
    if (!packageData.name || packageData.name.trim() === '') {
      this.message = 'El nombre no puede estar vacío.';
      return false;
    }
  
    // Validar que la descripción no esté vacía y que tenga un máximo de 200 caracteres
    if (!packageData.description || packageData.description.trim() === '') {
      this.message = 'La descripción no puede estar vacía.';
      return false;
    }
    if (packageData.description.length > 1000) {
      this.message = 'La descripción no puede tener más de 200 caracteres.';
      return false;
    }
  
    // Validar que el precio no esté vacío
    if (!packageData.price || packageData.price <= 0) {
      this.message = 'El precio debe ser mayor a 0.';
      return false;
    }
  
    // Validar que haya al menos una categoría seleccionada
    if (!packageData.categories || packageData.categories.length === 0) {
      this.message = 'Debe seleccionar al menos una categoría.';
      return false;
    }
  
    // Validar que haya al menos un archivo fuente
    if (!packageData.sourceFiles || packageData.sourceFiles.length === 0) {
      this.message = 'Debe proporcionar al menos un archivo fuente.';
      return false;
    }
  
    // Si todas las validaciones pasan
    this.message = ''; // Limpiar mensajes de error previos
    return true;
  }

savePackageUpdate(pack: any) {
  if (!this.isFormValid(pack)) {
    console.error('Formulario no válido:', this.message);
    return;
  }

  const formData = new FormData();
  formData.append('id', pack.id);
  formData.append('name', pack.name);
  formData.append('price', pack.price.toString());
  formData.append('description', pack.description);

  pack.categories.forEach((file: any) => {
    formData.append('categories[]', file.id);
  });

  pack.sourceFiles.forEach((file: any) => {
    formData.append('sourceFiles[]', file.id);
  });

  if (pack.previewImage instanceof File) {
    formData.append('file', pack.previewImage);
  }

  this.aService.updatePackage(formData).subscribe({
    next: () => {
      console.log('Paquete actualizado:', formData);
      this.toggleForm = false;
      this.getPackages(); // Refrescar la lista
    },
    error: (error) => {
      this.message = error.message;
      console.error('Error al actualizar el paquete:', this.message);
    },
  });
}

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      console.log('Archivo seleccionado:', selectedFile);
  
      // Guardar el archivo en `editingPackage`
      this.editingPackage.previewImage = selectedFile;
    }
  }

  cancelEditPackage(pack: any) {
    if(this.toggleForm == true){
      this.toggleForm = false;
      pack.isEditing = false;
    }
  }

  addSourceFile(): void {
    if (!this.editingPackage.sourceFiles) {
      this.editingPackage.sourceFiles = [];
    }
    this.editingPackage.sourceFiles.push({ name: '', link: '' });
  }
  
  removeSourceFile(sourceFileId: any) {
    const request: DeleteSourcefRequest = { sourceFileId };
  
    this.aService.deleteSourceFile(request).subscribe({
      next: () => {
        console.log("SourceFile deleted:", sourceFileId);
        // Filtrar la lista para eliminar visualmente el archivo eliminado
        this.editingPackage.sourceFiles = this.editingPackage.sourceFiles.filter(
          (file: any) => file.id !== sourceFileId
        );
      },
      error: (error) => {
        this.message = error.message;
        console.error("Error deleting source file:", this.message);
      },
    });
  }

  updateSourceFile(file: any) {
    if (!file.name || !file.link) {
      console.error('El archivo fuente debe tener un nombre y un enlace válidos.');
      return;
    }
  
    const sourceFile: SourceFile = {
      id: file.id,
      name: file.name,
      link: file.link,
    };
  
    this.aService.updateSourceFile(sourceFile).subscribe({
      next: () => {
        console.log("Source file updated:", sourceFile);
      },
      error: (error) => {
        this.message = error.message;
        console.error("Error updating source file:", this.message);
      },
    });
  }

}