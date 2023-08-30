import { NextRequest, NextResponse } from 'next/server'

const IP_WHITELIST = ['172.31.208.1']; // あなたのIPホワイトリスト

export default async function middleware(req: NextRequest) {
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];

  if (!IP_WHITELIST.includes(clientIP)) {
    return NextResponse.redirect('https://server-monitoring-prototype.vercel.app/access-denied'); // アクセス拒否のページにリダイレクト
  }

  return NextResponse.next();
}
