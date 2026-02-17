'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAccount, useSignTypedData, useSignMessage } from 'wagmi';
import { WalletConnect } from '../../components/WalletConnect';
import { mementoContract } from '../../../src/services/contractService';

export default function CreateProofPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [proofCreated, setProofCreated] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  
  // Get form data from URL
  const type = searchParams.get('type') || 'document';
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';
  const tags = searchParams.get('tags') || '';
  const date = searchParams.get('date') || '';
  const hash = searchParams.get('hash') || '';
  const filename = searchParams.get('filename') || '';
  const filesize = searchParams.get('filesize') || '';

  const { address, isConnected } = useAccount();

  const handleBack = () => {
    router.push('/create/upload');
  };

  const { signTypedDataAsync } = useSignTypedData();
  const { signMessageAsync } = useSignMessage();

  const handleSign = async () => {
    try {
      const message = `I created a file with hash ${hash} using Memento at ${new Date().toISOString()}`;
      const sig = await signMessageAsync({ message });
      setSignature(sig);
      setError("");
    } catch (err: any) {
      setError("Signature failed: " + err.message);
    }
  };

  const handleCreateProof = async () => {
    if (!signature) {
      setError("Please sign authorship first");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const metadata = { title, description, tags, date, filename, filesize };
      const metadataString = JSON.stringify(metadata);

      const metadataHashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(metadataString)
      );

      const metadataHashHex =
        "0x" +
        Array.from(new Uint8Array(metadataHashBuffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

      // Ensure file hash has proper 0x prefix and is exactly 32 bytes
      let fileHashBytes32 = hash.startsWith("0x") ? hash : `0x${hash}`;
      
      // Pad or truncate to exactly 32 bytes (64 hex chars + 0x)
      if (fileHashBytes32.length < 66) {
        fileHashBytes32 = fileHashBytes32.padEnd(66, '0');
      } else if (fileHashBytes32.length > 66) {
        fileHashBytes32 = fileHashBytes32.slice(0, 66);
      }

      console.log("FILE HASH:", fileHashBytes32);
      console.log("METADATA HASH:", metadataHashHex);
      console.log("FILE HASH LENGTH:", fileHashBytes32.length);
      console.log("METADATA HASH LENGTH:", metadataHashHex.length);

      const result = await mementoContract.createProof(fileHashBytes32, metadataHashHex);

      if (!result.success) throw new Error("Transaction failed");

      setTxHash(result.transactionHash);
      setProofCreated(true);

      // Immediately redirect to Etherscan transaction page
      window.open(`https://sepolia.etherscan.io/tx/${result.transactionHash}`, "_blank");
      
      // Redirect to certificate after 10 seconds (give time for transaction to be mined)
      setTimeout(() => router.push(`/proof/${hash}`), 10000);
    } catch (err: any) {
      setError(err.message || "Failed to create proof");
    } finally {
      setIsCreating(false);
    }
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
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
            onClick={handleBack}
            className="text-2xl font-black tracking-widest hover-lift"
          >
            ← MEMENTO
          </button>
          <WalletConnect />
        </nav>
        {/* STEP INDICATOR */}
        <div className="px-6 py-8 border-b-4 border-black">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-black bg-gray-100 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <span className="font-medium text-gray-600">TYPE SELECTED</span>
              </div>
              <div className="flex-1 h-1 border-t-2 border-black"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-black bg-gray-100 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <span className="font-medium text-gray-600">DETAILS</span>
              </div>
              <div className="flex-1 h-1 border-t-2 border-black"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-black bg-gray-100 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <span className="font-medium text-gray-600">UPLOAD</span>
              </div>
              <div className="flex-1 h-1 border-t-2 border-black"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <span className="font-bold">PROOF</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-4xl w-full space-y-12">
            {/* TITLE */}
            <div className="text-center mb-12 animate-slide-up">
              <h1 className="text-5xl md:text-6xl font-black border-4 border-black inline-block px-8 py-6 shadow-[12px_12px_0px_#000]">
                CREATE BLOCKCHAIN
                <br />
                <span className="text-gray-600">PROOF</span>
              </h1>
              <p className="text-lg font-medium max-w-2xl mx-auto">
                Sign a cryptographic message to permanently record your creation on the Ethereum blockchain
              </p>
            </div>

            {/* WALLET STATUS */}
            {!isConnected && (
              <div className="border-4 border-red-600 p-6 bg-red-50 text-center animate-slide-up">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-black mb-2">WALLET NOT CONNECTED</h2>
                <p className="text-red-600 mb-4">
                  Please connect your wallet to create a blockchain proof
                </p>
                <button
                  onClick={() => router.push('/create')}
                  className="border-4 border-red-600 px-8 py-4 font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                >
                  BACK TO UPLOAD
                </button>
              </div>
            )}

            {/* PROOF CREATION FORM */}
            {isConnected && (
              <div className="space-y-8 animate-slide-up">
                {/* FILE SUMMARY */}
                <div className="border-4 border-black p-8 bg-gray-50 shadow-[8px_8px_0px_#000]">
                  <h3 className="text-xl font-black mb-4">FILE SUMMARY</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-bold text-sm">FILE NAME</label>
                      <div className="font-mono text-sm break-all">{filename}</div>
                    </div>
                    <div>
                      <label className="font-bold text-sm">FILE SIZE</label>
                      <div className="font-mono text-sm">{formatFileSize(filesize)}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-sm">FILE HASH</label>
                    <div className="font-mono text-sm break-all border-2 border-gray-300 p-3 bg-white">
                      {hash}
                    </div>
                  </div>
                </div>

                {/* METADATA SUMMARY */}
                <div className="border-4 border-black p-8 bg-gray-50 shadow-[8px_8px_0px_#000]">
                  <h3 className="text-xl font-black mb-4">METADATA</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-sm">TITLE</label>
                      <div className="font-mono text-sm">{title}</div>
                    </div>
                    {description && (
                      <div>
                        <label className="font-bold text-sm">DESCRIPTION</label>
                        <div className="font-mono text-sm">{description}</div>
                      </div>
                    )}
                    {tags && (
                      <div>
                        <label className="font-bold text-sm">TAGS</label>
                        <div className="font-mono text-sm">{tags}</div>
                      </div>
                    )}
                    {date && (
                      <div>
                        <label className="font-bold text-sm">CREATION DATE</label>
                        <div className="font-mono text-sm">{date}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="border-4 border-black p-8 bg-gray-50 shadow-[8px_8px_0px_#000]">
                  <h3 className="text-xl font-black mb-6">CREATE BLOCKCHAIN PROOF</h3>
                  <div className="space-y-4">
                    {/* Step 1: Sign Authorship */}
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-sm ${signature ? 'bg-black text-white' : 'bg-gray-100'}`}>
                        {signature ? '✓' : '1'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm mb-1">1️⃣ Sign Authorship</div>
                        <div className="text-xs text-gray-600">
                          {signature ? `Signed: ${signature.slice(0, 10)}...` : 'Click to sign your authorship message'}
                        </div>
                      </div>
                      <button
                        onClick={handleSign}
                        disabled={!!signature}
                        className="border-2 border-black px-6 py-3 font-bold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                      >
                        {signature ? 'SIGNED' : 'SIGN MESSAGE'}
                      </button>
                    </div>

                    {/* Step 2: Create Blockchain Proof */}
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-sm ${proofCreated ? 'bg-black text-white' : 'bg-gray-100'}`}>
                        {proofCreated ? '✓' : '2'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm mb-1">2️⃣ Create Blockchain Proof</div>
                        <div className="text-xs text-gray-600">
                          {!signature ? 'Complete step 1 first' : 'Record your proof on Sepolia network'}
                        </div>
                      </div>
                      <button
                        onClick={handleCreateProof}
                        disabled={!signature || isCreating}
                        className="border-2 border-black px-6 py-3 font-bold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
                      >
                        {isCreating ? 'CREATING...' : 'CREATE PROOF'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ERROR DISPLAY */}
                {error && (
                  <div className="border-4 border-red-600 p-6 bg-red-50 text-center animate-slide-up">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-black mb-2">ERROR</h2>
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                {/* LOADING STATE */}
                {isCreating && (
                  <div className="border-4 border-black p-12 text-center animate-pulse-glow">
                    <div className="text-6xl mb-4">⚙️</div>
                    <h2 className="text-2xl font-black mb-2">CREATING PROOF</h2>
                    <p className="text-gray-600">
                      Signing message and recording on blockchain...
                    </p>
                  </div>
                )}

                {/* SUCCESS STATE */}
                {proofCreated && (
                  <div className="border-4 border-green-500 p-12 text-center animate-slide-up">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-black mb-2">TRANSACTION SUBMITTED</h2>
                    <p className="text-green-700 mb-4">
                      Your proof is being recorded on the Ethereum blockchain
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Transaction is being mined... Redirecting to your certificate in 10 seconds
                    </p>
                    {txHash && (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                          Transaction Hash:
                        </div>
                        <div className="font-mono text-sm break-all border-2 border-gray-300 p-3 bg-white">
                          {txHash}
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(txHash)}
                          className="text-sm font-medium border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
                        >
                          COPY
                        </button>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
                        >
                          VIEW ON ETHERSCAN
                        </a>
                        <div className="text-center mt-6">
                          <p className="text-sm text-gray-600">
                            Redirecting to your certificate...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t-4 border-black px-6 py-6 text-center font-medium">
          Immutable Records • Cryptographic Proof • Memento
        </footer>
      </main>
    </>
  );
}
