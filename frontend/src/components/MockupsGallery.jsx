import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';

function MockupsGallery() {
  const { mockups } = useGlobal();
  const [selectedMockup, setSelectedMockup] = useState(null);

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Mockups Gallery</h2>
        <p className="text-gray-400 text-center mb-12">Concept art and visualizations of the proposed Legacy Vault.</p>
        
        {mockups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockups.map((mockup) => (
              <div 
                key={mockup.id} 
                className="card cursor-pointer group"
                onClick={() => setSelectedMockup(mockup)}
              >
                <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden relative">
                  {mockup.is_video && mockup.video_url ? (
                    <video 
                      src={mockup.video_url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : mockup.image_url ? (
                    <img 
                      src={mockup.image_url} 
                      alt={mockup.title || 'Mockup'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No preview
                    </div>
                  )}
                  {mockup.is_video && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{mockup.title || 'Concept Art'}</h3>
                <span className="text-gray-500 text-sm uppercase">{mockup.is_video ? 'Video' : 'Image'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No mockups available yet.</p>
        )}
        
        {/* Lightbox Modal */}
        {selectedMockup && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
            onClick={() => setSelectedMockup(null)}
          >
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              {selectedMockup.is_video && selectedMockup.video_url ? (
                <video 
                  src={selectedMockup.video_url}
                  className="w-full rounded-lg"
                  controls
                  autoPlay
                />
              ) : selectedMockup.image_url ? (
                <img 
                  src={selectedMockup.image_url} 
                  alt={selectedMockup.title} 
                  className="w-full rounded-lg"
                />
              ) : null}
              <button 
                className="mt-4 px-6 py-2 bg-vault-red text-white rounded-lg mx-auto block"
                onClick={() => setSelectedMockup(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default MockupsGallery;