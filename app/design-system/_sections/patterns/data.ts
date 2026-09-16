/**
 * Datos ficticios para los moldes de pantalla del showcase (M0–M5) y para las
 * cards y tablas de «Cards y tablas». Negocio genérico de servicios: órdenes,
 * clientes, responsables, movimientos de caja y cuentas. Todo estático (sin
 * `Date.now()`), así el render de servidor y cliente coinciden.
 */

import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  ClipboardList,
  FileText,
  Landmark,
  Receipt,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type OrderStatus = 'abierta' | 'en_curso' | 'cerrada' | 'cancelada';
export type OrderKind = 'servicio' | 'instalacion' | 'reparacion' | 'inspeccion';
export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type Person = { id: string; name: string };

export type Order = {
  id: string;
  folio: string;
  title: string;
  client: string;
  /** Persona física (avatar circular) o empresa (avatar cuadrado). */
  clientIsCompany: boolean;
  kind: OrderKind;
  status: OrderStatus;
  amount: number;
  /** Cobrado a la fecha (para el pendiente de la ficha). */
  charged: number;
  createdAt: string;
  createdBy: string;
  dueAt: string;
  assigneeId: string;
  location: string;
  notes: string;
};

export const PEOPLE: Person[] = [
  { id: 'mpech', name: 'Mariana Pech' },
  { id: 'rcanul', name: 'Rodrigo Canul' },
  { id: 'dek', name: 'Daniela Ek' },
  { id: 'jbalam', name: 'Jorge Balam' },
];

export function personName(id: string): string {
  return PEOPLE.find((p) => p.id === id)?.name ?? '—';
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; tone: Tone; dot: string; text: string }
> = {
  abierta: { label: 'Abierta', tone: 'warning', dot: 'bg-warning', text: 'text-warning-text' },
  en_curso: { label: 'En curso', tone: 'info', dot: 'bg-info', text: 'text-info-text' },
  cerrada: { label: 'Cerrada', tone: 'success', dot: 'bg-success', text: 'text-success-text' },
  cancelada: { label: 'Cancelada', tone: 'danger', dot: 'bg-danger', text: 'text-danger-text' },
};

export const ORDER_KIND_META: Record<OrderKind, { label: string; icon: LucideIcon; tone: Tone }> =
  {
    servicio: { label: 'Servicio', icon: Wrench, tone: 'info' },
    instalacion: { label: 'Instalación', icon: ClipboardList, tone: 'success' },
    reparacion: { label: 'Reparación', icon: Wrench, tone: 'warning' },
    inspeccion: { label: 'Inspección', icon: FileText, tone: 'neutral' },
  };

