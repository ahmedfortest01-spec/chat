'use client';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import { getConversations, getOrCreateConversation, getMessages, sendMessage, markAsRead } from '@/lib/chat-actions';

let socket: any;

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [convs, userRes] = await Promise.all([getConversations(), fetch('/api/auth/me')]);
        setConversations(convs);
        setCurrentUser(await userRes.json());
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    init();

    socket = (io as any)();
    socket.on('receive-message', (msg: any) => {
      if (selectedConversation && msg.conversationId === selectedConversation._id) {
        setMessages((prev: any) => [...prev, { ...msg, sender: msg.senderId }]);
        markAsRead(selectedConversation._id);
      }
    });
    return () => { socket.disconnect(); };
  }, [selectedConversation]);

  const selectConv = async (otherUserId: string, otherUser: any, existingId?: string) => {
    let conv;
    if (existingId) conv = conversations.find((c: any) => c._id === existingId);
    else { conv = await getOrCreateConversation(otherUserId); setConversations(await getConversations() as any); }
    setSelectedConversation({ ...conv, otherUser });
    setMessages(await getMessages(conv._id));
    socket.emit('join-conversation', conv._id);
    markAsRead(conv._id);
  };

  const onSend = async (text: string) => {
    if (!selectedConversation || !currentUser) return;
    const msg = await sendMessage(selectedConversation._id, text);
    socket.emit('send-message', { conversationId: selectedConversation._id, text, senderId: currentUser._id, senderName: currentUser.name, createdAt: new Date().toISOString() });
    setMessages((prev: any) => [...prev, msg]);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-950">
      <ChatSidebar conversations={conversations} onSelectConversation={selectConv} selectedId={selectedConversation?._id} currentUserId={currentUser?._id} />
      <ChatWindow conversationId={selectedConversation?._id} otherUser={selectedConversation?.otherUser} messages={messages} onSendMessage={onSend} currentUserId={currentUser?._id} />
    </div>
  );
}
