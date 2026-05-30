import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [games, setGames] = useState([]);
  const [clips, setClips] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [mockups, setMockups] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [socialFeed, setSocialFeed] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [comments, setComments] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [petition, setPetition] = useState({ count: 0, signatures: [] });
  const [votes, setVotes] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch all public data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentData, gamesData, clipsData, proofsData, mockupsData, 
               communityData, feedData, commentsData, petitionData, votesData] = await Promise.all([
          api.getContent().catch(() => ({})),
          api.getGames().catch(() => []),
          api.getClips().catch(() => []),
          api.getProofs().catch(() => []),
          api.getMockups().catch(() => []),
          api.getCommunityPosts().catch(() => []),
          api.getSocialFeed().catch(() => []),
          api.getComments().catch(() => []),
          api.getPetition().catch(() => ({ count: 0, signatures: [] })),
          api.getVotes().catch(() => [])
        ]);

        setContent(contentData);
        setGames(gamesData);
        setClips(clipsData);
        setProofs(proofsData);
        setMockups(mockupsData);
        setCommunityPosts(communityData);
        setSocialFeed(feedData);
        setComments(commentsData);
        setPetition(petitionData);
        setVotes(votesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Connectivity check
    const checkConnectivity = async () => {
      try {
        const health = await api.health();
        setIsOnline(health.status === 'healthy');
      } catch {
        setIsOnline(false);
      }
    };

    checkConnectivity();
    const interval = setInterval(checkConnectivity, 30000);

    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  // Refresh functions
  const refreshGames = async () => {
    const data = await api.getGames();
    setGames(data);
  };

  const refreshClips = async () => {
    const data = await api.getClips();
    setClips(data);
  };

  const refreshComments = async () => {
    const data = await api.getComments();
    setComments(data);
  };

  const refreshPetition = async () => {
    const data = await api.getPetition();
    setPetition(data);
  };

  const refreshVotes = async () => {
    const data = await api.getVotes();
    setVotes(data);
  };

  const value = {
    content,
    games,
    clips,
    proofs,
    mockups,
    communityPosts,
    socialFeed,
    submissions,
    comments,
    subscribers,
    petition,
    votes,
    isOnline,
    loading,
    refreshGames,
    refreshClips,
    refreshComments,
    refreshPetition,
    refreshVotes,
    setContent
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;