import React, { useState } from 'react';
import api from '../api';

// ============ ACCELERATION TAB ============
function AccelerationTab() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    const userInput = input;
    setInput('');
    setHistory(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Simulated response (in real app, would call backend agent)
    setTimeout(() => {
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `Agent response to: "${userInput}"\n\n[This would connect to the actual Acceleration Agent in the full implementation.]` 
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-full flex">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Acceleration Agent</h2>
          <button className="btn-secondary text-sm">History</button>
        </div>
        
        <div className="flex-1 bg-black/50 rounded-xl p-4 mb-4 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center">Type a command to start...</p>
          ) : (
            history.map((msg, i) => (
              <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  msg.role === 'user' ? 'bg-vault-red text-white' : 'bg-gray-800 text-gray-300'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && <p className="text-gray-500 animate-pulse">Agent is thinking...</p>}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Add a /api/version endpoint..."
            className="input-field"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="btn-primary">
            Send
          </button>
        </form>
      </div>
      
      {/* Vault Guide Sidebar */}
      <div className="w-80 bg-gray-900/50 rounded-xl p-4 ml-4">
        <h3 className="text-lg font-semibold text-white mb-4">Vault Guide</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Games collection: title, year, cover_image, hook_text...</p>
          <p>• Clips: game_id, platform, title, embed_url...</p>
          <p>• Content: key-value pairs for site text...</p>
          <p>• Admin auth via POST /api/admin/login</p>
        </div>
      </div>
    </div>
  );
}

// ============ DEPLOY TAB ============
function DeployTab() {
  const [deploying, setDeploying] = useState(false);
  const [status, setStatus] = useState(null);

  const handleDeploy = async () => {
    setDeploying(true);
    setStatus({ step: 'Preparing deployment...', progress: 0 });
    
    // Simulate deployment
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 500));
      setStatus({ step: `Deploying... ${i}%`, progress: i });
    }
    
    setDeploying(false);
    setStatus({ step: 'Deployment complete!', progress: 100 });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Deploy</h2>
      
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">GitHub Repository</h3>
            <a href="https://github.com/Aidanisthatguy77/Legacy-Vault" target="_blank" rel="noopener noreferrer" className="text-vault-red text-sm">
              Aidanisthatguy77/Legacy-Vault
            </a>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <button className="text-sm text-gray-400 hover:text-white mb-4">Manage tokens</button>
      </div>
      
      {/* Pipeline Steps */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {['GitHub Push', 'Atlas Setup', 'Backend Deploy', 'Frontend Deploy'].map((step, i) => (
          <div key={step} className="card text-center">
            <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
              i < 4 ? 'bg-vault-red' : 'bg-gray-700'
            }`}>
              {i + 1}
            </div>
            <p className="text-sm text-white">{step}</p>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleDeploy} 
        disabled={deploying}
        className="btn-primary w-full text-lg"
      >
        {deploying ? 'Deploying...' : 'Deploy Live'}
      </button>
      
      {status && (
        <div className="mt-6 bg-black/50 rounded-lg p-4">
          <p className="text-white">{status.step}</p>
          <div className="w-full h-2 bg-gray-800 rounded-full mt-2">
            <div className="h-full bg-vault-red rounded-full" style={{ width: `${status.progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ MONITOR TAB ============
function MonitorTab() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 2000));
    setScanning(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Website Monitor</h2>
        <button onClick={handleScan} disabled={scanning} className="btn-secondary">
          {scanning ? 'Scanning...' : 'Scan Now'}
        </button>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Backend', status: 'healthy', color: 'green' },
          { label: 'Database', status: 'healthy', color: 'green' },
          { label: 'AI Engine', status: 'healthy', color: 'green' },
          { label: 'Frontend', status: 'healthy', color: 'green' },
        ].map((item) => (
          <div key={item.label} className="card flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
            <div>
              <p className="text-white font-semibold">{item.label}</p>
              <p className="text-gray-500 text-sm capitalize">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Apply from URL */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Apply from URL</h3>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtu.be/... or https://github.com/..."
          className="input-field mb-4"
        />
        <textarea
          placeholder="Optional extra direction — e.g. 'apply only to the landing page'"
          className="input-field mb-4 h-20"
        ></textarea>
        <button className="btn-primary">Distill & Execute</button>
      </div>
    </div>
  );
}

// ============ NEPLIT TAB ============
function NeplitTab() {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Would connect to Nep AI
  };

  return (
    <div className="h-full flex">
      {/* Chat */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white mb-4">Nep AI</h2>
        <div className="bg-black/50 rounded-xl p-4 h-64 mb-4 overflow-y-auto">
          <p className="text-gray-500">Chat with Nep...</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Nep..."
            className="input-field"
          />
          <button type="submit" className="btn-primary">Send</button>
        </form>
        
        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <button className="btn-secondary text-sm">Download ZIP</button>
          <button className="btn-secondary text-sm">Build & Download</button>
          <button className="btn-secondary text-sm">Run Check</button>
        </div>
      </div>
      
      {/* System Pulse */}
      <div className="w-64 bg-gray-900/50 rounded-xl p-4 ml-4">
        <h3 className="text-lg font-semibold text-white mb-4">System Pulse</h3>
        <div className="space-y-3">
          {['Backend', 'Database', 'AI'].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white">{item}: OK</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ CRUD TABS ============
function GamesTab() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Games Management</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Add Game
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {['NBA 2K15', 'NBA 2K16', 'NBA 2K17', 'NBA 2K20'].map((game) => (
          <div key={game} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-800 rounded-lg"></div>
              <div>
                <p className="text-white font-semibold">{game}</p>
                <p className="text-gray-500 text-sm">2014-2019</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-700 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-700 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClipsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Clips Management</h2>
        <button className="btn-primary">Add Clip</button>
      </div>
      <p className="text-gray-500">No clips added yet.</p>
    </div>
  );
}

function MockupsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Mockups Management</h2>
        <button className="btn-primary">Add Mockup</button>
      </div>
      <p className="text-gray-500">No mockups added yet.</p>
    </div>
  );
}

function ProofTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Proof Management</h2>
        <button className="btn-primary">Add Proof</button>
      </div>
      <p className="text-gray-500">No proofs added yet.</p>
    </div>
  );
}

function CommunityWallTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Community Wall</h2>
        <button className="btn-primary">Add Post</button>
      </div>
      <p className="text-gray-500">No posts added yet.</p>
    </div>
  );
}

function LiveFeedTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Live Feed</h2>
        <button className="btn-primary">Add Item</button>
      </div>
      <p className="text-gray-500">No items added yet.</p>
    </div>
  );
}

function SubmissionsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Creator Submissions</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-gray-500">Pending</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-gray-500">Approved</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-white">0</p>
          <p className="text-gray-500">Rejected</p>
        </div>
      </div>
      <p className="text-gray-500">No submissions yet.</p>
    </div>
  );
}

function ContentTab() {
  const [content, setContent] = useState({
    hero_headline: 'THE VAULT AWAITS',
    hero_subheadline: '2K15 • 2K16 • 2K17 • 2K20 — All in one place.',
    hero_tagline: 'Persistent online. No resets. Ever.',
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Site Content</h2>
      <div className="space-y-6">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <label className="block text-gray-400 text-sm mb-2 capitalize">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setContent({ ...content, [key]: e.target.value })}
              className="input-field"
            />
          </div>
        ))}
        <button className="btn-primary">Save All Changes</button>
      </div>
    </div>
  );
}

function CommentsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Comments</h2>
        <button className="btn-secondary">Refresh</button>
      </div>
      <p className="text-gray-500">No comments yet.</p>
    </div>
  );
}

function EmailsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Subscribers</h2>
        <button className="btn-primary">Export Emails</button>
      </div>
      <p className="text-gray-500">No subscribers yet.</p>
    </div>
  );
}

function PetitionTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Petition</h2>
      <div className="card mb-6">
        <p className="text-gray-400 mb-4">Total Signatures: <span className="text-white font-bold">0</span></p>
        <div className="flex gap-4">
          <input type="text" placeholder="Add single name" className="input-field flex-1" />
          <button className="btn-secondary">Add Single</button>
        </div>
        <div className="mt-4">
          <input type="number" placeholder="100" className="input-field w-32" />
          <button className="btn-primary ml-4">Add 100 Signatures</button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN ADMIN COMPONENT ============
function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('adminLoggedIn') === 'true');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('Acceleration');

  const tabs = [
    'Acceleration', 'Deploy', 'Monitor', 'Neplit',
    'Games', 'Clips', 'Mockups', 'Proof',
    'Community Wall', 'Live Feed', 'Submissions', 'Content',
    'Comments', 'Emails', 'Petition'
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.adminLogin(password);
      if (response.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem('adminLoggedIn', 'true');
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    } catch {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('adminLoggedIn');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vault-black">
        <div className="card max-w-md w-full">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Access</h1>
          <p className="text-gray-400 text-center mb-6">Enter admin password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field mb-4"
              autoFocus
            />
            {loginError && (
              <p className="text-red-500 text-center mb-4">Invalid password</p>
            )}
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
          <a href="/" className="block text-center text-gray-400 hover:text-white mt-4">
            ← Back to site
          </a>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'Acceleration': return <AccelerationTab />;
      case 'Deploy': return <DeployTab />;
      case 'Monitor': return <MonitorTab />;
      case 'Neplit': return <NeplitTab />;
      case 'Games': return <GamesTab />;
      case 'Clips': return <ClipsTab />;
      case 'Mockups': return <MockupsTab />;
      case 'Proof': return <ProofTab />;
      case 'Community Wall': return <CommunityWallTab />;
      case 'Live Feed': return <LiveFeedTab />;
      case 'Submissions': return <SubmissionsTab />;
      case 'Content': return <ContentTab />;
      case 'Comments': return <CommentsTab />;
      case 'Emails': return <EmailsTab />;
      case 'Petition': return <PetitionTab />;
      default: return <AccelerationTab />;
    }
  };

  return (
    <div className="min-h-screen bg-vault-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <a href="/" className="text-gray-400 hover:text-white text-sm">← Back to Site</a>
        </div>
        
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <span className="text-white font-bold">NBA 2K Legacy Vault</span>
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2 rounded-lg mb-1 transition-colors ${
                activeTab === tab
                  ? 'bg-vault-red text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm">
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderTab()}
      </main>
    </div>
  );
}

export default Admin;