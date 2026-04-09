'use client';
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { useTranslations } from 'next-intl';
interface ChatWindowProps { conversationId?: string; otherUser?: any; messages: any[]; onSendMessage: (text: string) => void; currentUserId?: string; isOnline?: boolean; onBack: () => void; }
export default function ChatWindow({ conversationId, otherUser, messages, onSendMessage, currentUserId, isOnline, onBack }: ChatWindowProps) {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Chat');
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
  const handleSend = (e: React.FormEvent) => { e.preventDefault(); if (!text.trim()) return; onSendMessage(text); setText(''); };
  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-4 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6"><svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('selectConversation')}</h2>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors"><svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">{otherUser?.name[0]}</div>
        <div className="flex-1"><h2 className="text-sm font-bold text-slate-900 dark:text-white">{otherUser?.name}</h2><div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} /><span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{isOnline ? t('online') : t('offline')}</span></div></div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-transparent">{messages.map((msg, idx) => <MessageBubble key={msg._id || idx} message={msg} isOwn={msg.sender === currentUserId || msg.sender?._id === currentUserId} />)}</div>
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2"><input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('typeMessage')} className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" /><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button></div>
      </form>
    </div>
  );
}
