import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import api from '../api';
import Hero from '../components/Hero';
import GameEras from '../components/GameEras';
import VaultDemo from '../components/VaultDemo';
import VotingPoll from '../components/VotingPoll';
import ClipsGallery from '../components/ClipsGallery';
import ProofWall from '../components/ProofWall';
import MockupsGallery from '../components/MockupsGallery';
import CommunitySection from '../components/CommunitySection';
import Petition from '../components/Petition';

function Home() {
  const { loading } = useGlobal();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-vault-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-vault-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-vault-red">2K</span>
            <span className="text-xl font-bold text-white">Legacy Vault</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors">Home</button>
            <button className="text-gray-400 hover:text-white transition-colors">The Games</button>
            <button className="text-gray-400 hover:text-white transition-colors">The Vault</button>
            <button className="text-gray-400 hover:text-white transition-colors">Community</button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-500 text-sm font-medium">LIVE</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Hero />
        <GameEras />
        <VaultDemo />
        <VotingPoll />
        <ClipsGallery />
        <ProofWall />
        <MockupsGallery />
        <CommunitySection />
        <Petition />
        
        {/* Footer */}
        <footer className="bg-vault-gray py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500">Fan-Made Concept • Not Affiliated with 2K Sports or Take-Two Interactive</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;