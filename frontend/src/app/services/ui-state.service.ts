import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  private _mostrarBackup = new BehaviorSubject<boolean>(false);
  mostrarBackup$ = this._mostrarBackup.asObservable();

  toggleBackup(): void {
    this._mostrarBackup.next(!this._mostrarBackup.value);
  }

  get mostrarBackup(): boolean {
    return this._mostrarBackup.value;
  }
}
