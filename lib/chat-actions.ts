'use server';

import connectDB from './db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { getSession } from '@/app/actions';
import { revalidatePath } from 'next/cache';

export async function getConversations() {
  const session = await getSession();
  if (!session) return [];
  await connectDB();
  const conversations = await Conversation.find({ participants: session._id })
    .populate('participants', 'name username email')
    .sort({ lastMessageAt: -1 });
  return JSON.parse(JSON.stringify(conversations));
}

export async function getOrCreateConversation(otherUserId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  await connectDB();
  let conversation = await Conversation.findOne({ participants: { $all: [session._id, otherUserId] } });
  if (!conversation) conversation = await Conversation.create({ participants: [session._id, otherUserId] });
  return JSON.parse(JSON.stringify(conversation));
}

export async function getMessages(conversationId: string) {
  const session = await getSession();
  if (!session) return [];
  await connectDB();
  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'name username')
    .sort({ createdAt: 1 });
  return JSON.parse(JSON.stringify(messages));
}

export async function sendMessage(conversationId: string, text: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  await connectDB();
  const message = await Message.create({ conversation: conversationId, sender: session._id, text });
  await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: Date.now() });
  revalidatePath('/chat');
  return JSON.parse(JSON.stringify(message));
}

export async function markAsRead(conversationId: string) {
  const session = await getSession();
  if (!session) return;
  await connectDB();
  await Message.updateMany({ conversation: conversationId, sender: { $ne: session._id }, read: false }, { $set: { read: true } });
}
