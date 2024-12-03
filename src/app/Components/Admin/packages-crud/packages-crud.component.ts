import { Component, OnInit } from '@angular/core';
import { Category } from '../../../Interfaces/category';
import { DataService } from '../../../Services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-packages-crud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packages-crud.component.html',
  styleUrl: './packages-crud.component.css'
})
export class PackagesCrudComponent implements OnInit{
  categories : Category[] | undefined;
  listSourceFiles: any[] = [];
  message : string = '';

  constructor(private dService : DataService){}

  ngOnInit(): void {
    this.getCategories();
    this.getSourceFiles();
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

  getSourceFiles() {
    this.dService.getSourceFiles().subscribe({
      next: (data) =>{
        this.listSourceFiles = data.sourceFiles;
        console.log(this.categories);
      },
      error: (error) =>{
        this.message = error.message;
      }
    })
    };
  
  

}
