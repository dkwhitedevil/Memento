'use client';

import { Providers as WalletProviders } from '../providers';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <WalletProviders>{children}</WalletProviders>;
}
