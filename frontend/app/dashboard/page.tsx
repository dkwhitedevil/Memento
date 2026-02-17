'use client';

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { WalletConnect } from "../components/WalletConnect";
import Link from "next/link";

interface MockProof {
  id: string;
  title: string;
  description?: string;
  tags?: string;
  filename: string;
  filesize: string;
  date: string;
  fileHash: string;
  txHash: string;
  createdAt: string;
  creator?: string; // Add creator property
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [proofs, setProofs] = useState<MockProof[]>([]);

  useEffect(() => {
    // Real proof data from blockchain
    const realProofs: MockProof[] = [
      {
        id: "1",
        title: "LLM BASED Extraction of feature models",
        description: "A deep study on on models which is used for the LLM",
        tags: "AI, Research, Prototype, Model, Extraction",
        filename: "Conf Paper Documentation.pdf",
        filesize: "285030", // 285.03 KB in bytes
        date: "2026-02-17",
        fileHash: "0x9a7d98e34128a1d56897ae63c60df817d1944bf6c2e3a0e98a38dc9c8d118804",
        txHash: "0x2b3dc9059b37c98ded54e49db40573c7adbb5703a46517cbcd383525b297db68", // From block time
        createdAt: "2026-02-17T08:19:48Z",
        creator: "0x25eFD085E3f1c293D3eAA994769795aaf53d614e" // Add creator address
      }
    ];

    setProofs(realProofs);
  }, []);

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-4xl font-black mb-4">CONNECT WALLET</h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect your wallet to view your Memento proofs
            </p>
            <WalletConnect />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">YOUR PROOFS</h1>
              <p className="text-gray-600">
                {address && `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`}
              </p>
            </div>
            <Link 
              href="/create"
              className="border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors"
            >
              CREATE NEW PROOF
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {proofs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-black mb-4">NO PROOFS YET</h2>
            <p className="text-gray-600 mb-8">
              You haven't created any blockchain proofs yet
            </p>
            <Link 
              href="/create"
              className="inline-block border-2 border-black px-6 py-3 font-bold hover:bg-black hover:text-white transition-colors"
            >
              CREATE YOUR FIRST PROOF
            </Link>
          </div>
        )}

        {proofs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">
                {proofs.length} Proof{proofs.length !== 1 ? 's' : ''} Created
              </h2>
            </div>

            {proofs.map((proof) => (
              <div 
                key={proof.id} 
                className="border-4 border-black bg-white shadow-[8px_8px_0px_#000]"
              >
                <div className="p-8">
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-black mb-2">
                        {proof.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created: {formatDate(proof.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">VERIFIED</span>
                    </div>
                  </div>

                  {/* METADATA */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="font-bold text-sm">FILE NAME</label>
                      <div className="font-mono text-sm">{proof.filename}</div>
                    </div>
                    <div>
                      <label className="font-bold text-sm">FILE SIZE</label>
                      <div className="font-mono text-sm">{formatFileSize(proof.filesize)}</div>
                    </div>
                    <div>
                      <label className="font-bold text-sm">CREATION DATE</label>
                      <div className="font-mono text-sm">{proof.date}</div>
                    </div>
                    {proof.tags && (
                      <div>
                        <label className="font-bold text-sm">TAGS</label>
                        <div className="font-mono text-sm">{proof.tags}</div>
                      </div>
                    )}
                    {proof.creator && (
                      <div>
                        <label className="font-bold text-sm">CREATOR</label>
                        <div className="font-mono text-sm">{proof.creator}</div>
                      </div>
                    )}
                  </div>

                  {proof.description && (
                    <div className="mb-6">
                      <label className="font-bold text-sm">DESCRIPTION</label>
                      <div className="font-mono text-sm mt-1">{proof.description}</div>
                    </div>
                  )}

                  {/* HASHES */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="font-bold text-sm">FILE HASH</label>
                      <div className="font-mono text-xs break-all border-2 border-gray-300 p-3 bg-gray-50">
                        {proof.fileHash}
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-sm">TRANSACTION HASH</label>
                      <div className="font-mono text-xs break-all border-2 border-gray-300 p-3 bg-gray-50">
                        {proof.txHash}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${proof.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-black px-4 py-2 font-bold text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      VIEW ON ETHERSCAN
                    </a>
                    <Link
                      href={`/proof/${proof.fileHash.replace('0x', '')}`}
                      className="border-2 border-black px-4 py-2 font-bold text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      VIEW CERTIFICATE
                    </Link>
                    <button
                      onClick={() => navigator.clipboard.writeText(proof.txHash)}
                      className="border-2 border-black px-4 py-2 font-bold text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      COPY TX HASH
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
