'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WalletConnect } from '../../components/WalletConnect';

export default function UploadStep() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get form data from URL params
  const type = searchParams.get('type') || 'document';
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';
  const tags = searchParams.get('tags') || '';
  const date = searchParams.get('date') || '';

  const handleFileSelect = async (selectedFile: File) => {
    setError('');
    setFile(selectedFile);
    setIsHashing(true);
    setHash('');

    try {
      // Create SHA-256 hash using Web Crypto API
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setHash(hashHex);
    } catch (err) {
      setError('Failed to hash file. Please try again.');
      console.error('Hashing error:', err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleContinue = () => {
    if (hash && title) {
      router.push(`/create/proof?type=${type}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&tags=${encodeURIComponent(tags)}&date=${date}&hash=${hash}&filename=${encodeURIComponent(file?.name || '')}&filesize=${file?.size || 0}`);
    }
  };

  const handleBack = () => {
    router.push(`/create/details?type=${type}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeInfo = () => {
    const types: Record<string, { title: string; icon: string }> = {
      document: { title: 'DOCUMENT', icon: '📄' },
      code: { title: 'CODE', icon: '💻' },
      design: { title: 'DESIGN', icon: '🎨' },
      music: { title: 'MUSIC', icon: '🎵' },
      video: { title: 'VIDEO', icon: '🎬' },
      other: { title: 'OTHER', icon: '📦' }
    };
    return types[type] || types.document;
  };

  const typeInfo = getTypeInfo();

  return (
    <>
      <style jsx>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .drag-active {
          border-color: #000 !important;
          background-color: #f8f8f8 !important;
        }
      `}</style>

      <main className="min-h-screen bg-white text-black flex flex-col">
        {/* HEADER */}
        <header className="border-b-4 border-black px-6 py-5 flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="text-2xl font-black tracking-widest hover-lift"
          >
            ← MEMENTO
          </button>
          <WalletConnect />
        </header>

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
                <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <span className="font-bold">UPLOAD</span>
              </div>
              <div className="flex-1 h-1 border-t-2 border-dashed border-black"></div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <span className="font-medium">PROOF</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-4xl w-full space-y-12">
            {/* TITLE */}
            <div className="space-y-6 text-center">
              <h2 className="text-5xl md:text-6xl font-black border-4 border-black inline-block px-8 py-6 shadow-[10px_10px_0px_#000]">
                UPLOAD YOUR
                <br />
                <span className="text-gray-600">{typeInfo.title}</span>
              </h2>

              <p className="text-lg font-medium max-w-2xl mx-auto">
                Your file will be hashed locally using SHA-256. 
                Only the cryptographic fingerprint is stored - your file never leaves your device.
              </p>
            </div>

            {/* UPLOAD AREA */}
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-4 border-dashed border-gray-400 px-12 py-16 text-center cursor-pointer
                  transition-all duration-300 hover-lift relative overflow-hidden
                  ${file ? 'border-black bg-gray-50' : 'hover:border-black hover:bg-gray-50'}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="*/*" // Accept all file types
                />

                {!file && !isHashing && (
                  <div className="space-y-4">
                    <div className="text-6xl">📁</div>
                    <div>
                      <p className="text-2xl font-black mb-2">
                        DROP YOUR FILE HERE
                      </p>
                      <p className="text-lg font-medium text-gray-600">
                        or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mt-4">
                        Supports any file type • Max 100MB
                      </p>
                    </div>
                  </div>
                )}

                {isHashing && (
                  <div className="space-y-4">
                    <div className="text-6xl animate-spin">⚙️</div>
                    <div>
                      <p className="text-2xl font-black mb-2">
                        HASHING FILE...
                      </p>
                      <p className="text-lg font-medium text-gray-600">
                        Creating cryptographic fingerprint
                      </p>
                    </div>
                  </div>
                )}

                {file && !isHashing && (
                  <div className="space-y-4">
                    <div className="text-6xl">✅</div>
                    <div>
                      <p className="text-2xl font-black mb-2">
                        FILE HASHED
                      </p>
                      <p className="text-lg font-medium text-gray-600">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">⚠️</div>
                      <p className="text-xl font-black text-red-600 mb-2">
                        UPLOAD ERROR
                      </p>
                      <p className="text-red-600">{error}</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 border-4 border-red-600 px-6 py-2 font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        TRY AGAIN
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* HASH DISPLAY */}
              {hash && (
                <div className="border-4 border-black px-6 py-4 bg-gray-50 shadow-[6px_6px_0px_#000]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">SHA-256 HASH</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(hash)}
                      className="text-sm font-medium border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
                    >
                      COPY
                    </button>
                  </div>
                  <div className="font-mono text-sm break-all">
                    {hash}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    This fingerprint uniquely identifies your file
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between pt-10 gap-4">
              <button 
                onClick={handleBack}
                className="border-4 border-black px-8 py-4 font-bold shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition hover-lift"
              >
                ← BACK
              </button>

              <button
                onClick={handleContinue}
                disabled={!hash}
                className={`
                  border-4 border-black px-10 py-4 text-lg font-black transition-all hover-lift
                  ${hash
                    ? "bg-black text-white shadow-[10px_10px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    : "bg-white text-black opacity-40 cursor-not-allowed"
                  }
                `}
              >
                CREATE PROOF
              </button>
            </div>

            {!hash && file && !isHashing && (
              <div className="text-center text-sm text-gray-600">
                File hashing complete • Ready to create proof
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t-4 border-black px-6 py-6 text-center font-medium">
          Privacy-first • Your file never leaves your device — Memento
        </footer>
      </main>
    </>
  );
}
