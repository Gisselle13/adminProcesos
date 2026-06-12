# AdminProcesos

Sistema de administración de procesos para gestión de Órdenes de Compra y Recepción.

## Estructura

```
adminProcesos/
├── backend/          # API REST con Node.js + Express + MySQL
└── frontend/         # Aplicación Angular
```

## Módulos principales

- **Recepción OC** (`recibeoc`): Actualización y eliminación de recepciones
- **Orden de Compra** (`ordencompra`): Consulta de órdenes de compra
- **Backup automático** en `recibeoc_backup` al eliminar registros

## Inicio rápido

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Editar con tus credenciales DB
npm run dev
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

La API corre en http://localhost:3000  
El frontend corre en http://localhost:4200
