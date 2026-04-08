'use client';
import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ conversationId, otherUser, messages, onSendMessage, currentUserId }: any) {
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  if (!otherUser) return <div className="flex-1 flex items-center justify-center text-slate-500">Select a conversation</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/50">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{otherUser.name[0]}</div>
        <div><div className="text-white font-bold text-sm">{otherUser.name}</div><div className="text-green-500 text-[10px] uppercase">Online</div></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any, i: number) => <MessageBubble key={msg._id || i} message={msg} isOwn={msg.sender._id === currentUserId || msg.sender === currentUserId} />)}
        <div ref={endRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSendMessage(text); setText(''); } }} className="p-4 border-t border-slate-800 flex gap-2">
        <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl">Send</button>
      </form>
    </div>
  );
}
