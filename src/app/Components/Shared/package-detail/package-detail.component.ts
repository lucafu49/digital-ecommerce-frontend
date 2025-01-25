import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Package } from '../../../Interfaces/package';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { DataService } from '../../../Services/data.service';
import { ClientService } from '../../../Services/client.service';
import { AddCartRequest } from '../../../Interfaces/add-cart-request';
import { LoadingComponent } from '../loading/loading.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../Services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [CommonModule,RouterLink,LoadingComponent,FormsModule],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit, AfterViewInit {
  packageId: string = ''; // Aquí se almacenará el ID del paquete
  packageData: any;
  isLoading : boolean = false;
  toastr= inject(ToastrService);
  message : string = '';
  isExpandable = false;
  isExpanded = false;

  constructor(private elementRef: ElementRef, private route: ActivatedRoute, private cService : ClientService, private auth:AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.packageId = this.route.snapshot.paramMap.get('id') || '';
      this.fetchPackageDetails();
    }
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

    if(this.auth.isLoggedIn()){
      const request : AddCartRequest = {
        packageId : requestId
      }
  
      this.cService.addItemtoCart(request).subscribe({
        next: (response) => {
          this.toastr.success('Package added to cart.',"Added to cart");
        },
        error: (error) => {
          this.message = error.message;
          const statusCode = error.status;
    
  
          this.toastr.error(this.message,statusCode);
        }
      });
    } else{
      this.toastr.warning("You must be logged in to add a product to your cart.","Warning");
    }
  }

}
