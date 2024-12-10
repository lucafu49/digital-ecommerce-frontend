import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Package } from '../../../Interfaces/package';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { DataService } from '../../../Services/data.service';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements AfterViewInit, OnInit {
  isExpandable = false;
  isExpanded = false;

  packageId: string = ''; // Aquí se almacenará el ID del paquete
  packageData: any;

  constructor(private elementRef: ElementRef, private route: ActivatedRoute, private dService : DataService) {}

  ngOnInit(): void {
    this.packageId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngAfterViewInit(): void {
    const descriptionElement = this.elementRef.nativeElement.querySelector('.description');
    if (descriptionElement.scrollHeight > 80) { // Altura límite (ajustable)
      this.isExpandable = true;
    }
  }

  fetchPackageDetails(): void {
    this.dService.getPackageById(this.packageId).subscribe(
      (data) => {
        this.packageData = data; // Asigna los datos a tu variable
        console.log('Datos del paquete:', this.packageData);
      },
      (error) => {
        console.error('Error al obtener el paquete:', error);
      }
    );
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

}
