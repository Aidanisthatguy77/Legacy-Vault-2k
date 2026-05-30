import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import api from '../api';

function VotingPoll() {
  const { games, votes } = useGlobal();
  const [voted, setVoted] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const totalVotes = votes.reduce((sum, v) => sum + v.count, 0);

  const handleVote = async (gameId) => {
    try {
      await api.castVote(gameId);
      setSelectedGame(gameId);
      setVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getGameVoteCount = (gameId) => {
    const vote = votes.find(v => v.game_id === gameId);
    return vote ? vote.count : 0;
  };

  const getPercentage = (count) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  return (
    <section className="py-20 bg-vault-black">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Which Era Do You Want Back Most?</h2>
        <p className="text-gray-500 text-center mb-8">{totalVotes} votes cast • Cast your vote below</p>
        
        <div className="space-y-4">
          {games.map((game) => {
            const count = getGameVoteCount(game.id);
            const percentage = getPercentage(count);
            
            return (
              <button
                key={game.id}
                onClick={() => !voted && handleVote(game.id)}
                disabled={voted}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  voted 
                    ? 'border-gray-700 bg-vault-gray cursor-default' 
                    : 'border-gray-700 bg-vault-gray hover:border-vault-red/50 hover:bg-gray-800'
                } ${selectedGame === game.id ? 'border-vault-red bg-vault-red/10' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold text-lg">{game.title} ({game.year})</span>
                  <span className="text-gray-400">{count} votes ({percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-vault-red transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
        
        {voted && (
          <p className="text-center text-green-500 mt-6 font-semibold">
            ✓ Thank you for voting!
          </p>
        )}
      </div>
    </section>
  );
}

export default VotingPoll;