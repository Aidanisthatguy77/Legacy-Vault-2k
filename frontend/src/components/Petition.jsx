import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import api from '../api';

function Petition() {
  const { petition } = useGlobal();
  const [name, setName] = useState('');
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSign = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await api.signPetition(name.trim());
      setSigned(true);
      setName('');
    } catch (error) {
      console.error('Error signing petition:', error);
    }
    setLoading(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-vault-black to-gray-900">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Add Your Name</h2>
        <p className="text-gray-400 mb-8">Stand with the community. Let 2K know this matters.</p>
        
        {/* Sign Form */}
        {!signed ? (
          <form onSubmit={handleSign} className="mb-12">
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-field flex-1"
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary whitespace-nowrap"
              >
                {loading ? 'Signing...' : 'Sign Petition'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-12 p-6 bg-green-500/20 border border-green-500/50 rounded-xl">
            <p className="text-green-500 font-semibold text-xl mb-2">✓ Thank you for signing!</p>
            <p className="text-gray-400">Together we're making our voices heard.</p>
          </div>
        )}
        
        {/* Signature Count */}
        <div className="mb-8">
          <p className="text-5xl font-bold text-vault-red mb-2">{petition.count}+</p>
          <p className="text-gray-400">signatures collected</p>
        </div>
        
        {/* Recent Signatures */}
        {petition.signatures && petition.signatures.length > 0 && (
          <div className="bg-vault-gray rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Signatures</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {petition.signatures.slice(0, 20).map((sig, index) => (
                <div key={sig.id || index} className="text-gray-400 text-sm">
                  {sig.name}
                </div>
              ))}
            </div>
            {petition.signatures.length > 20 && (
              <p className="text-gray-500 text-sm mt-4">And {petition.signatures.length - 20} more...</p>
            )}
          </div>
        )}
        
        {/* Share */}
        <div className="mt-12">
          <p className="text-gray-400 mb-4">Share the campaign</p>
          <div className="flex justify-center gap-4">
            <button className="btn-secondary">Share on Twitter</button>
            <button className="btn-secondary">Share on Reddit</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Petition;