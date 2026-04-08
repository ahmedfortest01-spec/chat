'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '../models/User';
import { redirect } from 'next/navigation';
import { sendWelcomeEmail } from './email';

const JWT_SECRET = process.env.JWT_SECRET || '800e843c089c894982637213456789abcdef';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function signJWT(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function register(formData: FormData): Promise<void> {
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !username || !email || !password) {
    redirect('/auth/register?error=Please fill in all fields');
  }

  await connectDB();

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    redirect('/auth/register?error=User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const token = await signJWT({ userId: user._id.toString() });

  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  // Mock email sending
  await sendWelcomeEmail(email, name);

  redirect('/dashboard');
}

export async function login(formData: FormData): Promise<void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    redirect('/auth/login?error=Please fill in all fields');
  }

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    redirect('/auth/login?error=Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    redirect('/auth/login?error=Invalid credentials');
  }

  const token = await signJWT({ userId: user._id.toString() });

  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  redirect('/dashboard');
}

export async function logout(): Promise<void> {
  (await cookies()).delete('token');
  redirect('/auth/login');
}

export async function getSession() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;

  const decoded: any = await verifyJWT(token);
  if (!decoded) return null;

  await connectDB();
  const user = await User.findById(decoded.userId).select('-password');
  return user;
}
