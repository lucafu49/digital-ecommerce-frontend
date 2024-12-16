import { Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category } from '../../../Interfaces/category';
import { DataService } from '../../../Services/data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  activeDropdown: string | null = null;
  isMenuOpen: boolean = false;

  categories : Category[] = [];
  message : string = '';

  constructor(private dService: DataService){

  }

  ngOnInit() {
    this.loadCategories();
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


  
}
