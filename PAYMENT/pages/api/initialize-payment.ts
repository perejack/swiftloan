import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  status: boolean;
  message: string;
  data?: any;
};

/**
 * This endpoint proxies payment initialization to our Node.js Paystack server
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: false,
      message: 'Method not allowed',
    });
  }

  const { email, amount, currency, callback_url, metadata } = req.body;

  if (!email || !amount) {
    return res.status(400).json({
      status: false,
      message: 'Email and amount are required',
    });
  }

  try {
    // Forward the request to our Node.js Paystack server
    const initResponse = await fetch('http://localhost:5000/api/paystack/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency,
        callback_url,
        metadata
      }),
    });

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      throw new Error(`Failed to initialize payment: ${errorText}`);
    }

    const data = await initResponse.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return res.status(500).json({
      status: false,
      message: error.message || 'Failed to initialize payment',
    });
  }
}
