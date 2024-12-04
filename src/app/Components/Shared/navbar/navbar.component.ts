import { Component, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../Services/data.service';
import { Category } from '../../../Interfaces/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isOpen = false;
  categories : Category[] | undefined;
  message : string = ''; 

  constructor(private dService : DataService, private renderer: Renderer2){}

  toggleMenu() {
    const navbarContainer = document.querySelector('.navbar-container');

    if (navbarContainer) {
      navbarContainer.classList.toggle('open');
    }
  }

  getCategories(){
    this.dService.getCategories().subscribe({
      next: (data) =>{
        this.categories = data.categories;
        console.log(this.categories);
      },
      error: (error) =>{
        this.message = error.message;
      }
    })
  }
  
}
