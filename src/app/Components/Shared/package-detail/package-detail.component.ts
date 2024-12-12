import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Package } from '../../../Interfaces/package';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { DataService } from '../../../Services/data.service';
import { ClientService } from '../../../Services/client.service';
import { AddCartRequest } from '../../../Interfaces/add-cart-request';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit, AfterViewInit {
  packageId: string = ''; // Aquí se almacenará el ID del paquete
  packageData: any;

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
    this.cService.getPackageById(this.packageId).subscribe(
      (data) => {
        this.packageData = data; // Asigna los datos a tu variable
        console.log('Datos del paquete:', this.packageData);
      },
      (error) => {
        console.error('Error al obtener el paquete:', error);
      }
    );
  }

  addToCart(requestId: string): void {

    const request : AddCartRequest = {
      packageId : requestId
    }

    this.cService.addItemtoCart(request).subscribe({
      next: (response) => {
        console.log(`Paquete ${request} agregado al carrito.`, response);
        alert('Paquete agregado al carrito con éxito.');
      },
      error: (error) => {
        console.error(`Error al agregar el paquete ${request} al carrito:`, error);
        alert('No se pudo agregar el paquete al carrito. Inténtalo de nuevo.');
      }
    });
  }

}
