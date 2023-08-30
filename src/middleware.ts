import { NextRequest, NextResponse } from 'next/server'

// IPホワイトリスト
const IP_WHITELIST = ['60.65.237.227', '54.199.212.225'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // ipアドレスを取得
  let ip: string = request.ip ?? request.headers.get('x-real-ip') ?? '';

  // プロキシ経由の場合
  const forwardedFor = request.headers.get('x-forwarded-for')

  // プロキシ経由の場合は、プロキシのIPアドレスを取得
  if(!ip && forwardedFor){
    ip = forwardedFor.split(',').at(0) ?? 'Unknown'
  }

  // 取得したIPアドレスがホワイトリストに含まれているかチェックし、含まれていない場合はアクセス拒否
  if(!IP_WHITELIST.includes(ip)){
    return NextResponse.redirect('https://server-monitoring-prototype.vercel.app/access-denied'); // アクセス拒否のページにリダイレクト
  }

  return res;
}