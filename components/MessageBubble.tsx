'use client';
import { Check, CheckCheck } from 'lucide-react';
interface MessageBubbleProps { message: any; isOwn: boolean; }
export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${isOwn ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`flex items-center gap-1 mt-1 justify-end ${isOwn ? 'text-blue-100' : 'text-slate-500'}`}>
          <span className="text-[10px] font-medium">{time}</span>
          {isOwn && (
            <span>
              {message.read ? <CheckCheck className="w-3 h-3 text-blue-200" /> : <Check className="w-3 h-3 text-blue-300" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
