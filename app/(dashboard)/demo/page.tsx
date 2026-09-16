import type { Metadata } from 'next';

import { DemoCockpit } from './_components/DemoCockpit';

export const metadata: Metadata = { title: 'Inicio · Kit' };

/** M5 · Cockpit. Server component que renderiza la vista cliente con datos locales. */
export default function Page() {
  return <DemoCockpit />;
}
