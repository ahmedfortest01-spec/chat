'use client';
export default function MessageBubble({ message, isOwn }: any) {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isOwn ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none border border-slate-700'}`}>
        <p>{message.text}</p>
      </div>
      <span className="text-[10px] text-slate-500 mt-1">{new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  );
}
