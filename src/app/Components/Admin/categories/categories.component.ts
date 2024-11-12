import { Component, OnInit } from '@angular/core';
import { Category } from '../../../Interfaces/category';
import { DataService } from '../../../Services/data.service';
import { AdminService } from '../../../Services/admin.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { GetCategoriesResponse } from '../../../Interfaces/Responses/categories';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit{
  message : string = '';
  listCategories : any [] = [];

  constructor(private dService: DataService, private aService: AdminService){}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this.dService.getCategories().subscribe({
      next: (data) => {
        this.listCategories = data.categories;
        console.log(data);
      },
      error: (error) => {
        this.message = error.message;
        const statusCode = error.status;
  
        console.error("Status:", statusCode, "message:", this.message);
      }
    });
  }

  updateCategory(idCategory: number, nameCat : string){

    const request = {
      id : idCategory,
      name : nameCat
    }

    this.aService.updateCategory(request).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        this.message = error.message;
        const statusCode = error.status;

        console.error("Status:", statusCode, "message: ", this.message);
      }
    })
  }

  deleteCategory(id : number){
    this.aService.deleteCategory(id).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        this.message = error.message;
        const statusCode = error.status;

        console.error("Status:", statusCode, "message: ", this.message);
      }
    })
  }

}
