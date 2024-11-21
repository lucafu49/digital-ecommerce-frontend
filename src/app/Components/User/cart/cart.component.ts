import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../Services/client.service';
import { AddCartRequest } from '../../../Interfaces/add-cart-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = []; // Lista de items en el carrito
  message: string = ''; // Mensaje de error o confirmación

  constructor(private cService: ClientService) {}

  ngOnInit(): void {
    this.getCartItems();
  }

  // Obtener los items del carrito desde la API
  getCartItems(): void {
    this.cService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data.packages || [];
        console.log('Carrito:', this.cartItems);
      },
      error: (error) => {
        this.message = 'Error al obtener los elementos del carrito.';
        console.error('Error:', error);
      }
    });
  }

  // Eliminar un paquete del carrito
  removeItemFromCart(packageIdRequest: string): void {

    const request : AddCartRequest = {
      packageId : packageIdRequest
    }

    this.cService.deletePackageFromCart(request).subscribe({
      next: () => {
        console.log(`Paquete ${request} eliminado del carrito`);
        this.cartItems = this.cartItems.filter(item => item.id !== request.packageId)
      },
      error: (error) => {
        this.message = 'Error al eliminar el paquete del carrito.';
        console.error('Error:', error);
      }
    });
  }
}
