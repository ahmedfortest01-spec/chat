'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
interface ChatSidebarProps { conversations: any[]; onSelectConversation: (otherUserId: string, otherUser: any, existingId?: string) => void; selectedId?: string; currentUserId?: string; onlineUsers: string[]; }
export default function ChatSidebar({ conversations, onSelectConversation, selectedId, currentUserId, onlineUsers }: ChatSidebarProps) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const t = useTranslations('Chat');
  const handleSearch = async (val: string) => {
    setSearch(val);
    if (val.length < 2) { setSearchResults([]); return; }
    const res = await fetch(`/api/users/search?q=${val}`);
    const data = await res.json();
    setSearchResults(data.filter((u: any) => u._id !== currentUserId));
  };
  return (
    <div className="w-full flex flex-col bg-slate-50 dark:bg-slate-900/50 h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder={t('searchPlaceholder')} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {search.length >= 2 ? (
          <div className="p-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Search Results</p>
            {searchResults.map((user) => (
              <button key={user._id} onClick={() => { onSelectConversation(user._id, user); setSearch(''); setSearchResults([]); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{user.name[0]}</div>
                <div><p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p><p className="text-xs text-slate-500">@{user.username}</p></div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {conversations.length === 0 ? <p className="text-center text-slate-500 text-sm mt-10">{t('noConversations')}</p> : (
              conversations.map((conv) => {
                const otherUser = conv.participants.find((p: any) => p._id !== currentUserId);
                const isOnline = onlineUsers.includes(otherUser?._id);
                return (
                  <button key={conv._id} onClick={() => onSelectConversation(otherUser._id, otherUser, conv._id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${selectedId === conv._id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-slate-300'}`}>
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${selectedId === conv._id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>{otherUser?.name[0]}</div>
                      {isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-50 dark:border-slate-900 rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline"><p className={`text-sm font-bold truncate ${selectedId === conv._id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{otherUser?.name}</p></div>
                      <p className={`text-xs truncate ${selectedId === conv._id ? 'text-blue-100' : 'text-slate-500'}`}>{isOnline ? t('online') : t('offline')}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
