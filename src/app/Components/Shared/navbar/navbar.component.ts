import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isOpen = false;

  toggleMenu() {/*
            document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navbarContainer = document.querySelector(".navbar-container");

    menuToggle.addEventListener("click", () => {
        navbarContainer.classList.toggle("open");
    });
});*/
  }
  
}
