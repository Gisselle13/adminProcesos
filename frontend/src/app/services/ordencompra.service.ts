import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenCompra } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class OrdencompraService {

  private base = 'https://comando.mx:3450/api/ordencompra';

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(this.base);
  }

  getByFolio(folio: number): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.base}/folio/${folio}`);
  }

  getByFolioRenglon(folio: number, renglon: number): Observable<OrdenCompra> {
    return this.http.get<OrdenCompra>(`${this.base}/${folio}/${renglon}`);
  }

  getByEstatus(estatus: string): Observable<OrdenCompra[]> {
    return this.http.get<OrdenCompra[]>(`${this.base}/estatus/${estatus}`);
  }

  update(folio: number, renglon: number, data: Partial<OrdenCompra>): Observable<any> {
    return this.http.put(`${this.base}/${folio}/${renglon}`, data);
  }
}
