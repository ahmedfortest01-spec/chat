import { NextRequest, NextResponse } from 'next/server';
import { register as registerAction } from '@/app/actions';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    await registerAction(formData);
  } catch (error: any) {
    // The action will redirect on success, so if we get here, something went wrong
    console.error('Register error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
