export interface RecibeOC {
  id: number;
  folio: number;
  cantidad: number;
  frecibida: string;       // date → string ISO
  hrecibida: string;       // time
  renglon: number;
  factura: string;
  observacion: string;
  nosemana: number;
  umedida: string;
  precio: number;
  claveg: string;
  claves: number;
  clavedp: string;
  clavec: string;
  clavepro: number;
  material: string;
  provedor: string;
  usuario: string;
  horaini: string;
  horafin: string;
  fechafac: string;
  estatus: number;
  // join con ordencompra
  depto?: string;
  forden?: string;
}

export interface OrdenCompra {
  claveg: string;
  claves: number;
  clavec: string;
  clavedp: string;
  depto: string;
  folio: number;
  forden: string;
  horden: string;
  fcancelada: string;
  motivocan: string;
  clavepro: number;
  concepto: string;
  cantidad: number;
  precio: number;
  xtotal: number;
  moneda: string;
  renglon: number;
  estatus: string;
  provedor: string;
  nsemana: number;
  observa1: string;
  observa2: string;
  observa3: string;
  genera: string;
  umedida: string;
  porcentaje: number;
  subtotal: number;
  descuento: number;
  iva: number;
  ttotal: number;
  folioexp: number;
  fexpini: string;
  fexpfin: string;
  fentrega: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
