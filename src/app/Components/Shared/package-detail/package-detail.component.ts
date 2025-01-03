import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Package } from '../../../Interfaces/package';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { DataService } from '../../../Services/data.service';
import { ClientService } from '../../../Services/client.service';
import { AddCartRequest } from '../../../Interfaces/add-cart-request';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule,RouterLink,LoadingComponent],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit, AfterViewInit {
  packageId: string = ''; // Aquí se almacenará el ID del paquete
  packageData: any;
  isLoading : boolean = false;

  isExpandable = false;
  isExpanded = false;

  constructor(private elementRef: ElementRef, private route: ActivatedRoute, private cService : ClientService) {}

  ngOnInit(): void {
    this.packageId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchPackageDetails();
  }

  ngAfterViewInit(): void {
    const descriptionElement = this.elementRef.nativeElement.querySelector('.description');
    if (descriptionElement.scrollHeight > 80) { // Altura límite (ajustable)
      this.isExpandable = true;
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  fetchPackageDetails(): void {

    this.isLoading = true;

    this.cService.getPackageById(this.packageId).subscribe({
      next: (data) =>{
        this.packageData = data;
      },
      error: (error) =>{
        console.error('Error al obtener el paquete:', error);
      },
      complete: () => {
        this.isLoading = false; // Ocultar el loading
      }
    }
    );
  }

  addToCart(requestId: string): void {

    const request : AddCartRequest = {
      packageId : requestId
    }

    this.cService.addItemtoCart(request).subscribe({
      next: (response) => {
        alert('Paquete agregado al carrito con éxito.');
      },
      error: (error) => {
        console.error(`Error al agregar el paquete ${request} al carrito:`, error);
        alert('No se pudo agregar el paquete al carrito. Inténtalo de nuevo.');
      }
    });
  }

}
