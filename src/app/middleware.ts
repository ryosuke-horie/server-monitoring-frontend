import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const accessToken = localStorage.getItem('accessToken');

    // ローカルストレージにaccessTokenがない場合はログイン画面にリダイレクトする
    if (accessToken === undefined) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }
}
