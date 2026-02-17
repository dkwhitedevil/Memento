'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WalletConnect } from '../../components/WalletConnect';

const creationTypes = [
  { icon: "📄", title: "Research / Document" },
  { icon: "🎨", title: "Design / Image" },
  { icon: "💻", title: "Code / Project" },
  { icon: "🎵", title: "Audio / Music" },
  { icon: "🎬", title: "Video" },
  { icon: "📦", title: "Other File" },
];

export default function CreationDetailsStep() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const creationType = searchParams.get('type') || 'document';

  const isValid = title.trim().length > 0;

  const handleBack = () => {
    router.push('/create');
  };

  const handleContinue = () => {
    if (isValid) {
      router.push(`/create/upload?type=${creationType}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&tags=${encodeURIComponent(tags)}&date=${date}`);
    }
  };

  return (
    <>
      <style jsx>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
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
                <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <span className="font-bold">DETAILS</span>
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

        {/* CONTENT */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-3xl w-full space-y-12">
            {/* TITLE */}
            <div className="space-y-6 text-center">
              <h2 className="text-5xl md:text-6xl font-black border-4 border-black inline-block px-8 py-6 shadow-[10px_10px_0px_#000]">
                TELL US ABOUT
                <br />
                YOUR CREATION
              </h2>

              <p className="text-lg font-medium">
                Add essential details to generate a stronger and verifiable
                provenance record for your work.
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-8">
              {/* TITLE INPUT */}
              <div className="space-y-2">
                <label className="font-bold">TITLE *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quantum Optimization Draft"
                  className="w-full border-4 border-black px-4 py-3 font-medium focus:outline-none shadow-[6px_6px_0px_#000] hover-lift"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="font-bold">DESCRIPTION</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Optional context about this creation..."
                  className="w-full border-4 border-black px-4 py-3 font-medium focus:outline-none shadow-[6px_6px_0px_#000] hover-lift"
                />
              </div>

              {/* TAGS */}
              <div className="space-y-2">
                <label className="font-bold">TAGS / KEYWORDS</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="AI, Research, Prototype"
                  className="w-full border-4 border-black px-4 py-3 font-medium focus:outline-none shadow-[6px_6px_0px_#000] hover-lift"
                />
              </div>

              {/* DATE */}
              <div className="space-y-2">
                <label className="font-bold">CREATION DATE</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-4 border-black px-4 py-3 font-medium focus:outline-none shadow-[6px_6px_0px_#000] hover-lift"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between pt-10 gap-4">
              <button 
                onClick={handleBack}
                className="border-4 border-black px-8 py-4 font-bold shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition hover-lift"
              >
                BACK
              </button>

              <button
                onClick={handleContinue}
                disabled={!isValid}
                className={`border-4 border-black px-10 py-4 text-lg font-black transition-all hover-lift
                  ${
                    isValid
                      ? "bg-black text-white shadow-[10px_10px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      : "bg-white text-black opacity-40 cursor-not-allowed"
                  }`}
              >
                CONTINUE
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t-4 border-black px-6 py-6 text-center font-medium">
          Proof of Human Creation — Memento
        </footer>
      </main>
    </>
  );
}
