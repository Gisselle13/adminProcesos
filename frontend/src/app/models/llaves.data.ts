export interface Tecnica {
  nombre: string;
  campos: string;
  deptoSalida: string | null;
}

export interface Llave {
  id: string;
  nombre: string;
  deptoEntrada: string | null;
  tecnicas: Tecnica[];
  auxiliares: Auxiliar[];
  nota: string | null;
}

export interface Auxiliar {
  paulina: string;
  aux1: string;
  aux2: string;
}

export const LLAVES: Llave[] = [
  {
    id: 'A01',
    nombre: 'AUDITORIA cascaron P.U',
    deptoEntrada: null,
    tecnicas: [
      { nombre: 'Inyectado',    campos: 'quieni, fmoviny, nchecai, horai',          deptoSalida: '05' },
      { nombre: 'Pegado',       campos: 'quieni, nchecai, horai',                    deptoSalida: '06' },
      { nombre: 'P.U, Muestras',campos: 'quieni, fpoliure, nchecai, horai',          deptoSalida: '11' },
    ],
    auxiliares: [
      { paulina: 'GA1 PAULINA', aux1: '01R - AUX1', aux2: 'X01 - AUX2' }
    ],
    nota: null
  },
  {
    id: 'A02',
    nombre: 'AUDITORIA producto terminado',
    deptoEntrada: '20 o 21 o 22 o 30 o 31 o 32 o 40 o 41 o 42',
    tecnicas: [
      { nombre: 'Pegado',        campos: 'quiend, fpadorno, nchecad, horad',          deptoSalida: '08' },
      { nombre: 'P.U, Muestras', campos: 'quienu, fpoliado, nchecau, horau',          deptoSalida: '12' },
    ],
    auxiliares: [
      { paulina: 'GA2 PAULINA', aux1: '1B0 - AUX1', aux2: 'C1X - AUX2' }
    ],
    nota: null
  },
  {
    id: 'A03',
    nombre: 'AUDITORIA Cascaron Montado',
    deptoEntrada: null,
    tecnicas: [
      { nombre: 'Pegado P.U, Muestras', campos: 'quienm, fmontado, nchecam, horam', deptoSalida: '04' },
    ],
    auxiliares: [
      { paulina: 'GA3 PAULINA', aux1: 'F5A - AUX1', aux2: 'DC2 - AUX2' }
    ],
    nota: null
  },
  {
    id: 'R1',
    nombre: 'AUDITORIA Regresa a maquila',
    deptoEntrada: null,
    tecnicas: [],
    auxiliares: [],
    nota: 'Quita la checada de la llave A01, A02 y depende de "tm" selecciona el depto: 1 = 22, 2 = 32'
  }
];
