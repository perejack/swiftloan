import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  status: boolean;
  message: string;
  data?: any;
};

/**
 * This endpoint handles callbacks from Paystack after a payment attempt
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({
      status: false,
      message: 'No reference provided',
    });
  }

  try {
    // Verify payment with our Node.js Paystack server
    const verifyResponse = await fetch(`http://localhost:5000/api/paystack/verify/${reference}`);
    
    if (!verifyResponse.ok) {
      throw new Error(`Verification failed: ${await verifyResponse.text()}`);
    }

    const verifyData = await verifyResponse.json();

    // Log details for debugging
    console.log('Payment verification response:', verifyData);

    // Check if payment was successful
    if (verifyData.status && verifyData.data.status === 'success') {
      // Payment successful - update your database or perform any necessary actions
      
      // Redirect to a success page
      res.redirect(307, '/checkout?status=success&reference=' + reference);
    } else {
      // Payment failed
      res.redirect(307, '/checkout?status=failed&message=' + encodeURIComponent(verifyData.message || 'Payment verification failed'));
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.redirect(307, '/checkout?status=error&message=' + encodeURIComponent('Error verifying payment'));
  }
}
