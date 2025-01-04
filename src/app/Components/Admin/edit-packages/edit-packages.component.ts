import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../../Services/data.service';
import { Package } from '../../../Interfaces/package';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../Services/admin.service';
import { Category } from '../../../Interfaces/category';
import { SourceFile } from '../../../Interfaces/source-file';
import { DeleteSourcefRequest } from '../../../Interfaces/delete-sourcef-request';
import { LoadingComponent } from '../../Shared/loading/loading.component';

@Component({
  selector: 'app-edit-packages',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule,LoadingComponent],
  templateUrl: './edit-packages.component.html',
  styleUrl: './edit-packages.component.css'
})
export class EditPackagesComponent {
  packages: any | undefined;
  pageInfo : any | undefined;
  message: string | undefined;
  page : number = 1;
  expandedRows: boolean[] = [];
  expandedSourceRows: boolean[] = [];
  listCategories : any [] = [];
  editingPackage: any = {};
  toggleForm : boolean = false;
  searchTerm: string = '';
  selectedCategoryId: string = '';
  createForm : FormGroup
  deletedSourceF : SourceFile[] = [];
  createMode : boolean = false;
  isLoading : boolean = false;
  filters = {
    isActiveWord: false,
    isActiveCategory: false
  };
  isFilterMenuOpen: boolean = false;
  isSmallScreen: boolean = false;

