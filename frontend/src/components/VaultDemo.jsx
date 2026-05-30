import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';

function VaultDemo() {
  const { content } = useGlobal();
  const [selectedEra, setSelectedEra] = useState(null);
  
  const vaultHeadline = content?.vault_headline || 'One Vault. Four Eras. Infinite Play.';
  const vaultSubheadline = content?.vault_subheadline || 'The revolutionary concept that changes everything.';

  const eras = [
    { id: '2k15', name: '2K15', year: '2014', color: '#dc2626' },
    { id: '2k16', name: '2K16', year: '2015', color: '#ea580c' },
    { id: '2k17', name: '2K17', year: '2016', color: '#d97706' },
    { id: '2k20', name: '2K20', year: '2019', color: '#059669' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-vault-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-4">{vaultHeadline}</h2>
        <p className="text-gray-400 text-center mb-12">{vaultSubheadline}</p>
        
        {/* Interactive Demo */}
        <div className="relative bg-vault-gray rounded-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Legacy Vault</h3>
            <p className="text-gray-500">Select an era to enter</p>
          </div>
          
          {/* Era Tiles */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {eras.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era)}
                className={`relative aspect-square rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${
                  selectedEra?.id === era.id 
                    ? 'border-white scale-105' 
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                style={{ backgroundColor: `${era.color}20` }}
              >
                <span className="text-3xl font-bold text-white mb-1">{era.name}</span>
                <span className="text-sm text-gray-400">{era.year}</span>
              </button>
            ))}
          </div>
          
          {/* Demo Message */}
          <div className="text-center p-8 bg-black/50 rounded-xl">
            {selectedEra ? (
              <div>
                <p className="text-white text-xl mb-2">Entering {selectedEra.name}...</p>
                <p className="text-gray-500">Loading classic basketball experience</p>
              </div>
            ) : (
              <p className="text-gray-500">Click any era to see the experience</p>
            )}
          </div>
          
          <p className="text-center text-gray-600 text-sm mt-6">
            This is a concept demo showing what the Legacy Vault menu could look like inside NBA 2K
          </p>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="card text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-vault-red/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-vault-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Eternal Online</h4>
            <p className="text-gray-400 text-sm">Every classic game stays online forever</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-vault-red/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-vault-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Unified Friends</h4>
            <p className="text-gray-400 text-sm">Friends list works across every era</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-vault-red/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-vault-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Cheat-Proof</h4>
            <p className="text-gray-400 text-sm">Isolated containers ensure fair play</p>
          </div>
        </div>
        
        {/* Concept Link */}
        <div className="text-center mt-12">
          <a 
            href={content?.google_doc_link || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-vault-red hover:text-vault-red-dark transition-colors"
          >
            <span>Read the Full Concept Document</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default VaultDemo;