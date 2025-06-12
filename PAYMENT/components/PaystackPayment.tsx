import React from 'react';

interface PaymentProps {
  amount: number;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
}

export const PaystackPayment: React.FC<PaymentProps> = ({
  amount,
  description,
  customerEmail = 'customer@example.com',
  customerPhone = '0700000000',
  customerName = 'John Doe',
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Server URL - replace with your Paystack backend server URL
  const API_URL = 'http://localhost:5000'; 

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Initializing Paystack payment...');
      
      // Get Paystack public key
      const publicKeyResponse = await fetch(`${API_URL}/api/paystack/publickey`);
      
      if (!publicKeyResponse.ok) {
        const errorData = await publicKeyResponse.text();
        console.error('Public key response:', errorData);
        throw new Error(`Failed to get public key: ${errorData}`);
      }

      const publicKeyData = await publicKeyResponse.json();
      console.log('Public key response:', publicKeyData);
      
      if (!publicKeyData.data?.publicKey) {
        throw new Error(`No public key in response: ${JSON.stringify(publicKeyData)}`);
      }

      // Initialize payment
      const initResponse = await fetch(`${API_URL}/api/paystack/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: amount,
          currency: 'KES',
          callback_url: `${window.location.origin}/api/paystack-callback`,
          metadata: {
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "customer_name",
                value: customerName
              },
              {
                display_name: "Customer Phone",
                variable_name: "customer_phone",
                value: customerPhone
              },
              {
                display_name: "Description",
                variable_name: "description",
                value: description
              }
            ]
          }
        }),
      });

      if (!initResponse.ok) {
        const errorData = await initResponse.text();
        console.error('Init response:', errorData);
        throw new Error(`Failed to initialize payment: ${errorData}`);
      }

      const initData = await initResponse.json();
      console.log('Payment initialized successfully:', initData);

      if (initData.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = initData.data.authorization_url;
      } else {
        throw new Error(`No authorization URL in response: ${JSON.stringify(initData)}`);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`px-6 py-2 text-white rounded-md ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Processing...' : 'Complete Application'}
      </button>
      {error && (
        <div className="text-red-600 text-sm mt-2 whitespace-pre-wrap break-all">
          {error}
        </div>
      )}
    </div>
  );
};