  constructor(private dService : DataService, private aService : AdminService, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef
  ) {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      link: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    this.getPackages();
   this.getCategories();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 950;
    this.cdr.detectChanges(); // Asegura que los cambios se reflejen en la vista
  }
  toggleFilterMenu() {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  getPackages() {

    if(this.filters.isActiveCategory == true || this.filters.isActiveWord== true){
      this.filters.isActiveCategory = false;
      this.filters.isActiveWord = false;
    }

    
    this.isLoading = true;
    this.aService
      .getPackagesByAdmin(this.page.toString())
      .subscribe({
        next: (data) => {
          this.packages = data.packages.results.map((pack: any) => ({
            ...pack,
            isEditing: false
          }));
          this.expandedRows = Array(this.packages.length).fill(false); // Inicializar después de cargar los datos
          this.expandedSourceRows = Array(this.packages.length).fill(false);
          this.pageInfo = data.packages;
        },
        error: (error) => {
          this.message = error.message;
        },
        complete: () => {
          this.isLoading = false; // Ocultar el loading
        }
      });
  }

  filterByWord(): void {

    if(this.filters.isActiveWord === false && this.page !== 1){
      this.page = 1;
    }

    this.filters.isActiveWord = true;

    this.isLoading = true;

    if(this.isSmallScreen){
      this.isFilterMenuOpen = false;
    }

    if (this.searchTerm.trim() !== '') {
      this.aService
        .getPackagesByAdminByWord(this.searchTerm,this.page.toString())
        .subscribe({
          next: (data) => {
            this.packages = data.packages.results.map((pack: any) => ({
              ...pack,
              isEditing: false,
            }));
            this.pageInfo = data.packages;
            this.message = '';
          },
          error: (error) => {
            this.message = 'Error al buscar paquetes por palabra.';
          },
          complete: () => {
            this.isLoading = false; // Ocultar el loading
          }
        });
    } else {
      this.getPackages(); // Si no hay búsqueda, se cargan todos los paquetes
    }
  }
  
  filterByCategory(): void {

    if(this.searchTerm !== ''){
      this.searchTerm = '';
    }

    if(this.filters.isActiveCategory === false){ //Si ya estaba en otra pagina en el inicio, setea la paginba en uno asi empieza desde el principio y no desde la ultima pagina del inicio
      this.page = 1;
      this.filters.isActiveCategory = true;
      this.filters.isActiveWord = false;
      this.searchTerm = '';
    }

    this.isFilterMenuOpen = false;

    this.isLoading = true;
    if (this.selectedCategoryId) {
      this.aService
        .getPackagesByAdminByCategory(this.selectedCategoryId,this.page.toString())
        .subscribe({
          next: (data) => {
            this.packages = data.packages.results.map((pack: any) => ({
              ...pack,
              isEditing: false,
            }));
            this.message = '';
            this.pageInfo = data.packages;
          },
          error: (error) => {
            this.message = 'Error al filtrar paquetes por categoría.';
          },
          complete: () => {
            this.isLoading = false; // Ocultar el loading
          }
        });
    } else {
      this.getPackages(); // Si no hay categoría seleccionada, se cargan todos los paquetes
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
      this.filterByWord();
    } else if (this.filters.isActiveCategory) {
      this.filterByCategory();
    } else {
      this.getPackages();
    }
  }

  getCategories(){
    this.dService.getCategories().subscribe({
      next: (data) =>{
        this.listCategories = data.categories;
      },
      error: (error) =>{
        this.message = error.message;
      }
    })
  }

  toggleRowExpansion(index: number): void {
    this.expandedRows[index] = !this.expandedRows[index];
  }
  toggleSourceRowExpansion(index: number) {
    this.expandedSourceRows[index] = !this.expandedSourceRows[index];
  }

  onCategoryChange(category: Category, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    if (isChecked) {
      if (!this.editingPackage.categories) {
        this.editingPackage.categories = [];
      }
      if (!this.editingPackage.categories.some((cat: Category) => cat.id === category.id)) {
        this.editingPackage.categories.push(category);
      }
    } else {
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
    if (!packageData.name || packageData.name.trim() === '') {
      this.message = 'El nombre no puede estar vacío.';
      return false;
    }
  
    if (!packageData.description || packageData.description.trim() === '') {
      this.message = 'La descripción no puede estar vacía.';
      return false;
    }
    if (packageData.description.length > 300) {
      this.message = 'La descripción no puede tener más de 300 caracteres.';
      return false;
    }
  
    if (!packageData.price || packageData.price <= 0) {
      this.message = 'El precio debe ser mayor a 0.';
      return false;
    }
  
    if (!packageData.categories || packageData.categories.length === 0) {
      this.message = 'Debe seleccionar al menos una categoría.';
      return false;
    }
  
    if (!packageData.sourceFiles || packageData.sourceFiles.length === 0) {
      this.message = 'Debe proporcionar al menos un archivo fuente.';
      return false;
    }
  
    this.message = ''; 
    return true;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
  
      // Guardar el archivo en `editingPackage`
      this.editingPackage.previewImage = selectedFile;
    }
  }

  cancelEditPackage(pack: any) {
    if(this.toggleForm == true){
      this.toggleForm = false;
      pack.isEditing = false;
      this.deletedSourceF = [];
    }
  }

  addSourceFile(): void {
    if (!this.editingPackage.sourceFiles) {
      this.editingPackage.sourceFiles = [];
    }
    this.editingPackage.sourceFiles.push({ name: '', link: '' });
  }

  createSourceFile() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
  
    const newSourceFile: SourceFile = { 
      id: '', // Set this if server assigns an ID
      name: this.createForm.get('name')?.value,
      link: this.createForm.get('link')?.value
    };
  
    this.aService.createSourceFile(newSourceFile).subscribe({
      next: (data) => {
        this.editingPackage.sourceFiles.push(data);
        this.message = 'Archivo fuente creado y añadido con éxito.';
        this.createForm.reset(); 
      },
      error: (error) => {
        this.message = error.message;
        console.error("Error creating source file:", this.message);
      }
    });
  }
  
