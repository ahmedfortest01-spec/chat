'use client';
import { useState, useEffect } from 'react';

export default function ChatSidebar({ conversations, onSelectConversation, selectedId, currentUserId }: any) {
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
    <div className="w-80 border-r border-slate-800 flex flex-col h-full bg-slate-900/50">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
        <input type="text" placeholder="Search users..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {searchResults.length > 0 ? (
          <div className="p-2">
            {searchResults.map((user: any) => (
              <button key={user._id} onClick={() => { onSelectConversation(user._id, user); setSearch(''); }} className="w-full text-left p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{user.name[0]}</div>
                <div><div className="text-white font-medium text-sm">{user.name}</div><div className="text-slate-400 text-xs">@{user.username}</div></div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conv: any) => {
              const other = conv.participants.find((p: any) => p._id !== currentUserId);
              return (
                <button key={conv._id} onClick={() => onSelectConversation(other._id, other, conv._id)} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 mb-1 ${selectedId === conv._id ? 'bg-blue-600/20' : 'hover:bg-slate-800'}`}>
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg">{other?.name[0]}</div>
                  <div className="flex-1 truncate"><div className="text-white font-semibold text-sm">{other?.name}</div><div className="text-slate-400 text-xs truncate">@{other?.username}</div></div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
