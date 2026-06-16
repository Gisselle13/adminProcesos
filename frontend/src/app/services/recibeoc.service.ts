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

  getByFolioRenglon(folio: number, renglon: number): Observable<RecibeOC> {
    return this.http.get<RecibeOC>(`${this.base}/${folio}/${renglon}`);
  }

  getByFolio(folio: number): Observable<RecibeOC[]> {
    return this.http.get<RecibeOC[]>(`${this.base}/folio/${folio}`);
  }

update(
  folio: number,
  renglon: number,
  data: Partial<RecibeOC>
): Observable<any> {
  return this.http.put(
    `${this.base}/${folio}/${renglon}`,
    data
  );
}
  delete(folio: number, renglon: number, eliminadoPor: string = 'usuario'): Observable<any> {
    return this.http.delete(`${this.base}/${folio}/${renglon}`, {
      body: { eliminado_por: eliminadoPor }
    });
  }

  getBackup(): Observable<RecibeOC[]> {
    return this.http.get<RecibeOC[]>(`${this.base}/backup`);
  }

  getBackupByFolio(folio: number): Observable<RecibeOC[]> {
    return this.http.get<RecibeOC[]>(`${this.base}/backup/folio/${folio}`);
  }

  restore(folio: number, renglon: number): Observable<any> {
    return this.http.post(`${this.base}/backup/${folio}/${renglon}/restore`, {});
  }
}
