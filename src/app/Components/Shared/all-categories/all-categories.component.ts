import { Component, OnInit } from '@angular/core';
import { Category } from '../../../Interfaces/category';
import { DataService } from '../../../Services/data.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent implements OnInit{
  categories : Category[] = [];
  message : string = '';

  constructor(private dService : DataService){}

  ngOnInit(): void {
    this.loadCategories();
    this.getCategories();
  }

  loadCategories() {
    const categories = this.dService.getCategoriesLocalStorage();
    if (categories) {
      this.categories = categories;
      console.log('Categorías cargadas desde localStorage:', this.categories);
    } else {
      console.warn('No hay categorías guardadas en localStorage');
    }
  }

  getCategories(){
    this.dService.getCategories().subscribe({
      next: (data) =>{
        console.log(data)
        this.categories = data.categories;
      },
      error: (error) =>{
        this.message = error.message;
      }
    })
  }

}