export const ORDERS: Order[] = [
  {
    id: 'o-0033',
    folio: 'ORD-2026-0033',
    title: 'Mantenimiento de aire acondicionado',
    client: 'Grupo Peninsular, S.A. de C.V.',
    clientIsCompany: true,
    kind: 'servicio',
    status: 'en_curso',
    amount: 18500,
    charged: 7400,
    createdAt: '2026-09-14',
    createdBy: 'Sofía Tun',
    dueAt: '2026-09-22',
    assigneeId: 'mpech',
    location: 'Oficinas Altabrisa · piso 3',
    notes: 'Cambio de filtros en 6 equipos y revisión de gas en el minisplit de sala de juntas.',
  },
  {
    id: 'o-0032',
    folio: 'ORD-2026-0032',
    title: 'Instalación de luminarias LED',
    client: 'Farmacias del Norte',
    clientIsCompany: true,
    kind: 'instalacion',
    status: 'abierta',
    amount: 42800,
    charged: 0,
    createdAt: '2026-09-12',
    createdBy: 'Alejandro Chan',
    dueAt: '2026-09-30',
    assigneeId: 'rcanul',
    location: 'Sucursal Montecristo',
    notes: 'Sustituir 48 lámparas fluorescentes por paneles LED de 40 W. Material lo pone el cliente.',
  },
  {
    id: 'o-0031',
    folio: 'ORD-2026-0031',
    title: 'Reparación de fuga en cisterna',
    client: 'Laura Cetina',
    clientIsCompany: false,
    kind: 'reparacion',
    status: 'en_curso',
    amount: 9650,
    charged: 4800,
    createdAt: '2026-09-10',
    createdBy: 'Sofía Tun',
    dueAt: '2026-09-18',
    assigneeId: 'dek',
    location: 'Casa en Cholul',
    notes: 'Fuga en la unión del flotador. Se cotizó impermeabilizar la tapa como obra extra.',
  },
  {
    id: 'o-0030',
    folio: 'ORD-2026-0030',
    title: 'Inspección eléctrica anual',
    client: 'Despacho Contable Ruiz y Asociados',
    clientIsCompany: true,
    kind: 'inspeccion',
    status: 'cerrada',
    amount: 4850,
    charged: 4850,
    createdAt: '2026-09-08',
    createdBy: 'Alejandro Chan',
    dueAt: '2026-09-11',
    assigneeId: 'jbalam',
    location: 'Plaza Fiesta · local 12',
    notes: 'Sin observaciones. Se entregó reporte firmado.',
  },
  {
    id: 'o-0029',
    folio: 'ORD-2026-0029',
    title: 'Pintura de fachada',
    client: 'Residencial Las Palmas',
    clientIsCompany: true,
    kind: 'servicio',
    status: 'en_curso',
    amount: 128400,
    charged: 64200,
    createdAt: '2026-09-04',
    createdBy: 'Sofía Tun',
    dueAt: '2026-10-05',
    assigneeId: 'mpech',
    location: 'Caseta y bardas perimetrales',
    notes: 'Dos manos de pintura vinílica; el color lo aprobó la mesa directiva el 03/09.',
  },
  {
    id: 'o-0028',
    folio: 'ORD-2026-0028',
    title: 'Cambio de chapa y cerradura',
    client: 'Mario Canché',
    clientIsCompany: false,
    kind: 'reparacion',
    status: 'cerrada',
    amount: 2300,
    charged: 2300,
    createdAt: '2026-09-03',
    createdBy: 'Alejandro Chan',
    dueAt: '2026-09-04',
    assigneeId: 'jbalam',
    location: 'Departamento 2B · Itzimná',
    notes: 'Se entregaron tres juegos de llaves.',
  },
  {
    id: 'o-0027',
    folio: 'ORD-2026-0027',
    title: 'Instalación de bomba de agua',
    client: 'Hospedaje La Ceiba',
    clientIsCompany: true,
    kind: 'instalacion',
    status: 'abierta',
    amount: 15900,
    charged: 0,
    createdAt: '2026-09-02',
    createdBy: 'Sofía Tun',
    dueAt: '2026-09-20',
    assigneeId: 'rcanul',
    location: 'Cuarto de máquinas',
    notes: 'Bomba de 1 HP con presurizador. Pendiente confirmar fecha con el encargado.',
  },
  {
    id: 'o-0026',
    folio: 'ORD-2026-0026',
    title: 'Reparación de portón automático',
    client: 'Comercializadora Maya, S.A. de C.V.',
    clientIsCompany: true,
    kind: 'reparacion',
    status: 'cancelada',
    amount: 7200,
    charged: 0,
    createdAt: '2026-08-28',
    createdBy: 'Alejandro Chan',
    dueAt: '2026-09-05',
    assigneeId: 'dek',
    location: 'Bodega norte',
    notes: 'El cliente contrató directamente al fabricante.',
  },
  {
    id: 'o-0025',
    folio: 'ORD-2026-0025',
    title: 'Servicio de jardinería mensual',
    client: 'Clínica Dental Sonrisa',
    clientIsCompany: true,
    kind: 'servicio',
    status: 'cerrada',
    amount: 3600,
    charged: 3600,
    createdAt: '2026-08-26',
    createdBy: 'Sofía Tun',
    dueAt: '2026-08-29',
    assigneeId: 'jbalam',
    location: 'Jardín frontal y estacionamiento',
    notes: 'Poda, riego y retiro de maleza.',
  },
  {
    id: 'o-0024',
    folio: 'ORD-2026-0024',
    title: 'Inspección de instalación de gas',
    client: 'Panadería La Espiga',
    clientIsCompany: true,
    kind: 'inspeccion',
    status: 'cerrada',
    amount: 5400,
    charged: 5400,
    createdAt: '2026-08-21',
    createdBy: 'Alejandro Chan',
    dueAt: '2026-08-25',
    assigneeId: 'mpech',
    location: 'Área de hornos',
    notes: 'Se detectó una válvula con desgaste; se cotizó por separado.',
  },
];

