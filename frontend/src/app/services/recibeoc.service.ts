import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecibeOC } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class RecibeocService {
private base = 'https://comando.mx:3450/api/recibeoc';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RecibeOC[]> {
    return this.http.get<RecibeOC[]>(this.base);
  }

  getById(id: number): Observable<RecibeOC> {
    return this.http.get<RecibeOC>(`${this.base}/${id}`);
  }

  getByFolio(folio: number): Observable<RecibeOC[]> {
    return this.http.get<RecibeOC[]>(`${this.base}/folio/${folio}`);
  }

  update(id: number, data: Partial<RecibeOC>): Observable<any> {
    return this.http.put(`${this.base}/${id}`, data);
  }

  delete(id: number, eliminadoPor: string = 'usuario'): Observable<any> {
    return this.http.delete(`${this.base}/${id}`, {
      body: { eliminado_por: eliminadoPor }
    });
  }
}
