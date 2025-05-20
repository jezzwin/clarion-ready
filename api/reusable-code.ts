import { NextRequest, NextResponse } from 'next/server';
import { extractReusableCode } from '../../utils/aiClient';

export async function POST(req: NextRequest) {
  const { codeSnippet } = await req.json();
  if (!codeSnippet) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

  try {
    const reusableParts = await extractReusableCode(codeSnippet);
    return NextResponse.json({ reusableParts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to extract reusable code', detail: error }, { status: 500 });
  }
}