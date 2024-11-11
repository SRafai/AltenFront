import {
  Component, OnInit, inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ProductListComponent } from "./products/features/product-list/product-list.component";
import { CartService } from "./products/data-access/cart.service";
import { Product } from "./products/data-access/product.model";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, FormsModule,SplitterModule, ToolbarModule, PanelMenuComponent, CommonModule, TableModule, CardModule, ButtonModule, DialogModule, BadgeModule, ProductListComponent],
})
export class AppComponent implements OnInit{
  title = "ALTEN SHOP";
  private readonly cartService = inject(CartService);
  cartDialogVisible = false;
  cart: Product[] = [];
  totalQuantity= 0;

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.calculateTotalQuantity();
    });
  }
  calculateTotalQuantity() {
    this.totalQuantity = this.cart.reduce((sum, product) => sum + product.quantity, 0);
  }
  onCartClick() {
    this.cartDialogVisible = true;
  }
  onDelete(product: Product){
    this.cartService.removeFromCart(product.id);
  }
  updateTotal() {
    this.totalQuantity = this.cart.reduce((acc, product) => acc + product.quantity, 0);
  }
}
