import React from 'react';
import { useGlobal } from '../context/GlobalContext';

function GameEras() {
  const { games } = useGlobal();

  return (
    <section className="py-20 bg-vault-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-4">The Games</h2>
        <p className="text-gray-400 text-center mb-12">Four legendary eras of NBA 2K basketball. Each one a masterpiece. All preserved forever.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {games.map((game, index) => (
            <div 
              key={game.id} 
              className="group relative bg-vault-gray rounded-xl overflow-hidden border border-gray-800 hover:border-vault-red/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-vault-red/10"
            >
              {/* Cover Image */}
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                {game.cover_image ? (
                  <img src={game.cover_image} alt={game.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl font-bold text-gray-700">{game.year}</div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-vault-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-1">{game.title}</h3>
                <p className="text-gray-500 mb-3">{game.year}</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {game.hook_text || 'Experience the legend.'}
                </p>
              </div>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-vault-red/10 transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GameEras;