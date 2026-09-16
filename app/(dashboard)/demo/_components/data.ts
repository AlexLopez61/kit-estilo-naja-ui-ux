/**
 * Datos ficticios de la demo del shell: órdenes de servicio, clientes,
 * cuentas, movimientos, documentos y actividad. Todo en español, MXN y con
 * fechas ancladas a `DEMO_TODAY` para que las fechas relativas («hoy»,
 * «hace 3 días») y el periodo del cockpit sean deterministas en SSR y cliente.
 *
 * El proyecto real sustituye este archivo por sus queries; los componentes de
 * `/demo` solo dependen de los tipos exportados aquí.
 */

import {
  Banknote,
  ClipboardCheck,
  FileText,
  Hammer,
  Image,
  MessageSquare,
  Plug,
  Receipt,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import { formatDate } from '@/lib/i18n/formatters';

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** «Hoy» de la demo (YYYY-MM-DD). */
export const DEMO_TODAY = '2026-09-16';

// ---------------------------------------------------------------------------
// Personas
// ---------------------------------------------------------------------------

export type DemoUser = { id: string; name: string };

export const USERS: DemoUser[] = [
  { id: 'u-alex', name: 'Alex López' },
  { id: 'u-mariana', name: 'Mariana Ruiz' },
  { id: 'u-carlos', name: 'Carlos Pech' },
];

export const CURRENT_USER: DemoUser = USERS[0]!;

export function userName(id: string): string {
  return USERS.find((u) => u.id === id)?.name ?? 'Usuario';
}

export type DemoClient = { id: string; name: string; kind: 'persona' | 'empresa' };

export const CLIENTS: DemoClient[] = [
  { id: 'c-01', name: 'Inmobiliaria Mayab', kind: 'empresa' },
  { id: 'c-02', name: 'Laura Cetina', kind: 'persona' },
  { id: 'c-03', name: 'Torre Montejo', kind: 'empresa' },
  { id: 'c-04', name: 'Rodrigo Ancona', kind: 'persona' },
  { id: 'c-05', name: 'Plaza Altabrisa', kind: 'empresa' },
  { id: 'c-06', name: 'Sofía Herrera', kind: 'persona' },
];

export function clientById(id: string): DemoClient | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function clientName(id: string): string {
  return clientById(id)?.name ?? 'Cliente';
}

// ---------------------------------------------------------------------------
// Órdenes
// ---------------------------------------------------------------------------

export type OrderStatus = 'borrador' | 'en_curso' | 'por_liquidar' | 'cerrada' | 'cancelada';

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone; open: boolean }> = {
  borrador: { label: 'Borrador', tone: 'neutral', open: true },
  en_curso: { label: 'En curso', tone: 'info', open: true },
  por_liquidar: { label: 'Por liquidar', tone: 'warning', open: true },
  cerrada: { label: 'Cerrada', tone: 'success', open: false },
  cancelada: { label: 'Cancelada', tone: 'danger', open: false },
};

export const ORDER_STATUS_LIST = Object.keys(ORDER_STATUS) as OrderStatus[];

export type OrderKind = 'mantenimiento' | 'instalacion' | 'reparacion' | 'inspeccion';

export const ORDER_KIND: Record<OrderKind, { label: string; key: string; icon: LucideIcon }> = {
  mantenimiento: { label: 'Mantenimiento', key: 'MAN', icon: Wrench },
  instalacion: { label: 'Instalación', key: 'INS', icon: Plug },
  reparacion: { label: 'Reparación', key: 'REP', icon: Hammer },
  inspeccion: { label: 'Inspección', key: 'INSP', icon: ClipboardCheck },
};

export const ORDER_KIND_LIST = Object.keys(ORDER_KIND) as OrderKind[];

export type OrderItem = { concept: string; qty: number; unitPrice: number };

export type OrderEvent = { at: string; text: string; byId: string };

export type DemoOrder = {
  id: string;
  folio: string;
  title: string;
  clientId: string;
  kind: OrderKind;
  status: OrderStatus;
  /** YYYY-MM-DD */
  createdAt: string;
  dueAt: string;
  createdById: string;
  assigneeId: string;
  location: string;
  notes: string;
  items: OrderItem[];
  paid: number;
  history: OrderEvent[];
  comments: OrderEvent[];
};

