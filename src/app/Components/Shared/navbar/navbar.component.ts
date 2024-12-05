import { Component, OnInit, Renderer2 } from '@angular/core';
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
export class NavbarComponent implements OnInit{
  isOpen = false;
  categories : Category[] | undefined;
  message : string = ''; 

  constructor(private dService : DataService){}

  ngOnInit(): void {
    this.getCategories();
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