  removeSourceFile(fileId: string): void {
    const index = this.editingPackage.sourceFiles.findIndex((file: SourceFile) => file.id === fileId);
    if (index !== -1) {
      const removedFile = this.editingPackage.sourceFiles.splice(index, 1)[0];
      this.deletedSourceF.push(removedFile.id); // Mover el archivo al arreglo de eliminados
    }
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
      },
      error: (error) => {
        this.message = error.message;
        console.error("Error updating source file:", this.message);
      },
    });
  }

  //CREATE PACKAGE

  toggleCreate(){
    this.createMode = !this.createMode;
    this.toggleForm = !this.toggleForm;
    this.isFilterMenuOpen = false;

    this.editingPackage = {
      
      sourceFiles: [], // Inicialización como arreglo vacío
      categories: [] // Asegurarse de inicializar las categorías
    };
  }

  savePackage(): void {
    if (!this.isFormValid(this.editingPackage)) {
      console.error('Formulario no válido:', this.message);
      return;
    }
  
    if (this.createMode) {
      this.createPackage();
    } else {
      this.updatePackage();
    }
  }

  createPackage(): void {
    const formData = new FormData();
    formData.append('name', this.editingPackage.name);
    formData.append('price', this.editingPackage.price.toString());
    formData.append('description', this.editingPackage.description);
  
    if (this.editingPackage.previewImage instanceof File) {
      formData.append('file', this.editingPackage.previewImage);
    }

    
  this.editingPackage.categories.forEach((cat: any) => {
      formData.append('categories', cat.id);
  });
  if(this.editingPackage.categories.length == 1){
    formData.append('categories', this.editingPackage.categories[0].id);
  }
  
  this.editingPackage.sourceFiles.forEach((file: any) => {
      formData.append('sourceFiles', file.id);
  });
  if(this.editingPackage.sourceFiles.length == 1){
    formData.append('sourceFiles', this.editingPackage.sourceFiles[0].id);
  }

    this.aService.createPackage(formData).subscribe({
      next: (data) => {
        this.message = 'Paquete creado con éxito.';
        this.createMode = false;
        this.toggleForm = false;

        if(this.editingPackage.sourceFiles.length == 1 || this.editingPackage.categories.length == 1){
          const requestCatSourceFiles = {
            id: data.id,
            categories: this.editingPackage.categories.map((category: Category) => category.id),
            sourceFiles: this.editingPackage.sourceFiles.map((sourceFile: SourceFile) => sourceFile.id)
          };

          this.aService.updatePackage(requestCatSourceFiles).subscribe({
            next: () => {
              this.deletedSourceF.forEach((file: any) => {
        
                const request : DeleteSourcefRequest = {
                  sourceFileId : file
                }
              
                this.aService.deleteSourceFile(request).subscribe({
                  next: () => {
                  },
                  error: (error) => {
                    this.message = error.message;
                    console.error("Error deleting source file:", this.message);
                  }
                });
              });
        
              this.toggleForm = false;
              this.fetchPackages();
            },
            error: (error) => {
              this.message = error.message;
              console.error('Error al actualizar el paquete:', this.message);
            },
          });
        }
        this.fetchPackages();
      },
      error: (error) => {
        this.message = 'Error al crear el paquete.';
        console.error(this.message, error);
      },
    });
  }

  updatePackage(): void {
    const formData = new FormData();
    formData.append('id', this.editingPackage.id);
    formData.append('name', this.editingPackage.name);
    formData.append('price', this.editingPackage.price.toString());
    formData.append('description', this.editingPackage.description);
    formData.append('isActive', this.editingPackage.isActive);
  
    if (this.editingPackage.previewImage instanceof File) {
      formData.append('file', this.editingPackage.previewImage);
    }
  
    const requestCatSourceFiles = {
      id: this.editingPackage.id,
      categories: this.editingPackage.categories.map((category: Category) => category.id),
      sourceFiles: this.editingPackage.sourceFiles.map((sourceFile: SourceFile) => sourceFile.id)
    };
  
    this.aService.updatePackage(formData).subscribe({
      next: () => {
        this.aService.updatePackage(requestCatSourceFiles).subscribe({
          next: () => {
            this.deletedSourceF.forEach((fileId: any) => {
              const request: DeleteSourcefRequest = { sourceFileId: fileId };
              this.aService.deleteSourceFile(request).subscribe();
            });
  
            this.message = 'Paquete actualizado con éxito.';
            this.toggleForm = false;
            this.fetchPackages();
          },
          error: (error) => {
            this.message = 'Error al actualizar categorías o archivos.';
            console.error(this.message, error);
          },
        });
      },
      error: (error) => {
        this.message = 'Error al actualizar el paquete.';
        console.error(this.message, error);
      },
    });
  }

}