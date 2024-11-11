import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSubject = new BehaviorSubject<Product[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() {}

  addToCart(product: Product): void {
    const currentCart = this.cartSubject.getValue();
    const existingProduct = currentCart.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    this.cartSubject.next(currentCart);
  }

  removeFromCart(productId: number): void {
    const updatedCart = this.cartSubject.getValue().filter(p => p.id !== productId);
    this.cartSubject.next(updatedCart);
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }
}
