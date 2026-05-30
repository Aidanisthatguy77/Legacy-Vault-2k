import React from 'react';
import { useGlobal } from '../context/GlobalContext';

function Hero() {
  const { content } = useGlobal();
  
  const headline = content?.hero_headline || 'THE VAULT AWAITS';
  const subheadline = content?.hero_subheadline || '2K15 • 2K16 • 2K17 • 2K20 — All in one place.';
  const tagline = content?.hero_tagline || 'Persistent online. No resets. Ever.';

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-vault-black via-gray-900 to-vault-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vault-red/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vault-red/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 py-32">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
          {headline}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-4">
          {subheadline}
        </p>
        <p className="text-lg text-vault-red font-semibold mb-12">
          {tagline}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary text-xl px-8 py-4">
            Explore the Games
          </button>
          <button className="btn-secondary text-xl px-8 py-4">
            See the Vision
          </button>
        </div>

        {/* Era Pills */}
        <div className="flex items-center justify-center gap-4 mt-16">
          <span className="px-4 py-2 rounded-full bg-vault-gray border border-gray-700 text-white font-semibold">2K15</span>
          <span className="px-4 py-2 rounded-full bg-vault-gray border border-gray-700 text-white font-semibold">2K16</span>
          <span className="px-4 py-2 rounded-full bg-vault-gray border border-gray-700 text-white font-semibold">2K17</span>
          <span className="px-4 py-2 rounded-full bg-vault-gray border border-gray-700 text-white font-semibold">2K20</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;