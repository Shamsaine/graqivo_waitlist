import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return NextResponse.json({ message: 'Signups are not open yet. Please check back shortly.' }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 }); }
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const signupType = body?.signupType;
  const organizationName = typeof body?.organizationName === 'string' ? body.organizationName.trim() : '';
  const problemStatement = typeof body?.problemStatement === 'string' ? body.problemStatement.trim() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.consent !== true || body.website || !['hero', 'footer'].includes(body.source) || !['individual', 'organization'].includes(signupType) || (signupType === 'organization' && (!organizationName || organizationName.length > 160)) || problemStatement.length > 2000) {
    return NextResponse.json({ message: 'Please enter a valid email and agree to receive updates.' }, { status: 400 });
  }
  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, signupType, organizationName: signupType === 'organization' ? organizationName : '', problemStatement, source: body.source, consent: true }), signal: AbortSignal.timeout(12000), cache: 'no-store' });
    const result = await response.json();
    if (!response.ok || result.success !== true) throw new Error('Unable to save');
    return NextResponse.json({ message: "You're on the list!" });
  } catch {
    return NextResponse.json({ message: 'We couldn’t save your place right now. Please try again shortly.' }, { status: 503 });
  }
}
