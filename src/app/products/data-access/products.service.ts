import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: "root"
}) export class ProductsService {

    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);

    private readonly path = `${environment.apiUrl}/api/products`;
    
    private readonly _products = signal<Product[]>([]);

    public readonly products = this._products.asReadonly();

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken(); // Assuming getToken() returns a token string
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    public getPaginated(first: number, rows: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.path}?_start=${first}&_limit=${rows}`, {headers: this.getAuthHeaders()}).pipe(
          catchError((error) => {
            return this.http.get<Product[]>("assets/products.json");
          }),
          tap((products) => {
            this._products.set(products)
          })
        );
      }
      public getProductsCount():Observable<number>{
        return this.http.get<number>(this.path+'/count', {headers: this.getAuthHeaders()}).pipe(
            tap((number) => number),
        );
      }
    
    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.path, {headers: this.getAuthHeaders()}).pipe(
            catchError((error) => {
                return this.http.get<Product[]>("assets/products.json");
            }),
            tap((products) => this._products.set(products)),
        );
    }

    public create(product: Product): Observable<Product | null> {
        return this.http.post<Product>(this.path, product, {headers: this.getAuthHeaders()}).pipe(
            catchError(() => {
                return of(null);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }
    public update(product: Product): Observable<Product|null> {
        return this.http.patch<Product>(`${this.path}/${product.id}`, product, { headers: this.getAuthHeaders() }).pipe(
            catchError(() => {
                return of(null);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }    

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`, {headers: this.getAuthHeaders()}).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}