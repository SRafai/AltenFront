import { CurrencyPipe, CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { AuthService } from "app/products/data-access/auth.service";
import { CartService } from "app/products/data-access/cart.service";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from "primeng/paginator";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [CommonModule,DataViewModule, CardModule, ButtonModule, DialogModule, PaginatorModule, ProductFormComponent, CurrencyPipe],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  public products: Product[] = [];

  // Variables de pagination
  public first = 0;
  public rows = 10; 
  public totalRecords = 0; 

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.authService.login('admin', 'admin').subscribe(response => {
      if (response.token) {
        this.authService.storeToken(response.token);
        this.loadProducts();
      }
    });
  }
  public onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadProducts();
  }

  trackProduct(index: number, product: any): number {
    return product.id;
  }
  

  private loadProducts() {
    this.productsService.getPaginated(this.first, this.rows).subscribe((response: Product[]) => {
      this.products = response;
    });
    this.productsService.getProductsCount().subscribe((total:number) => this.totalRecords =total)
  }
  
  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onAddToCart(product: Product){
    if(product.quantity>0){
      product.quantity-=1;
      this.cartService.addToCart(product);
    }
    
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
  
    this.editedProduct.set(product);
  
    this.productsService.update(product).subscribe((updatedProduct) => {
      if (updatedProduct) {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct; 
        }
      } 
    });
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe(()=>{
      this.loadProducts();
    });
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe(()=>
      this.loadProducts());
    } else {
      this.productsService.update(product).subscribe(()=>{
        this.loadProducts();
      });
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
