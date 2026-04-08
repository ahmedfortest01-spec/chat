'use client';

import { useState, useEffect } from 'react';

export default function ChatSidebar({
    conversations,
    onSelectConversation,
    selectedId,
    currentUserId,
    onlineUsers
}: any) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (search.length > 2) {
      const delay = setTimeout(async () => {
        const res = await fetch(`/api/users/search?query=${search}`);
        setSearchResults(await res.json());
      }, 300);
      return () => clearTimeout(delay);
    } else setSearchResults([]);
  }, [search]);

  return (
    <div className="w-full h-full border-r border-slate-800 flex flex-col bg-slate-900/50">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4 px-2">Messages</h2>
        <div className="px-2">
            <input
                type="text"
                placeholder="Search users..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {searchResults.length > 0 ? (
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Search Results</p>
            {searchResults.map((user: any) => (
              <button key={user._id} onClick={() => { onSelectConversation(user._id, user); setSearch(''); }} className="w-full text-left p-3 hover:bg-slate-800 rounded-2xl flex items-center gap-3 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{user.name[0]}</div>
                <div>
                    <div className="text-white font-semibold text-sm">{user.name}</div>
                    <div className="text-slate-400 text-xs">@{user.username}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            {conversations.map((conv: any) => {
              const other = conv.participants.find((p: any) => p._id !== currentUserId);
              const isOtherOnline = other && onlineUsers.includes(other._id);
              return (
                <button
                    key={conv._id}
                    onClick={() => onSelectConversation(other._id, other, conv._id)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all ${selectedId === conv._id ? 'bg-blue-600/20 border border-blue-500/30 shadow-lg' : 'hover:bg-slate-800/50 border border-transparent'}`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-800">{other?.name[0]}</div>
                    {isOtherOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900 shadow-sm"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <div className="text-white font-bold text-sm truncate">{other?.name}</div>
                        <div className="text-slate-500 text-[10px] font-medium whitespace-nowrap ml-2">
                             {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                    <div className="text-slate-400 text-xs truncate">@{other?.username}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
