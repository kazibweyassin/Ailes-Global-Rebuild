import { NextRequest, NextResponse } from 'next/server';

const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;

export async function GET(req: NextRequest) {
  try {
    const orderTrackingId = req.nextUrl.searchParams.get('OrderTrackingId');
    if (!orderTrackingId) {
      return NextResponse.json({ error: 'OrderTrackingId is required' }, { status: 400 });
    }

    // 1. Get OAuth token from Pesapal
    const tokenRes = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET,
      }),
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.token;

    // 2. Get transaction status
    const statusRes = await fetch(`https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?OrderTrackingId=${orderTrackingId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const statusData = await statusRes.json();

    // Pesapal returns status in PaymentStatusDescription
    return NextResponse.json({
      payment_status_description: statusData.PaymentStatusDescription || statusData.payment_status_description || 'Unknown',
      ...statusData
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify payment', details: error }, { status: 500 });
  }
}
