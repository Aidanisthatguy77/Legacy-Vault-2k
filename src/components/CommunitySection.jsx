import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import api from '../api';

function CommunitySection() {
  const { communityPosts, socialFeed, petition } = useGlobal();
  const [activeTab, setActiveTab] = useState('wall');
  
  return (
    <section className="py-20 bg-vault-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Community</h2>
        <p className="text-gray-400 text-center mb-12">Join the conversation. Help make this vision a reality.</p>
        
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('wall')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'wall' 
                ? 'bg-vault-red text-white' 
                : 'bg-vault-gray text-gray-400 hover:text-white'
            }`}
          >
            Community Wall
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'feed' 
                ? 'bg-vault-red text-white' 
                : 'bg-vault-gray text-gray-400 hover:text-white'
            }`}
          >
            Live Feed
          </button>
        </div>
        
        {/* Content */}
        {activeTab === 'wall' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityPosts.length > 0 ? (
              communityPosts.map((post) => (
                <div key={post.id} className="card">
                  <div className="flex items-center gap-3 mb-4">
                    {post.avatar_url ? (
                      <img src={post.avatar_url} alt={post.author} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-vault-red flex items-center justify-center text-white font-bold">
                        {post.author?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">{post.author}</p>
                      <p className="text-gray-500 text-sm">{post.platform}</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{post.content}</p>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">No community posts yet.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {socialFeed.length > 0 ? (
              socialFeed.map((item) => (
                <div key={item.id} className="card flex items-start gap-4">
                  <span className="text-2xl">
                    {item.platform === 'Twitter' && '🐦'}
                    {item.platform === 'Reddit' && '🤖'}
                    {item.platform === 'TikTok' && '🎵'}
                  </span>
                  <div className="flex-1">
                    <p className="text-white">{item.content}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {item.author && `${item.author} • `}{item.timestamp}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No live feed items yet.</p>
            )}
          </div>
        )}
        
        {/* Stats */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-vault-gray rounded-xl px-8 py-6 border border-gray-800">
            <p className="text-4xl font-bold text-vault-red">{petition.count}+</p>
            <p className="text-gray-400">fans want the Legacy Vault</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommunitySection;