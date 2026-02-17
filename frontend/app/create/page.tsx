'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletConnect } from '../components/WalletConnect';

export default function CreatePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();

  const creationTypes = [
    {
      id: 'document',
      title: 'DOCUMENT',
      description: 'PDF, Word, text files, contracts',
      icon: '📄',
      color: 'border-black'
    },
    {
      id: 'code',
      title: 'CODE',
      description: 'Source code, scripts, algorithms',
      icon: '💻',
      color: 'border-black'
    },
    {
      id: 'design',
      title: 'DESIGN',
      description: 'Images, logos, mockups, graphics',
      icon: '🎨',
      color: 'border-black'
    },
    {
      id: 'music',
      title: 'MUSIC',
      description: 'Audio files, compositions, beats',
      icon: '🎵',
      color: 'border-black'
    },
    {
      id: 'video',
      title: 'VIDEO',
      description: 'Films, animations, tutorials',
      icon: '🎬',
      color: 'border-black'
    },
    {
      id: 'other',
      title: 'OTHER',
      description: 'Any other type of creation',
      icon: '📦',
      color: 'border-black'
    }
  ];

  const handleContinue = () => {
    if (selectedType) {
      // Navigate to step 2 (creation details)
      router.push(`/create/details?type=${selectedType}`);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <style jsx>{`
        @keyframes slide-left {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-right {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 40px rgba(0, 0, 0, 0.2); }
        }
        .gradient-text {
          background: linear-gradient(45deg, #000, #666);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .animate-slide-left {
          animation: slide-left 0.8s ease-out forwards;
        }
        .animate-slide-right {
          animation: slide-right 0.8s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <main className="min-h-screen bg-white text-black font-sans">
        {/* NAVBAR */}
        <nav className="border-b-4 border-black px-6 py-4 flex items-center justify-between relative z-10">
          <button 
            onClick={handleBack}
            className="text-2xl font-black tracking-widest gradient-text hover-lift"
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
                <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <span className="font-bold">SELECT TYPE</span>
              </div>
              <div className="flex-1 h-1 border-t-2 border-dashed border-black"></div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <span className="font-medium">DETAILS</span>
              </div>
              <div className="flex-1 h-1 border-t-2 border-dashed border-black"></div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <span className="font-medium">UPLOAD</span>
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

        {/* MAIN CONTENT */}
        <div className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            {/* TITLE */}
            <div className="text-center mb-16 animate-slide-left">
              <h1 className="text-6xl font-black mb-4 leading-tight">
                WHAT ARE YOU
                <br />
                <span className="gradient-text">PROVING?</span>
              </h1>
              <p className="text-xl font-medium text-gray-600 max-w-2xl mx-auto">
                Select the type of creation you want to establish cryptographic proof for
              </p>
            </div>

            {/* CREATION TYPE GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {creationTypes.map((type, index) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`
                    border-4 ${type.color} p-8 cursor-pointer transition-all duration-200 hover-lift relative overflow-hidden
                    ${selectedType === type.id 
                      ? 'bg-black text-white shadow-[12px_12px_0px_#000]' 
                      : 'bg-white shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000]'
                    }
                    animate-bounce-in
                  `}
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  {selectedType === type.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">✓</span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h3 className="text-xl font-black mb-2">{type.title}</h3>
                    <p className={`text-sm ${selectedType === type.id ? 'text-gray-300' : 'text-gray-600'}`}>
                      {type.description}
                    </p>
                  </div>

                  {selectedType === type.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 opacity-10"></div>
                  )}
                </div>
              ))}
            </div>

            {/* ACTION BUTTON */}
            <div className="text-center animate-bounce-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <button
                onClick={handleContinue}
                disabled={!selectedType}
                className={`
                  border-4 px-12 py-4 text-xl font-black transition-all duration-300 relative overflow-hidden group
                  ${selectedType 
                    ? 'border-black bg-black text-white shadow-[12px_12px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none' 
                    : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <span className="relative z-20 transition-colors duration-300 group-hover:text-black">CONTINUE</span>
                {selectedType && (
                  <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                )}
              </button>
              
              {!selectedType && (
                <p className="mt-4 text-sm text-gray-500 font-medium">
                  Select a creation type to continue
                </p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t-4 border-black px-6 py-8 text-center">
          <p className="font-medium text-gray-600">
            Step 1 of 4 • Choose what you're proving ownership of
          </p>
        </footer>
      </main>
    </>
  );
}
