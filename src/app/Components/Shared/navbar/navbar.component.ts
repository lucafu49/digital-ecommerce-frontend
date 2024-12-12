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
  
  getCategories(){
    this.dService.getPopularCategories().subscribe({
      next: (data) =>{
        this.categories = data.categories;
        console.log(this.categories);
      },
      error: (error) =>{
        this.message = error.message;
      }
    })
  }


  toggleDropdown(event: Event, dropdown: string) {
    event.preventDefault();
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const navbarLinks = document.querySelector('.navbar-links');
    if (navbarLinks) {
      navbarLinks.classList.toggle('active');
    }
  }
  
}
