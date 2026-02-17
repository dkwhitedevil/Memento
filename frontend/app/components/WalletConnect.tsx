'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="border-4 border-black px-4 py-2 font-bold shadow-[6px_6px_0px_#000] bg-white hover-lift relative overflow-hidden group">
          <div className="flex items-center gap-2 relative z-20">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
            <span className="text-sm font-mono group-hover:text-gray-600 transition-colors duration-300">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
          <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="relative">
          <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center bg-white shadow-[4px_4px_0px_#000]">
            <span className="text-black text-xs font-bold">✓</span>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full animate-ping"></div>
        </div>

        <button
          onClick={() => disconnect()}
          className="border-4 border-black px-3 py-2 font-bold shadow-[4px_4px_0px_#000] bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 hover-lift relative overflow-hidden group"
        >
          <span className="relative z-20 flex items-center gap-1">
            <span className="text-sm">✕</span>
            <span className="group-hover:text-gray-600 transition-colors duration-300">Disconnect</span>
          </span>
          <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>
      </div>
    );
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="border-4 border-black px-6 py-3 font-bold shadow-[6px_6px_0px_#000] bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 hover-lift relative overflow-hidden group"
                  >
                    <span className="relative z-20 flex items-center gap-2">
                      <span className="text-lg">🔗</span>
                      <span className="group-hover:text-white transition-colors duration-300">Connect Wallet</span>
                    </span>
                    <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="border-4 border-black px-4 py-2 font-bold shadow-[6px_6px_0px_#000] bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                    className="border-4 border-black px-3 py-2 font-bold shadow-[6px_6px_0px_#000] bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 hover-lift"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 24,
                          height: 24,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 8,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 24, height: 24 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-sm">{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="border-4 border-black px-4 py-2 font-bold shadow-[6px_6px_0px_#000] bg-white text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 hover-lift relative overflow-hidden group"
                  >
                    <div className="flex items-center gap-2 relative z-20">
                      <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                      <span className="text-sm font-mono group-hover:text-gray-600 transition-colors duration-300">
                        {account.displayName}
                      </span>
                      <span className="text-lg">👤</span>
                    </div>
                    <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
