import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/app/actions';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    if (!query) return NextResponse.json([]);

    await connectDB();
    const users = await User.find({
      $and: [
        { $or: [{ username: { $regex: query, $options: 'i' } }, { email: { $regex: query, $options: 'i' } }] },
        { _id: { $ne: session._id } },
      ],
    }).select('name username email').limit(10);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
