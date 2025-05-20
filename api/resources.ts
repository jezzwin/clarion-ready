import { NextRequest, NextResponse } from 'next/server';
import { suggestResources } from '../../utils/aiClient';

export async function POST(req: NextRequest) {
  const { topic } = await req.json();
  if (!topic) return NextResponse.json({ error: 'No topic provided' }, { status: 400 });

  try {
    const resources = await suggestResources(topic);
    return NextResponse.json({ resources });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources', detail: error }, { status: 500 });
  }
}