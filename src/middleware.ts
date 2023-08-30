import { NextRequest, NextResponse } from 'next/server'

// あなたのIPホワイトリスト
const IP_WHITELIST = ['60.65.237.227'];

export default async function middleware(req: NextRequest) {
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];

  console.log(clientIP);

  if (!IP_WHITELIST.includes(clientIP)) {
    return NextResponse.redirect('https://server-monitoring-prototype.vercel.app/access-denied'); // アクセス拒否のページにリダイレクト
  }

  return NextResponse.next();
}
