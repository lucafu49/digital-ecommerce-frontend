import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './Services/data.service';
import { Observable } from 'rxjs';
import { Category } from './Interfaces/category';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'digital-ecommerce-frontend';

  public categories: any;

  constructor(private dataS: DataService){

  }

  ngOnInit(): void {
    this.categories = this.dataS.getCategories().subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error('Error fetching products', error);
      }
    );
  }
}
