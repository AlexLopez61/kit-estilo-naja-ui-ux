/**
 * Concurrencia optimista para formularios de edición.
 *
 * El formulario envía en un campo oculto el `updated_at` que tenía el registro
 * al cargarlo (token de versión). El Server Action guarda solo si ese valor
 * sigue vigente (`.eq('updated_at', expected)`). Si otro usuario ya lo cambió,
 * el UPDATE afecta 0 filas y devolvemos un conflicto en vez de pisar sus
 * cambios. Funciona en cualquier tabla con el trigger `set_updated_at()` (todas
 * las del ERD lo tienen), sin columnas ni migraciones nuevas.
 *
 * En el Server Action:
 *   const expected = expectedVersion(formData);
 *   const q = supabase.from('x').update({...}).eq('id', id);
 *   const { data, error } = await (expected ? q.eq('updated_at', expected) : q).select('id');
 *   if (expected && (!data || data.length === 0))
 *     return { status: 'error', code: 'conflict', message: CONCURRENCY_CONFLICT_MESSAGE };
 *
 * En el formulario: <VersionField value={entity?.updated_at} /> + <ActionErrorAlert state={state} />.
 */

/** Nombre del campo oculto que transporta el snapshot de versión. */
export const VERSION_FIELD = 'expected_updated_at';

/** Lee el snapshot de versión (updated_at) que envió el formulario, o null si no vino. */
export function expectedVersion(formData: FormData): string | null {
  const v = formData.get(VERSION_FIELD);
  return typeof v === 'string' && v ? v : null;
}

/** Mensaje único del conflicto de concurrencia (lo muestra `ActionErrorAlert`). */
export const CONCURRENCY_CONFLICT_MESSAGE =
  'Otra persona modificó este registro mientras lo editabas. Recarga para ver los cambios más recientes; tus cambios no se guardaron.';
