import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenCompra } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class OrdencompraService {
  private base = 'http://localhost:3000/api/ordencompra';

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(this.base);
  }

  getByFolio(folio: number): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.base}/folio/${folio}`);
  }

  getByEstatus(estatus: string): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.base}/estatus/${estatus}`);
  }
}