export function isOpenStatus(status: OrderStatus): boolean {
  return status === 'abierta' || status === 'en_curso';
}

export function orderById(id: string | null): Order | undefined {
  return id ? ORDERS.find((o) => o.id === id) : undefined;
}

// ---------------------------------------------------------------------------
// Movimientos de caja (regla del libro: solo las salidas en rojo)
// ---------------------------------------------------------------------------

export type Movement = {
  id: string;
  concept: string;
  detail: string;
  /** Positivo = entrada, negativo = salida. */
  amount: number;
  date: string;
  icon: LucideIcon;
  tone: Tone;
};

export const MOVEMENTS: Movement[] = [
  {
    id: 'm1',
    concept: 'Cobro ORD-2026-0027',
    detail: 'Hospedaje La Ceiba · transferencia',
    amount: 18500,
    date: '2026-09-15',
    icon: ArrowDownLeft,
    tone: 'success',
  },
  {
    id: 'm2',
    concept: 'Pago a proveedor',
    detail: 'Ferretería El Tornillo · factura F-1187',
    amount: -6240,
    date: '2026-09-15',
    icon: ArrowUpRight,
    tone: 'danger',
  },
  {
    id: 'm3',
    concept: 'Renta de septiembre',
    detail: 'Departamento 3B · Itzimná',
    amount: 12000,
    date: '2026-09-14',
    icon: Banknote,
    tone: 'success',
  },
  {
    id: 'm4',
    concept: 'Nómina semanal',
    detail: '4 técnicos · semana 37',
    amount: -22300,
    date: '2026-09-13',
    icon: ArrowUpRight,
    tone: 'danger',
  },
  {
    id: 'm5',
    concept: 'Anticipo ORD-2026-0029',
    detail: 'Residencial Las Palmas · 50 %',
    amount: 64200,
    date: '2026-09-11',
    icon: Receipt,
    tone: 'success',
  },
];

// ---------------------------------------------------------------------------
// Pendientes derivados («Por cerrar») y cuentas (cockpit)
// ---------------------------------------------------------------------------

export type Pending = {
  id: string;
  title: string;
  detail: string;
  count: number;
  icon: LucideIcon;
  tone: Tone;
};

export const PENDING: Pending[] = [
  {
    id: 'p1',
    title: 'Órdenes que vencen esta semana',
    detail: 'ORD-2026-0031 y ORD-2026-0027',
    count: 2,
    icon: ClipboardList,
    tone: 'warning',
  },
  {
    id: 'p2',
    title: 'Cotizaciones sin respuesta',
    detail: 'Más de 7 días desde el envío',
    count: 3,
    icon: FileText,
    tone: 'info',
  },
  {
    id: 'p3',
    title: 'Facturas por timbrar',
    detail: 'Cobros de la semana pasada',
    count: 4,
    icon: Receipt,
    tone: 'neutral',
  },
  {
    id: 'p4',
    title: 'Conciliación de agosto',
    detail: 'Cuenta operativa · 2 movimientos sin cuadrar',
    count: 2,
    icon: Landmark,
    tone: 'danger',
  },
];

export type Account = {
  key: string;
  name: string;
  balance: number;
  /** Utilidad del punto de la leyenda (tokens --color-chart-*). */
  dotClass: string;
  /** Variable CSS que colorea la rebanada (misma entidad, mismo color). */
  cssVar: string;
};

export const ACCOUNTS: Account[] = [
  {
    key: 'operativa',
    name: 'Cuenta operativa',
    balance: 184200,
    dotClass: 'bg-chart-1',
    cssVar: 'var(--color-chart-1)',
  },
  {
    key: 'ahorro',
    name: 'Cuenta de ahorro',
    balance: 96500,
    dotClass: 'bg-chart-2',
    cssVar: 'var(--color-chart-2)',
  },
  {
    key: 'inversion',
    name: 'Inversión a plazo',
    balance: 60000,
    dotClass: 'bg-chart-3',
    cssVar: 'var(--color-chart-3)',
  },
  {
    key: 'caja',
    name: 'Caja chica',
    balance: 8300,
    dotClass: 'bg-chart-4',
    cssVar: 'var(--color-chart-4)',
  },
];
