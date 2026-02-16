'use client';

import { useState, useEffect } from 'react';

export default function MementoLanding() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate deterministic sparkle positions
  const sparkles = [...Array(20)].map((_, i) => ({
    id: i,
    left: `${(i * 137.5) % 100}%`,
    top: `${(i * 89.7) % 100}%`,
    animationDelay: `${(i * 0.137) % 2}s`,
    animationDuration: `${2 + (i * 0.123) % 2}s`
  }));

  // Generate deterministic background particles for process section
  const backgroundParticles = [...Array(30)].map((_, i) => ({
    id: i,
    left: `${(i * 47.3) % 100}%`,
    top: `${(i * 73.1) % 100}%`,
    animationDelay: `${(i * 0.173) % 3}s`
  }));

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(2deg); }
          75% { transform: translateY(10px) rotate(-2deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.1); }
          50% { box-shadow: 0 0 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,0,0,0.2); }
        }
        
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes blink {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: black; }
        }
        
        @keyframes slide-in-left {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-typewriter { overflow: hidden; white-space: nowrap; animation: typewriter 3s steps(40) 1s 1 normal both; }
        .animate-blink { border-right: 3px solid black; animation: blink 1s infinite; }
        .animate-slide-left { animation: slide-in-left 0.8s ease-out forwards; }
        .animate-slide-right { animation: slide-in-right 0.8s ease-out forwards; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out forwards; }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) rotate(-1deg);
          box-shadow: 12px 12px 0px #000, 0 0 30px rgba(0,0,0,0.2);
        }
        
        .magnetic {
          transition: transform 0.2s ease-out;
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #000, #666, #000);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .rotating-border {
          position: relative;
          overflow: hidden;
        }
        
        .rotating-border::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #000, #fff, #000);
          background-size: 400% 400%;
          animation: rotate-gradient 3s ease infinite;
          z-index: -1;
        }
        
        @keyframes rotate-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: black;
          border-radius: 50%;
          animation: sparkle 2s linear infinite;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      <main className="min-h-screen bg-white text-black font-sans overflow-hidden relative">
        {/* Animated Background Elements */}
        {isClient && (
          <div className="absolute inset-0 pointer-events-none">
            {sparkles.map((sparkle) => (
              <div
                key={sparkle.id}
                className="sparkle"
                style={{
                  left: sparkle.left,
                  top: sparkle.top,
                  animationDelay: sparkle.animationDelay,
                  animationDuration: sparkle.animationDuration
                }}
              />
            ))}
          </div>
        )}
        
        {/* NAVBAR */}
        <nav className={`border-b-4 border-black px-6 py-4 flex items-center justify-between relative z-10 ${
          isLoaded ? 'animate-slide-left' : 'opacity-0'
        }`}>
          <h1 className="text-2xl font-black tracking-widest gradient-text">MEMENTO</h1>
          <button className="border-4 border-black px-5 py-2 font-bold shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 hover-lift magnetic">
            Launch App
          </button>
        </nav>

        {/* HERO */}
        <section className="px-6 py-24 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className={`space-y-8 ${isLoaded ? 'animate-slide-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <h2 className="text-6xl lg:text-7xl font-black leading-none border-4 border-black p-6 shadow-[10px_10px_0px_#000] rotating-border hover-lift">
              <span className="animate-typewriter">PROVE</span>
              <br />
              <span style={{ animationDelay: '1s' }} className="animate-typewriter inline-block">YOU MADE IT</span>
              <br />
              <span style={{ animationDelay: '2s' }} className="animate-typewriter inline-block">FIRST.</span>
             
            </h2>

            <p className="text-xl max-w-xl font-medium opacity-0 animate-slide-left" style={{ animationDelay: '3s', animationFillMode: 'forwards' }}>
              Memento creates cryptographic proof of human authorship. Upload any
              file, seal it with an immutable blockchain timestamp, and verify
              originality forever.
            </p>

            <div className="flex gap-4 flex-wrap opacity-0 animate-bounce-in" style={{ animationDelay: '3.5s', animationFillMode: 'forwards' }}>
              <button className="border-4 border-black px-8 py-4 text-lg font-bold shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 hover-lift relative overflow-hidden group">
                <span className="relative z-10">Seal My First Proof</span>
                <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Seal My First Proof</span>
              </button>

              <button className="border-4 border-black px-8 py-4 text-lg font-bold bg-black text-white shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 hover-lift animate-pulse-glow">
                View Demo
              </button>
            </div>
          </div>

          {/* DECORATIVE DETAILS */}
          <div className="flex flex-col items-center justify-center space-y-8 opacity-0 animate-slide-right" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            {/* Animated dots pattern */}
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            
            {/* Geometric shapes */}
            <div className="flex gap-6 items-center">
              <div className="w-12 h-12 border-2 border-black rotate-45 animate-pulse"></div>
              <div className="w-10 h-10 border-2 border-black rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-12 h-12 border-2 border-black animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
            
            {/* Text decoration */}
            <div className="text-center space-y-3">
              <p className="text-lg font-bold tracking-widest text-gray-600">PROOF OF CREATION</p>
              <div className="flex justify-center gap-3">
                <div className="w-16 h-0.5 bg-black"></div>
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <div className="w-16 h-0.5 bg-black"></div>
              </div>
            </div>
            
            {/* Additional animated elements */}
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-12 bg-gradient-to-b from-black to-transparent animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </section>

      {/* FEATURES */}
        <section className="px-6 py-24 border-t-4 border-black relative">
          <h3 className="text-5xl font-black mb-16 text-center animate-slide-left">WHY MEMENTO</h3>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "IMMUTABLE TIME",
                desc: "Blockchain timestamps prove exactly when your idea existed.",
                icon: "⏰"
              },
              {
                title: "HUMAN AUTHORSHIP",
                desc: "Wallet‑signed identity binds creation to a real person.",
                icon: "👤"
              },
              {
                title: "PUBLIC VERIFICATION",
                desc: "Anyone can verify your proof instantly — no lawyers needed.",
                icon: "🔍"
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`border-4 border-black p-8 shadow-[10px_10px_0px_#000] hover-lift relative overflow-hidden group ${
                  isLoaded ? 'animate-bounce-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${4 + index * 0.2}s`, animationFillMode: 'forwards' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="text-6xl mb-4 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>{feature.icon}</div>
                <h4 className="text-2xl font-black mb-4 relative z-10">{feature.title}</h4>
                <p className="font-medium relative z-10">{feature.desc}</p>
                <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full animate-pulse-glow"></div>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="px-6 py-24 border-t-4 border-black bg-black text-white relative overflow-hidden">
          {isClient && (
            <div className="absolute inset-0 opacity-10">
              {backgroundParticles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse-glow"
                  style={{
                    left: particle.left,
                    top: particle.top,
                    animationDelay: particle.animationDelay
                  }}
                />
              ))}
            </div>
          )}
          
          <h3 className="text-5xl font-black mb-16 text-center relative z-10 animate-slide-right">60‑SECOND PROOF</h3>

          <div className="grid md:grid-cols-3 gap-10 relative z-10">
            {[
              { step: "Upload your file", number: "1", color: "from-red-500 to-orange-500" },
              { step: "Seal blockchain timestamp", number: "2", color: "from-blue-500 to-purple-500" },
              { step: "Share verifiable proof", number: "3", color: "from-green-500 to-teal-500" }
            ].map((item, index) => (
              <div
                key={item.step}
                className={`border-4 border-white p-10 shadow-[10px_10px_0px_#fff] hover-lift relative overflow-hidden group ${
                  isLoaded ? 'animate-slide-left' : 'opacity-0'
                }`}
                style={{ animationDelay: `${5 + index * 0.3}s`, animationFillMode: 'forwards' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="text-6xl font-black mb-4 relative z-10">
                  <span className={`inline-block bg-gradient-to-r ${item.color} bg-clip-text text-transparent animate-pulse-glow`}>
                    {item.number}
                  </span>
                </div>
                <p className="text-xl font-bold relative z-10">{item.step}</p>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 border-2 border-white rounded-full opacity-20 animate-spin"></div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-28 border-t-4 border-black text-center space-y-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-100 to-black opacity-5"></div>
          
          <h3 className={`text-6xl font-black relative z-10 ${
            isLoaded ? 'animate-bounce-in' : 'opacity-0'
          }`} style={{ animationDelay: '6s', animationFillMode: 'forwards' }}>
            <span className="gradient-text">OWN YOUR ORIGIN</span>
          </h3>

          <button className={`border-4 border-black px-12 py-6 text-2xl font-black shadow-[12px_12px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300 hover-lift relative overflow-hidden group ${
            isLoaded ? 'animate-bounce-in' : 'opacity-0'
          }`} style={{ animationDelay: '6.5s', animationFillMode: 'forwards' }}>
            <span className="relative z-10">Start Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">Start Free</span>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-40 blur transition-opacity duration-300"></div>
          </button>
          
          <div className="flex justify-center gap-4 mt-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-black rounded-full animate-bounce-in"
                style={{ animationDelay: `${7 + i * 0.1}s`, animationFillMode: 'forwards' }}
              />
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t-4 border-black px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
          <span className="font-bold relative z-10 animate-slide-left">© {new Date().getFullYear()} Memento</span>
          <span className="font-medium relative z-10 animate-slide-right">Proof of Human Creation</span>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-black/20 rounded-full animate-pulse-glow"></div>
        </footer>
      </main>
    </>
  );
}
