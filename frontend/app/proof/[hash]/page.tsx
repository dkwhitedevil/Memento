'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReadContract } from 'wagmi';
import { WalletConnect } from '../../components/WalletConnect';
import contractInfo from '../../../src/contracts/MementoProofRegistry.json';

const CONTRACT_ADDRESS = contractInfo.address;
const CONTRACT_ABI = contractInfo.abi;

export default function ProofPage() {
  const params = useParams();
  const router = useRouter();
  const hash = params.hash as string;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if proof exists
  const { data: exists, isLoading: checking, error: existsError } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "proofExists",
    args: [`0x${hash}` as `0x${string}`],
    query: { enabled: isClient },
  });

  // Fetch proof details
  const { data: proof, isLoading: loadingProof, error: proofError } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getProof",
    args: [`0x${hash}` as `0x${string}`],
    query: { enabled: !!exists && isClient },
  });

  const [copied, setCopied] = useState(false);

  // Type assertion for proof data - contract returns struct object, not tuple
  const proofData = proof as {
    creator: string;
    timestamp: bigint;
    metadataHash: string;
  } | null;

  // Debug: Log the raw proof data
  useEffect(() => {
    console.log(' Raw proof object:', proof);
    console.log(' Raw proof type:', typeof proof);
    if (proofData) {
      console.log(' Structured proof data:', proofData);
      console.log(' Creator:', proofData.creator);
      console.log(' Timestamp:', proofData.timestamp);
      console.log(' Metadata:', proofData.metadataHash);
    }
  }, [proof]);

  // Safe access to proof data
  const creator = proofData?.creator || '';
  const timestamp = proofData?.timestamp || BigInt(0);
  const metadataHash = proofData?.metadataHash || '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000';

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareCertificate = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Memento Certificate of Authenticity',
        text: `View my verified proof on the blockchain: ${shareUrl}`,
        url: shareUrl,
      });
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(shareUrl);
      alert('Certificate link copied to clipboard!');
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    // Convert bigint to number for Date constructor
    const timestampNumber = Number(timestamp);
    return new Date(timestampNumber * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getEtherscanUrl = (type: 'address' | 'tx', value: string) => {
    return `https://sepolia.etherscan.io/${type}/${value}`;
  };

  if (!isClient) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-spin">⚙️</div>
            <p className="text-xl font-bold">Loading certificate...</p>
          </div>
        </div>
      </main>
    );
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col">
        <nav className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-black tracking-widest"
          >
            ← MEMENTO
          </button>
          <WalletConnect />
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-spin">⚙️</div>
            <p className="text-xl font-bold">Checking proof existence...</p>
          </div>
        </div>
      </main>
    );
  }

  if (existsError || (exists === false)) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col">
        <nav className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-black tracking-widest"
          >
            ← MEMENTO
          </button>
          <WalletConnect />
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="border-4 border-black p-12 shadow-[12px_12px_0px_#000] max-w-2xl w-full text-center space-y-6">
            <div className="text-6xl">❌</div>
            <h1 className="text-3xl font-black">PROOF NOT FOUND</h1>
            <p className="text-lg">
              No proof exists for hash:
            </p>
            <div className="border-2 border-gray-300 p-4 bg-gray-50 font-mono text-sm break-all">
              0x{hash}
            </div>
            <p className="text-gray-600">
              This file has not been registered on the blockchain yet.
            </p>
            <button
              onClick={() => router.push('/create')}
              className="border-4 border-black px-8 py-4 font-bold shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition"
            >
              CREATE PROOF
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (loadingProof || !proof) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col">
        <nav className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-black tracking-widest"
          >
            ← MEMENTO
          </button>
          <WalletConnect />
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-spin">⚙️</div>
            <p className="text-xl font-bold">Loading certificate...</p>
          </div>
        </div>
      </main>
    );
  }

  if (proofError) {
    return (
      <main className="min-h-screen bg-white text-black flex flex-col">
        <nav className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-black tracking-widest"
          >
            ← MEMENTO
          </button>
          <WalletConnect />
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="border-4 border-red-600 p-12 shadow-[12px_12px_0px_#000] max-w-2xl w-full text-center space-y-6">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-3xl font-black">ERROR LOADING PROOF</h1>
            <p className="text-red-600">
              Unable to load proof details from the blockchain.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="border-4 border-red-600 px-8 py-4 font-bold text-red-600 hover:bg-red-600 hover:text-white transition"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.5); }
        }
        @keyframes stamp {
          0% { transform: scale(1.2) rotate(-15deg); opacity: 0; }
          50% { transform: scale(0.9) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-stamp {
          animation: stamp 0.6s ease-out forwards;
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <main className="min-h-screen bg-white text-black flex flex-col">
        {/* NAVBAR */}
        <nav className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-black tracking-widest hover-lift"
          >
            ← MEMENTO
          </button>
          <WalletConnect />
        </nav>

        {/* CONTENT */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-4xl w-full space-y-12">
            {/* TITLE */}
            <div className="text-center animate-slide-up">
              <h1 className="text-5xl md:text-6xl font-black border-4 border-black inline-block px-8 py-6 shadow-[12px_12px_0px_#000]">
                PROOF
                <br />
                CERTIFICATE
              </h1>
              <p className="text-lg font-medium mt-4 text-gray-600">
                Permanently recorded on Ethereum Sepolia
              </p>
            </div>

            {/* CERTIFICATE CARD */}
            <div className="border-4 border-black p-10 shadow-[16px_16px_0px_#000] bg-white relative overflow-hidden animate-slide-up animate-pulse-glow">
              {/* VERIFIED BADGE */}
              <div className="absolute top-6 right-6 animate-stamp">
                <div className="border-4 border-green-500 px-4 py-2 bg-green-50 transform rotate-3">
                  <span className="text-green-600 font-black text-sm">✅ VERIFIED</span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-black mb-2">MEMENTO VERIFIED RECORD</h2>
                  <div className="inline-flex items-center gap-2 border-2 border-gray-300 px-3 py-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Ethereum Sepolia</span>
                  </div>
                </div>

                {/* FILE HASH */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-lg">FILE HASH</label>
                    <button
                      onClick={() => copyToClipboard(`0x${hash}`)}
                      className="text-sm font-medium border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
                    >
                      {copied ? '✓ COPIED' : 'COPY'}
                    </button>
                  </div>
                  <div className="border-2 border-gray-300 p-4 bg-gray-50 font-mono text-sm break-all">
                    0x{hash}
                  </div>
                </div>

                {/* CREATOR WALLET */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-lg">CREATOR WALLET</label>
                    <a
                      href={getEtherscanUrl('address', creator)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
                    >
                      VIEW ON ETHERSCAN
                    </a>
                  </div>
                  <div className="border-2 border-gray-300 p-4 bg-gray-50 font-mono text-sm break-all">
                    {creator}
                  </div>
                </div>

                {/* TIMESTAMP */}
                <div className="space-y-2">
                  <label className="font-black text-lg">BLOCKCHAIN TIMESTAMP</label>
                  <div className="border-2 border-gray-300 p-4 bg-gray-50">
                    <div className="font-mono text-sm">{formatTimestamp(timestamp)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Block time: {timestamp.toString()}
                    </div>
                  </div>
                </div>

                {/* METADATA HASH */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-lg">METADATA HASH</label>
                    <button
                      onClick={() => copyToClipboard(metadataHash)}
                      className="text-sm font-medium border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
                    >
                      COPY
                    </button>
                  </div>
                  <div className="border-2 border-gray-300 p-4 bg-gray-50 font-mono text-sm break-all">
                    {metadataHash}
                  </div>
                </div>

                {/* VERIFICATION STATUS */}
                <div className="border-4 border-green-500 p-6 bg-green-50 text-center">
                  <div className="text-2xl font-black text-green-600 mb-2">
                    ✅ CRYPTOGRAPHICALLY VERIFIED
                  </div>
                  <p className="text-green-700">
                    This proof is permanently recorded on the Ethereum Sepolia blockchain and cannot be altered.
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-6 justify-center animate-slide-up">
              <button
                onClick={shareCertificate}
                className="border-4 border-black px-8 py-4 font-bold shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition hover-lift"
              >
                📋 SHARE CERTIFICATE
              </button>
              <button
                onClick={() => router.push('/create')}
                className="border-4 border-black px-8 py-4 font-bold shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition hover-lift"
              >
                CREATE NEW PROOF
              </button>
            </div>

            <div className="text-center space-y-4">
              <p>Share this link to verify authenticity</p>
              <p className="font-mono mt-2">{typeof window !== 'undefined' ? window.location.href : ''}</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t-4 border-black px-6 py-6 text-center font-medium">
          Immutable Proof • Public Verification • Memento
        </footer>
      </main>
    </>
  );
}
