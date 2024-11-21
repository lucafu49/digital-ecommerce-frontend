import { Component, OnInit } from '@angular/core';
import { Category } from '../../../Interfaces/category';
import { DataService } from '../../../Services/data.service';
import { AdminService } from '../../../Services/admin.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeleteCatRequest } from '../../../Interfaces/delete-cat-request';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit{
  createForm: FormGroup;
  message : string = '';
  listCategories : any [] = [];
  showCreateForm: boolean = false;
  newCategoryName: string = '';

  constructor(private dService: DataService, private aService: AdminService, private formBuilder : FormBuilder){
    this.createForm = this.formBuilder.group({
      name: ["",[Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.dService.getCategories().subscribe({
      next: (data) => {
        this.listCategories = data.categories.map((category: any) => ({
          ...category,
          isEditing: false // Add editing state to each category
        }));
        console.log(data);
      },
      error: (error) => {
        this.message = error.message;
        const statusCode = error.status;
  
        console.error("Status:", statusCode, "message:", this.message);
      }
    });
  }

  createCategory() {

    if (this.createForm.invalid) {
      // Optionally mark all fields as touched to show validation messages
      this.createForm.markAllAsTouched();
      return;
    }

    const newCategory: Category = { 
      id: "0", 
      name: this.createForm.get('name')?.value // Get the name from the form control
    };


    this.aService.createCategory(newCategory).subscribe({
      next: (data) => {
        console.log("Category created:", data);
        this.listCategories.push(data);
        this.toggleCreateCategoryForm();
        this.createForm.reset(); 
      },
      error: (error) => {
        this.message = error.message;
        const statusCode = error.status;
        console.error("Status:", statusCode, "message:", this.message);
      }
    });
  }

  toggleCreateCategoryForm() {
    this.showCreateForm = !this.showCreateForm;
    this.newCategoryName = '';
  }
  enableEditCategory(category: any) {
    category.isEditing = true;
  }

  saveCategoryUpdate(category: any) {

    console.log(category);

    if (!category.name.trim()) {
      this.message = "Category name cannot be empty";
      return;
    }

    const updatedCategory : Category = {
      id: category.id,
      name: category.name
    };

    console.log(updatedCategory);

    this.aService.updateCategory(updatedCategory).subscribe({
      next: () => {
        category.isEditing = false;
        console.log("Category updated:", updatedCategory);
      },
      error: (error) => {
        this.message = error.message;
        console.error("Error updating category:", this.message);
      }
    });
  }

  // Cancel editing and revert changes if necessary
  cancelEditCategory(category: any) {
    category.isEditing = false;
    this.getCategories(); // Reload categories to revert changes
  }

  deleteCategory(idRequest : any){

    const request : DeleteCatRequest = {
      id : idRequest
    }

    this.aService.deleteCategory(request).subscribe({
      next: () => {
        console.log("Category deleted:", idRequest);
        this.listCategories = this.listCategories.filter(category => category.id !== idRequest);
      },
      error: (error) => {
        this.message = error.message;
        const statusCode = error.status;

        console.error("Status:", statusCode, "message: ", this.message);
      }
    })
  }

}
