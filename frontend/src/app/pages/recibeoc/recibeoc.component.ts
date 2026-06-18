import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecibeocService } from '../../services/recibeoc.service';
import { OrdencompraService } from '../../services/ordencompra.service';
import { RecibeOC, OrdenCompra } from '../../models/interfaces';

@Component({
  selector: 'app-recibeoc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recibeoc.component.html',
  styleUrls: ['./recibeoc.component.scss']
})
export class RecibeocComponent {

  // ── Recepción OC ─────────────────────────────────────────────────────────
  folioRecibeoc: number | null = null;
  registros: RecibeOC[] = [];
  cargandoRecibeoc = false;
  busquedaRecibeocHecha = false;
  registroEditando: RecibeOC | null = null;

  // ── Orden de Compra ───────────────────────────────────────────────────────
  folioOC: number | null = null;
  ordenesCompra: OrdenCompra[] = [];
  cargandoOC = false;
  busquedaOCHecha = false;
  registroOCEditando: OrdenCompra | null = null;

  // ── Backup / Registros eliminados ─────────────────────────────────────────
  folioBackup: number | null = null;
  registrosBackup: RecibeOC[] = [];
  cargandoBackup = false;
  busquedaBackupHecha = false;

  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(
    private svcRecibeoc: RecibeocService,
    private svcOC: OrdencompraService
  ) {}

  // ── Métodos Recepción OC ──────────────────────────────────────────────────
  buscarRecibeoc(): void {
    if (!this.folioRecibeoc) return;
    this.cargandoRecibeoc = true;
    this.busquedaRecibeocHecha = false;
    this.svcRecibeoc.getByFolio(this.folioRecibeoc).subscribe({
      next: rows => {
        this.registros = rows ?? [];
        this.cargandoRecibeoc = false;
        this.busquedaRecibeocHecha = true;
      },
      error: () => {
        this.mostrarMensaje('Error al buscar en Recepción OC', 'error');
        this.cargandoRecibeoc = false;
        this.busquedaRecibeocHecha = true;
      }
    });
  }

  limpiarRecibeoc(): void {
    this.folioRecibeoc = null;
    this.registros = [];
    this.busquedaRecibeocHecha = false;
  }

  editar(r: RecibeOC): void {
    this.registroEditando = { ...r };
  }

  cancelarEdicion(): void {
    this.registroEditando = null;
  }

  guardar(): void {
    if (!this.registroEditando) return;
    this.svcRecibeoc.update(
      this.registroEditando.folio,
      this.registroEditando.renglon,
      this.registroEditando
    ).subscribe({
      next: () => {
        this.mostrarMensaje('Registro actualizado correctamente', 'success');
        this.registroEditando = null;
        this.buscarRecibeoc();
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('Error al actualizar', 'error');
      }
    });
  }

  eliminar(r: RecibeOC): void {
    if (!confirm('¿Eliminar este registro? Se guardará un respaldo automáticamente.')) return;
    this.svcRecibeoc.delete(r.folio, r.renglon).subscribe({
      next: () => {
        this.mostrarMensaje('Registro eliminado y respaldado', 'success');
        this.buscarRecibeoc();
      },
      error: () => this.mostrarMensaje('Error al eliminar', 'error')
    });
  }

  // ── Métodos Backup ────────────────────────────────────────────────────────
  buscarBackup(): void {
    if (!this.folioBackup) return;
    this.cargandoBackup = true;
    this.busquedaBackupHecha = false;
    this.svcRecibeoc.getBackupByFolio(this.folioBackup).subscribe({
      next: rows => {
        this.registrosBackup = rows ?? [];
        this.cargandoBackup = false;
        this.busquedaBackupHecha = true;
      },
      error: () => {
        this.mostrarMensaje('Error al buscar en registros eliminados', 'error');
        this.cargandoBackup = false;
        this.busquedaBackupHecha = true;
      }
    });
  }

  limpiarBackup(): void {
    this.folioBackup = null;
    this.registrosBackup = [];
    this.busquedaBackupHecha = false;
  }

  recuperar(r: RecibeOC): void {
    if (!confirm(`¿Recuperar el renglon ${r.renglon} del folio ${r.folio}?`)) return;
    this.svcRecibeoc.restore(r.folio, r.renglon).subscribe({
      next: () => {
        this.mostrarMensaje('Registro recuperado correctamente', 'success');
        this.buscarBackup();
        if (this.folioRecibeoc === r.folio) this.buscarRecibeoc();
      },
      error: (err) => {
        const msg = err?.error?.error || 'Error al recuperar el registro';
        this.mostrarMensaje(msg, 'error');
      }
    });
  }

  // ── Métodos Orden de Compra ───────────────────────────────────────────────
  buscarOC(): void {
    if (!this.folioOC) return;
    this.cargandoOC = true;
    this.busquedaOCHecha = false;
    this.svcOC.getByFolio(this.folioOC).subscribe({
      next: rows => {
        this.ordenesCompra = rows ?? [];
        this.cargandoOC = false;
        this.busquedaOCHecha = true;
      },
      error: () => {
        this.mostrarMensaje('Error al buscar Orden de Compra', 'error');
        this.cargandoOC = false;
        this.busquedaOCHecha = true;
      }
    });
  }

  limpiarOC(): void {
    this.folioOC = null;
    this.ordenesCompra = [];
    this.busquedaOCHecha = false;
  }

  editarOrden(o: OrdenCompra): void {
    this.registroOCEditando = { ...o };
  }

  cancelarEdicionOC(): void {
    this.registroOCEditando = null;
  }

  guardarOrden(): void {
    if (!this.registroOCEditando) return;
    this.svcOC.update(
      this.registroOCEditando.folio,
      this.registroOCEditando.renglon,
      this.registroOCEditando
    ).subscribe({
      next: () => {
        this.mostrarMensaje('Orden de compra actualizada correctamente', 'success');
        this.registroOCEditando = null;
        this.buscarOC();
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('Error al actualizar la orden de compra', 'error');
      }
    });
  }

  // ── Utilidades ────────────────────────────────────────────────────────────
  private mostrarMensaje(msg: string, tipo: 'success' | 'error'): void {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => { this.mensaje = ''; this.tipoMensaje = ''; }, 3500);
  }
}
