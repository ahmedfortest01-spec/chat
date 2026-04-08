'use client';

import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import { getConversations, getOrCreateConversation, getMessages, sendMessage, markAsRead } from '@/lib/chat-actions';

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socketRef = useRef<any>(null);

  // Initialize data once
  useEffect(() => {
    const init = async () => {
      try {
        const [convs, userRes] = await Promise.all([getConversations(), fetch('/api/auth/me')]);
        setConversations(convs);
        setCurrentUser(await userRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();

    // Initialize socket once
    const socket = (io as any)();
    socketRef.current = socket;

    socket.on('connect', () => console.log('Connected to socket'));

    socket.on('user-status-update', (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Listen for messages separately to avoid re-binding socket
  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceive = (msg: any) => {
      // Check if message belongs to current view
      setSelectedConversation((current: any) => {
        if (current && msg.conversationId === current._id) {
          setMessages((prev: any) => [...prev, { ...msg, sender: msg.senderId }]);
          markAsRead(current._id);
        }
        return current;
      });

      // Always update conversation list order/last message
      setConversations((prev: any) => {
          const index = prev.findIndex((c: any) => c._id === msg.conversationId);
          if (index !== -1) {
              const updated = [...prev];
              updated[index].lastMessageAt = new Date().toISOString();
              const conv = updated.splice(index, 1)[0];
              return [conv, ...updated];
          }
          return prev;
      });
    };

    socketRef.current.on('receive-message', handleReceive);
    return () => {
        socketRef.current?.off('receive-message', handleReceive);
    };
  }, []);

  const selectConv = async (otherUserId: string, otherUser: any, existingId?: string) => {
    let conv;
    if (existingId) {
        conv = conversations.find((c: any) => c._id === existingId);
    } else {
        conv = await getOrCreateConversation(otherUserId);
        const updatedConvs = await getConversations();
        setConversations(updatedConvs as any);
    }
    setSelectedConversation({ ...conv, otherUser });
    setMessages(await getMessages(conv._id));
    socketRef.current.emit('join-conversation', conv._id);
    markAsRead(conv._id);
  };

  const onSend = async (text: string) => {
    if (!selectedConversation || !currentUser) return;
    const msg = await sendMessage(selectedConversation._id, text);
    socketRef.current.emit('send-message', {
      conversationId: selectedConversation._id,
      text,
      senderId: currentUser._id,
      senderName: currentUser.name,
      createdAt: new Date().toISOString()
    });
    setMessages((prev: any) => [...prev, msg]);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white font-medium">Loading Chat...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-950 relative">
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 h-full`}>
        <ChatSidebar
          conversations={conversations}
          onSelectConversation={selectConv}
          selectedId={selectedConversation?._id}
          currentUserId={currentUser?._id}
          onlineUsers={onlineUsers}
        />
      </div>
      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 h-full`}>
        <ChatWindow
          conversationId={selectedConversation?._id}
          otherUser={selectedConversation?.otherUser}
          messages={messages}
          onSendMessage={onSend}
          currentUserId={currentUser?._id}
          isOnline={selectedConversation && onlineUsers.includes(selectedConversation.otherUser._id)}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    </div>
  );
}
