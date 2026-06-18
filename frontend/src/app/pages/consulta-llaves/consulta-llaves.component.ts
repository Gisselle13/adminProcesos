import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LLAVES, Llave } from '../../models/llaves.data';

@Component({
  selector: 'app-consulta-llaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-llaves.component.html',
  styleUrls: ['./consulta-llaves.component.scss']
})
export class ConsultaLlavesComponent {
  busqueda = '';
  resultado: Llave | null = null;
  noEncontrado = false;

  consultar(): void {
    const q = this.busqueda.trim().toUpperCase();
    if (!q) return;
    const found = LLAVES.find(l => l.id === q) ?? null;
    this.resultado = found;
    this.noEncontrado = !found;
  }

  limpiar(): void {
    this.busqueda = '';
    this.resultado = null;
    this.noEncontrado = false;
  }
}