export function orderTotal(order: Pick<DemoOrder, 'items'>): number {
  return Math.round(order.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0));
}

export function orderBalance(order: Pick<DemoOrder, 'items' | 'paid'>): number {
  return Math.max(0, orderTotal(order) - order.paid);
}

export function isOverdue(order: Pick<DemoOrder, 'status' | 'dueAt'>): boolean {
  return ORDER_STATUS[order.status].open && order.dueAt < DEMO_TODAY;
}

/** Siguiente folio ORD-AAAA-NNNN a partir de la lista actual. */
export function nextFolio(orders: Pick<DemoOrder, 'folio'>[]): string {
  const year = DEMO_TODAY.slice(0, 4);
  const max = orders.reduce((m, o) => {
    const n = Number(o.folio.split('-').at(-1) ?? 0);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `ORD-${year}-${String(max + 1).padStart(4, '0')}`;
}

export const ORDERS: DemoOrder[] = [
  {
    id: 'ord-01',
    folio: 'ORD-2026-0001',
    title: 'Impermeabilización de azotea',
    clientId: 'c-01',
    kind: 'mantenimiento',
    status: 'cerrada',
    createdAt: '2026-08-03',
    dueAt: '2026-08-20',
    createdById: 'u-alex',
    assigneeId: 'u-carlos',
    location: 'Casa Itzimná',
    notes: 'Garantía de 5 años sobre el impermeabilizante. Entregar acta al cliente.',
    items: [
      { concept: 'Impermeabilizante acrílico 5 años (cubeta 19 L)', qty: 12, unitPrice: 1850 },
      { concept: 'Mano de obra y preparación de superficie', qty: 1, unitPrice: 9500 },
    ],
    paid: 31700,
    history: [
      { at: '2026-08-03', text: 'Orden creada', byId: 'u-alex' },
      { at: '2026-08-05', text: 'Cambio a «En curso»', byId: 'u-carlos' },
      { at: '2026-08-22', text: 'Cambio a «Cerrada»', byId: 'u-alex' },
    ],
    comments: [{ at: '2026-08-21', text: 'Cliente conforme con la entrega.', byId: 'u-carlos' }],
  },
  {
    id: 'ord-02',
    folio: 'ORD-2026-0002',
    title: 'Cambio de tablero eléctrico',
    clientId: 'c-03',
    kind: 'instalacion',
    status: 'cerrada',
    createdAt: '2026-08-06',
    dueAt: '2026-08-15',
    createdById: 'u-mariana',
    assigneeId: 'u-carlos',
    location: 'Torre Montejo · Piso 4',
    notes: 'Coordinar corte de energía con administración del edificio.',
    items: [
      { concept: 'Tablero de 24 polos', qty: 1, unitPrice: 6200 },
      { concept: 'Interruptor termomagnético', qty: 8, unitPrice: 420 },
      { concept: 'Mano de obra eléctrica', qty: 1, unitPrice: 4800 },
    ],
    paid: 14360,
    history: [
      { at: '2026-08-06', text: 'Orden creada', byId: 'u-mariana' },
      { at: '2026-08-15', text: 'Cambio a «Cerrada»', byId: 'u-mariana' },
    ],
    comments: [],
  },
  {
    id: 'ord-03',
    folio: 'ORD-2026-0003',
    title: 'Fuga en baño principal',
    clientId: 'c-02',
    kind: 'reparacion',
    status: 'por_liquidar',
    createdAt: '2026-08-18',
    dueAt: '2026-09-05',
    createdById: 'u-alex',
    assigneeId: 'u-carlos',
    location: 'Depto. 302, Altabrisa',
    notes: 'La inquilina pidió aviso con un día de anticipación.',
    items: [
      { concept: 'Reparación de fuga y sellado', qty: 1, unitPrice: 2800 },
      { concept: 'Llave mezcladora monomando', qty: 1, unitPrice: 1650 },
    ],
    paid: 2000,
    history: [
      { at: '2026-08-18', text: 'Orden creada', byId: 'u-alex' },
      { at: '2026-08-19', text: 'Cambio a «En curso»', byId: 'u-carlos' },
      { at: '2026-09-04', text: 'Cambio a «Por liquidar»', byId: 'u-carlos' },
    ],
    comments: [
      { at: '2026-09-04', text: 'Falta cobrar el saldo a la propietaria.', byId: 'u-alex' },
    ],
  },
  {
    id: 'ord-04',
    folio: 'ORD-2026-0004',
    title: 'Pintura exterior de fachada',
    clientId: 'c-05',
    kind: 'mantenimiento',
    status: 'en_curso',
    createdAt: '2026-08-25',
    dueAt: '2026-09-30',
    createdById: 'u-mariana',
    assigneeId: 'u-carlos',
    location: 'Plaza Altabrisa · Local 12',
    notes: 'Trabajar fuera del horario comercial (antes de las 10:00).',
    items: [
      { concept: 'Pintura vinílica exterior (19 L)', qty: 6, unitPrice: 1280 },
      { concept: 'Sellador acrílico', qty: 4, unitPrice: 390 },
      { concept: 'Mano de obra y andamios', qty: 1, unitPrice: 18500 },
    ],
    paid: 12000,
    history: [
      { at: '2026-08-25', text: 'Orden creada', byId: 'u-mariana' },
      { at: '2026-09-01', text: 'Cambio a «En curso»', byId: 'u-carlos' },
    ],
    comments: [],
  },
  {
    id: 'ord-05',
    folio: 'ORD-2026-0005',
    title: 'Mantenimiento de minisplits',
    clientId: 'c-01',
    kind: 'mantenimiento',
    status: 'en_curso',
    createdAt: '2026-09-02',
    dueAt: '2026-09-25',
    createdById: 'u-alex',
    assigneeId: 'u-mariana',
    location: 'Casa Itzimná',
    notes: 'Seis equipos en total; la unidad de la recámara principal se reubica al patio.',
    items: [
      { concept: 'Servicio de minisplit 1 ton', qty: 6, unitPrice: 950 },
      { concept: 'Carga de gas R410A', qty: 3, unitPrice: 1200 },
      { concept: 'Cambio de capacitor', qty: 2, unitPrice: 650 },
      { concept: 'Reubicación de unidad exterior', qty: 1, unitPrice: 4200 },
    ],
    paid: 6000,
    history: [
      { at: '2026-09-02', text: 'Orden creada', byId: 'u-alex' },
      { at: '2026-09-03', text: 'Cambio a «En curso»', byId: 'u-mariana' },
    ],
    comments: [
      { at: '2026-09-10', text: 'Unidad exterior reubicada sin incidencias.', byId: 'u-mariana' },
      {
        at: '2026-09-12',
        text: 'Se compraron los capacitores en Ferretería Ancona.',
        byId: 'u-carlos',
      },
    ],
  },
  {
    id: 'ord-06',
    folio: 'ORD-2026-0006',
    title: 'Instalación de calentador solar',
    clientId: 'c-04',
    kind: 'instalacion',
    status: 'por_liquidar',
    createdAt: '2026-08-28',
    dueAt: '2026-09-12',
    createdById: 'u-mariana',
    assigneeId: 'u-carlos',
    location: 'Fracc. Las Américas',
    notes: '',
    items: [
      { concept: 'Calentador solar 150 L', qty: 1, unitPrice: 9800 },
      { concept: 'Instalación hidráulica', qty: 1, unitPrice: 3200 },
    ],
    paid: 9800,
    history: [
      { at: '2026-08-28', text: 'Orden creada', byId: 'u-mariana' },
      { at: '2026-09-11', text: 'Cambio a «Por liquidar»', byId: 'u-carlos' },
    ],
    comments: [],
  },
  {
    id: 'ord-07',
    folio: 'ORD-2026-0007',
    title: 'Inspección anual de extintores',
    clientId: 'c-03',
    kind: 'inspeccion',
    status: 'en_curso',
    createdAt: '2026-09-08',
    dueAt: '2026-09-22',
    createdById: 'u-alex',
    assigneeId: 'u-mariana',
    location: 'Torre Montejo · Áreas comunes',
    notes: 'Entregar constancia de recarga a Protección Civil.',
    items: [{ concept: 'Inspección y recarga de extintor', qty: 14, unitPrice: 380 }],
    paid: 0,
    history: [{ at: '2026-09-08', text: 'Orden creada', byId: 'u-alex' }],
    comments: [],
  },
  {
    id: 'ord-08',
    folio: 'ORD-2026-0008',
    title: 'Reparación de portón automático',
    clientId: 'c-05',
    kind: 'reparacion',
    status: 'borrador',
    createdAt: '2026-09-10',
    dueAt: '2026-10-03',
    createdById: 'u-mariana',
    assigneeId: 'u-carlos',
    location: 'Plaza Altabrisa · Estacionamiento',
    notes: 'Pendiente de aprobación del presupuesto.',
    items: [
      { concept: 'Motor para portón corredizo', qty: 1, unitPrice: 7400 },
      { concept: 'Mano de obra', qty: 1, unitPrice: 2200 },
    ],
    paid: 0,
    history: [{ at: '2026-09-10', text: 'Orden creada', byId: 'u-mariana' }],
    comments: [],
  },
  {
    id: 'ord-09',
    folio: 'ORD-2026-0009',
    title: 'Limpieza de cisterna',
    clientId: 'c-02',
    kind: 'mantenimiento',
    status: 'por_liquidar',
    createdAt: '2026-08-30',
    dueAt: '2026-09-10',
    createdById: 'u-alex',
    assigneeId: 'u-carlos',
    location: 'Depto. 302, Altabrisa',
    notes: '',
    items: [{ concept: 'Lavado y desinfección de cisterna', qty: 1, unitPrice: 2400 }],
    paid: 1200,
    history: [
      { at: '2026-08-30', text: 'Orden creada', byId: 'u-alex' },
      { at: '2026-09-09', text: 'Cambio a «Por liquidar»', byId: 'u-carlos' },
    ],
    comments: [],
  },
  {
    id: 'ord-10',
    folio: 'ORD-2026-0010',
    title: 'Cambio de cerraduras',
    clientId: 'c-06',
    kind: 'instalacion',
    status: 'en_curso',
    createdAt: '2026-09-11',
    dueAt: '2026-09-19',
    createdById: 'u-mariana',
    assigneeId: 'u-mariana',
    location: 'Casa Montecristo',
    notes: 'Entregar dos juegos de llaves y el código maestro.',
    items: [
      { concept: 'Cerradura digital', qty: 2, unitPrice: 3900 },
      { concept: 'Instalación', qty: 2, unitPrice: 600 },
    ],
    paid: 4500,
    history: [
      { at: '2026-09-11', text: 'Orden creada', byId: 'u-mariana' },
      { at: '2026-09-15', text: 'Cambio a «En curso»', byId: 'u-mariana' },
    ],
    comments: [],
  },
  {
    id: 'ord-11',
    folio: 'ORD-2026-0011',
    title: 'Revisión de humedad en muro',
    clientId: 'c-04',
    kind: 'inspeccion',
    status: 'borrador',
    createdAt: '2026-09-14',
    dueAt: '2026-09-28',
    createdById: 'u-alex',
    assigneeId: 'u-alex',
    location: 'Fracc. Las Américas',
    notes: '',
    items: [{ concept: 'Diagnóstico con medidor de humedad', qty: 1, unitPrice: 1500 }],
    paid: 0,
    history: [{ at: '2026-09-14', text: 'Orden creada', byId: 'u-alex' }],
    comments: [],
  },
  {
    id: 'ord-12',
    folio: 'ORD-2026-0012',
    title: 'Reparación de bomba de agua',
    clientId: 'c-01',
    kind: 'reparacion',
    status: 'en_curso',
    createdAt: '2026-09-12',
    dueAt: '2026-09-18',
    createdById: 'u-carlos',
    assigneeId: 'u-carlos',
    location: 'Casa Itzimná',
    notes: 'Urgente: la casa está sin presión de agua.',
    items: [
      { concept: 'Bomba periférica 1/2 HP', qty: 1, unitPrice: 2350 },
      { concept: 'Mano de obra', qty: 1, unitPrice: 900 },
    ],
    paid: 0,
    history: [
      { at: '2026-09-12', text: 'Orden creada', byId: 'u-carlos' },
      { at: '2026-09-12', text: 'Cambio a «En curso»', byId: 'u-carlos' },
    ],
    comments: [],
  },
  {
    id: 'ord-13',
    folio: 'ORD-2026-0013',
    title: 'Poda y jardinería mensual',
    clientId: 'c-03',
    kind: 'mantenimiento',
    status: 'cerrada',
    createdAt: '2026-09-01',
    dueAt: '2026-09-05',
    createdById: 'u-mariana',
    assigneeId: 'u-carlos',
    location: 'Torre Montejo · Jardín',
    notes: '',
    items: [{ concept: 'Servicio mensual de jardinería', qty: 1, unitPrice: 4200 }],
    paid: 4200,
    history: [
      { at: '2026-09-01', text: 'Orden creada', byId: 'u-mariana' },
      { at: '2026-09-05', text: 'Cambio a «Cerrada»', byId: 'u-mariana' },
    ],
    comments: [],
  },
  {
    id: 'ord-14',
    folio: 'ORD-2026-0014',
    title: 'Instalación de luminarias LED',
    clientId: 'c-05',
    kind: 'instalacion',
    status: 'cancelada',
    createdAt: '2026-09-04',
    dueAt: '2026-09-20',
    createdById: 'u-alex',
    assigneeId: 'u-carlos',
    location: 'Plaza Altabrisa · Pasillos',
    notes: 'Cancelada por el cliente: contrató a otro proveedor.',
    items: [
      { concept: 'Luminaria LED 36 W', qty: 20, unitPrice: 640 },
      { concept: 'Instalación', qty: 20, unitPrice: 150 },
    ],
    paid: 0,
    history: [
      { at: '2026-09-04', text: 'Orden creada', byId: 'u-alex' },
      { at: '2026-09-09', text: 'Cambio a «Cancelada»', byId: 'u-alex' },
    ],
    comments: [],
  },
];

/** Orden que abre la ficha en página (`/demo/ficha`). */
export const FEATURED_ORDER_ID = 'ord-05';

// ---------------------------------------------------------------------------
// Cuentas y movimientos
// ---------------------------------------------------------------------------

export type DemoAccount = {
  id: string;
  name: string;
  bank: string;
  balance: number;
  /**
   * Color de la entidad para la dona y su leyenda (misma cuenta, misma
   * rebanada, misma fila). Sólidos semánticos en orden info · success ·
   * warning (el único orden de tokens del kit que pasa el validador de
   * paletas en claro); «Efectivo» va en neutro como categoría residual.
   */
  color: string;
};

export const ACCOUNTS: DemoAccount[] = [
  {
    id: 'a-1',
    name: 'Operativa',
    bank: 'BBVA ····4821',
    balance: 184250,
    color: 'var(--color-info)',
  },
  {
    id: 'a-2',
    name: 'Rentas',
    bank: 'Banorte ····0197',
    balance: 96780,
    color: 'var(--color-success)',
  },
  {
    id: 'a-3',
    name: 'Nómina',
    bank: 'Santander ····3350',
    balance: 42100,
    color: 'var(--color-warning)',
  },
  {
    id: 'a-4',
    name: 'Efectivo',
    bank: 'Caja chica',
    balance: 8650,
    color: 'var(--color-text-tertiary)',
  },
];

export function accountName(id: string): string {
  return ACCOUNTS.find((a) => a.id === id)?.name ?? 'Cuenta';
}

export type DemoMovement = {
  id: string;
  /** YYYY-MM-DD */
  at: string;
  concept: string;
  /** Positivo = entrada, negativo = salida. */
  amount: number;
  accountId: string;
  orderId?: string;
};

export const MOVEMENTS: DemoMovement[] = [
  {
    id: 'm-01',
    at: '2026-09-15',
    concept: 'Cobro de anticipo ORD-2026-0010',
    amount: 4500,
    accountId: 'a-1',
    orderId: 'ord-10',
  },
  {
    id: 'm-02',
    at: '2026-09-15',
    concept: 'Pago a subcontratista · Carlos Pech',
    amount: -3800,
    accountId: 'a-1',
  },
  {
    id: 'm-03',
    at: '2026-09-14',
    concept: 'Renta de septiembre · Depto. 302',
    amount: 12500,
    accountId: 'a-2',
  },
  {
    id: 'm-04',
    at: '2026-09-12',
    concept: 'Materiales · Ferretería Ancona',
    amount: -2340,
    accountId: 'a-4',
    orderId: 'ord-05',
  },
  {
    id: 'm-05',
    at: '2026-09-11',
    concept: 'Cobro parcial ORD-2026-0004',
    amount: 12000,
    accountId: 'a-1',
    orderId: 'ord-04',
  },
  { id: 'm-06', at: '2026-09-09', concept: 'Nómina quincenal', amount: -18600, accountId: 'a-3' },
  {
    id: 'm-07',
    at: '2026-09-08',
    concept: 'Cobro de anticipo ORD-2026-0006',
    amount: 9800,
    accountId: 'a-1',
    orderId: 'ord-06',
  },
  {
    id: 'm-08',
    at: '2026-09-05',
    concept: 'Cobro ORD-2026-0013',
    amount: 4200,
    accountId: 'a-1',
    orderId: 'ord-13',
  },
  {
    id: 'm-09',
    at: '2026-09-03',
    concept: 'Cobro de anticipo ORD-2026-0005',
    amount: 6000,
    accountId: 'a-1',
    orderId: 'ord-05',
  },
  {
    id: 'm-10',
    at: '2026-09-02',
    concept: 'Comisión de administración · agosto',
    amount: 7800,
    accountId: 'a-2',
  },
  {
    id: 'm-11',
    at: '2026-08-29',
    concept: 'Pago a subcontratista · Electricidad',
    amount: -4800,
    accountId: 'a-1',
    orderId: 'ord-02',
  },
  {
    id: 'm-12',
    at: '2026-08-22',
    concept: 'Cobro de finiquito ORD-2026-0001',
    amount: 15700,
    accountId: 'a-1',
    orderId: 'ord-01',
  },
  {
    id: 'm-13',
    at: '2026-08-20',
    concept: 'Gasolina y transporte',
    amount: -1150,
    accountId: 'a-4',
  },
  {
    id: 'm-14',
    at: '2026-08-15',
    concept: 'Cobro ORD-2026-0002',
    amount: 14360,
    accountId: 'a-1',
    orderId: 'ord-02',
  },
];

// ---------------------------------------------------------------------------
// Documentos y actividad de la ficha
// ---------------------------------------------------------------------------

export type DocKind = 'cotizacion' | 'foto' | 'factura';

export const DOC_KIND: Record<DocKind, { label: string; plural: string; icon: LucideIcon }> = {
  cotizacion: { label: 'Cotización', plural: 'Cotizaciones', icon: FileText },
  foto: { label: 'Foto', plural: 'Fotos', icon: Image },
  factura: { label: 'Factura', plural: 'Facturas', icon: Receipt },
};

export const DOC_KIND_LIST = Object.keys(DOC_KIND) as DocKind[];

export type DemoDocument = {
  id: string;
  kind: DocKind;
  name: string;
  bytes: number;
  at: string;
  byId: string;
};

export const DOCUMENTS: DemoDocument[] = [
  {
    id: 'd-1',
    kind: 'cotizacion',
    name: 'Cotización COT-2026-0031.pdf',
    bytes: 184320,
    at: '2026-09-02',
    byId: 'u-alex',
  },
  {
    id: 'd-2',
    kind: 'foto',
    name: 'Minisplit sala · antes.jpg',
    bytes: 2450000,
    at: '2026-09-05',
    byId: 'u-mariana',
  },
  {
    id: 'd-3',
    kind: 'foto',
    name: 'Unidad exterior reubicada.jpg',
    bytes: 3120000,
    at: '2026-09-10',
    byId: 'u-mariana',
  },
  {
    id: 'd-4',
    kind: 'cotizacion',
    name: 'Cotización capacitores.pdf',
    bytes: 96000,
    at: '2026-09-08',
    byId: 'u-alex',
  },
];

export type ActivityKind = 'created' | 'progress' | 'charge' | 'expense' | 'file' | 'comment';

export const ACTIVITY_ICON: Record<ActivityKind, { icon: LucideIcon; tone: Tone }> = {
  created: { icon: ClipboardCheck, tone: 'neutral' },
  progress: { icon: Wrench, tone: 'info' },
  charge: { icon: Banknote, tone: 'success' },
  expense: { icon: Receipt, tone: 'danger' },
  file: { icon: Image, tone: 'neutral' },
  comment: { icon: MessageSquare, tone: 'neutral' },
};

export type DemoActivity = {
  id: string;
  kind: ActivityKind;
  /** YYYY-MM-DD */
  at: string;
  time: string;
  text: string;
  byId: string;
};

export const ACTIVITY: DemoActivity[] = [
  {
    id: 'ac-1',
    kind: 'file',
    at: '2026-09-16',
    time: '10:42',
    text: 'Subió 2 fotos del avance',
    byId: 'u-mariana',
  },
  {
    id: 'ac-2',
    kind: 'progress',
    at: '2026-09-16',
    time: '09:15',
    text: 'Registró avance: 62 %',
    byId: 'u-mariana',
  },
  {
    id: 'ac-3',
    kind: 'charge',
    at: '2026-09-15',
    time: '17:30',
    text: 'Registró un cobro de anticipo por $6,000.00',
    byId: 'u-alex',
  },
  {
    id: 'ac-4',
    kind: 'expense',
    at: '2026-09-12',
    time: '12:05',
    text: 'Registró un gasto de materiales por $2,340.00',
    byId: 'u-carlos',
  },
  {
    id: 'ac-5',
    kind: 'comment',
    at: '2026-09-12',
    time: '11:40',
    text: 'Comentó: «Capacitores comprados en Ferretería Ancona»',
    byId: 'u-carlos',
  },
  {
    id: 'ac-6',
    kind: 'progress',
    at: '2026-09-10',
    time: '16:20',
    text: 'Terminó la reubicación de la unidad exterior',
    byId: 'u-mariana',
  },
  {
    id: 'ac-7',
    kind: 'created',
    at: '2026-09-02',
    time: '09:00',
    text: 'Creó la orden',
    byId: 'u-alex',
  },
];

// ---------------------------------------------------------------------------
// Catálogo (configuración)
// ---------------------------------------------------------------------------

export type OrderTypeRow = { id: string; name: string; key: string; count: number };

export const ORDER_TYPES: OrderTypeRow[] = ORDER_KIND_LIST.map((kind) => ({
  id: kind,
  name: ORDER_KIND[kind].label,
  key: ORDER_KIND[kind].key,
  count: ORDERS.filter((o) => o.kind === kind).length,
}));

// ---------------------------------------------------------------------------
// Fechas
// ---------------------------------------------------------------------------

function dayNumber(iso: string): number {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Días entre `iso` y hoy: positivo si `iso` es pasado, negativo si es futuro. */
export function daysAgo(iso: string): number {
  return dayNumber(DEMO_TODAY) - dayNumber(iso);
}

/** Fecha relativa determinista para actividad reciente; fecha completa fuera de una semana. */
export function relativeDay(iso: string): string {
  const diff = daysAgo(iso);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  if (diff === -1) return 'Mañana';
  if (diff > 1 && diff < 7) return `Hace ${diff} días`;
  if (diff < -1 && diff > -7) return `En ${-diff} días`;
  return formatDate(iso);
}

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

/** «septiembre de 2026» a partir del primer día de la ventana. */
export function monthLabel(from: string): string {
  const [y, m] = from.split('-').map(Number);
  return `${MONTHS[(m ?? 1) - 1]} de ${y}`;
}
