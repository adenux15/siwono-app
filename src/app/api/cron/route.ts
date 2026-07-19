import { NextResponse } from 'next/server'
import { checkAndUpdateOverdueLoans } from '@/app/peminjaman/actions'

// This endpoint can be triggered periodically (e.g. via Vercel Cron or standard cron)
// Make sure to protect it in a real production app (e.g. with a secret token)
export async function GET(request: Request) {
  try {
    // Optionally check for authorization header here
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const result = await checkAndUpdateOverdueLoans()

    if (result.success) {
      return NextResponse.json({ success: true, message: `Checked overdue loans. Processed: ${result.count || 0}` })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
