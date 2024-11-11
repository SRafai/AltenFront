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
    
    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.path).pipe(
            catchError((error) => {
                return this.http.get<Product[]>("assets/products.json");
            }),
            tap((products) => this._products.set(products)),
        );
    }

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(this.path, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.path}/${product.id}`, product).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.path}/${productId}`).pipe(
            catchError(() => {
                return of(true);
            }),
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}