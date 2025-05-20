import { NextRequest, NextResponse } from 'next/server';
import { clarifyTask } from '../../utils/aiClient';

export async function POST(req: NextRequest) {
  const { story } = await req.json();
  if (!story) return NextResponse.json({ error: 'No story provided' }, { status: 400 });

  try {
    const explanation = await clarifyTask(story);
    return NextResponse.json({ explanation });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate explanation', detail: error }, { status: 500 });
  }
}
