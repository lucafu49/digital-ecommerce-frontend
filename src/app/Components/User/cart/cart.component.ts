import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../../Services/client.service';
import { AddCartRequest } from '../../../Interfaces/add-cart-request';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,LoadingComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0; 
  message: string = ''; // Mensaje de error o confirmación´
  toastr= inject(ToastrService);

  constructor(private cService: ClientService) {}

  ngOnInit(): void {
    this.getCartItems();
  }

  // Obtener los items del carrito desde la API
  getCartItems(): void {
    this.cService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data.packages || [];
        this.calculateTotalPrice();
        console.log('Carrito:', this.cartItems);
      },
      error: (error) => {
        this.message = 'Error al obtener los elementos del carrito.';
        console.error('Error:', error);
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  // Eliminar un paquete del carrito
  removeItemFromCart(packageIdRequest: string): void {

    const request : AddCartRequest = {
      packageId : packageIdRequest
    }

    console.log(request)

    this.cService.deletePackageFromCart(request).subscribe({
      next: () => {
        this.toastr.success("Package deleted succesfully", "Deleted")
        this.cartItems = this.cartItems.filter(item => item.id !== request.packageId)
      },
      error: (error) => {
        this.toastr.error("Error deleting package","Error");
      }
    });
  }

  createPayment() {
    const request: AddCartRequest = {
      packageId: '123546'
    };
  
    this.cService.createPayment(request).subscribe({
      next: (data) => {
        console.log(data.resp);
  
        // Supongamos que `data.url` contiene la URL que quieres abrir.
        if (data) {
          window.open(data.resp, '_blank'); // Abre la URL en una nueva pestaña
        } else {
          console.log('No se encontró una URL en la respuesta.');
        }
  
        console.log(`Confirmación de pago creada perfectamente`);
        this.cartItems = this.cartItems.filter(item => item.id !== request.packageId);
        location.reload();
      },
      error: (error) => {
        this.message = 'Error al eliminar el paquete del carrito.';
        console.error('Error:', error);
      }
    });
  }
}
