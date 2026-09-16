import type { Metadata } from 'next';

import { NewOrderFocused } from './_components/NewOrderFocused';

export const metadata: Metadata = { title: 'Nueva orden · Kit' };

/** M7 · Alta en página enfocada (sin sidebar). Estado en cliente, sin backend. */
export default function Page() {
  return <NewOrderFocused />;
}
