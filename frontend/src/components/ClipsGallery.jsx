import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';

function ClipsGallery() {
  const { clips, games } = useGlobal();
  const [selectedGame, setSelectedGame] = useState('all');

  const filteredClips = selectedGame === 'all' 
    ? clips 
    : clips.filter(c => c.game_id === selectedGame);

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'youtube':
        return (
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case 'twitch':
        return (
          <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    // Convert YouTube watch URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Clips Gallery</h2>
        
        {/* Filter */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedGame('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedGame === 'all' 
                ? 'bg-vault-red text-white' 
                : 'bg-vault-gray text-gray-400 hover:text-white'
            }`}
          >
            All Games
          </button>
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedGame === game.id 
                  ? 'bg-vault-red text-white' 
                  : 'bg-vault-gray text-gray-400 hover:text-white'
              }`}
            >
              {game.title}
            </button>
          ))}
        </div>

        {/* Clips Grid */}
        {filteredClips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredClips.map((clip) => (
              <div key={clip.id} className="card">
                <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden">
                  {clip.embed_url ? (
                    <iframe 
                      src={getEmbedUrl(clip.embed_url)}
                      className="w-full h-full"
                      allowFullScreen
                      title={clip.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No video available
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {getPlatformIcon(clip.platform)}
                  <span className="text-gray-500 text-sm uppercase">{clip.platform}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{clip.title}</h3>
                {clip.description && (
                  <p className="text-gray-400 text-sm">{clip.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No clips available yet.</p>
        )}
      </div>
    </section>
  );
}

export default ClipsGallery;