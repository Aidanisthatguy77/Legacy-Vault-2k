import React from 'react';
import { useGlobal } from '../context/GlobalContext';

function ProofWall() {
  const { proofs } = useGlobal();

  return (
    <section className="py-20 bg-vault-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Proof Wall</h2>
        <p className="text-gray-400 text-center mb-12">The community has spoken. Here's the evidence.</p>
        
        {proofs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofs.map((proof) => (
              <div key={proof.id} className="card group cursor-pointer">
                <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden">
                  {proof.image_url ? (
                    <img 
                      src={proof.image_url} 
                      alt={proof.description || 'Proof'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No image
                    </div>
                  )}
                </div>
                {proof.description && (
                  <p className="text-gray-300 text-sm mb-2">{proof.description}</p>
                )}
                {proof.source && (
                  <a 
                    href={proof.source} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-vault-red text-sm hover:underline"
                  >
                    View Source →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 mb-4">Help us build the proof wall!</p>
            <p className="text-gray-600 text-sm">Share this campaign on social media to show 2K the demand.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProofWall;