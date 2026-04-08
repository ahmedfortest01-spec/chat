'use client';

import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({
  conversationId,
  otherUser,
  messages,
  onSendMessage,
  currentUserId,
  isOnline,
  onBack
}: any) {
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  if (!otherUser) return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-950/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-lg font-medium">Select a conversation to start chatting</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/50">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{otherUser.name[0]}</div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">{otherUser.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-600'}`}></div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg: any, i: number) => (
          <MessageBubble key={msg._id || i} message={msg} isOwn={msg.sender._id === currentUserId || msg.sender === currentUserId} />
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSendMessage(text); setText(''); } }} className="p-4 bg-slate-900/50 border-t border-slate-800 flex gap-2">
        <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
        </button>
      </form>
    </div>
  );
}
