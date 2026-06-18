import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UiStateService } from './services/ui-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="brand">
        <span class="brand-icon">⚙️</span>
        <span class="brand-name">AdminProcesos</span>
      </div>
      <nav>
        <a routerLink="/recibeoc" routerLinkActive="active">Recepción OC</a>
        <a routerLink="/llaves"   routerLinkActive="active">🔑 Consulta Llaves</a>
        <button
          class="nav-btn-backup"
          [class.active]="ui.mostrarBackup"
          (click)="ui.toggleBackup()"
          title="Mostrar / ocultar registros eliminados">
          ♻️ Eliminados
        </button>
      </nav>
    </header>
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: .75rem 1.5rem;
      background: #161b22;
      border-bottom: 1px solid #2a3a4a;
      box-shadow: 0 2px 12px rgba(0,229,255,.08);
    }
    .brand { display: flex; align-items: center; gap: .5rem; }
    .brand-icon { font-size: 1.4rem; }
    .brand-name {
      font-size: 1.15rem; font-weight: 700; letter-spacing: .5px;
      color: #00e5ff;
      text-shadow: 0 0 10px rgba(0,229,255,.4);
    }
    nav { display: flex; align-items: center; gap: .5rem; }
    nav a {
      color: #7ec8d8; text-decoration: none;
      padding: .35rem .8rem; border-radius: 5px;
      font-size: .9rem; font-weight: 500;
      transition: background .15s, color .15s;
    }
    nav a:hover, nav a.active {
      background: rgba(0,229,255,.12);
      color: #00e5ff;
    }
    .nav-btn-backup {
      background: transparent;
      border: 1px solid rgba(0,230,118,.35);
      color: #7ec8d8;
      padding: .35rem .8rem; border-radius: 5px;
      font-size: .9rem; font-weight: 500; cursor: pointer;
      transition: background .15s, color .15s, border-color .15s;
    }
    .nav-btn-backup:hover {
      background: rgba(0,230,118,.1);
      color: #00e676;
      border-color: rgba(0,230,118,.6);
    }
    .nav-btn-backup.active {
      background: rgba(0,230,118,.18);
      color: #00e676;
      border-color: #00e676;
      box-shadow: 0 0 8px rgba(0,230,118,.3);
    }
    .app-main { padding: 1.5rem; max-width: 1400px; margin: 0 auto; }
  `]
})
export class AppComponent {
  constructor(public ui: UiStateService) {}
}
