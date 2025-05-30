import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X } from 'lucide-react';

interface MpesaWithdrawButtonProps {
  className?: string;
}

const MpesaWithdrawButton: React.FC<MpesaWithdrawButtonProps> = ({ className = '' }) => {
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleOpenIframe = () => {
    setShowIframe(true);
  };

  const handleCloseIframe = () => {
    setShowIframe(false);
  };

  return (
    <>
      {/* This is the green button that matches your image */}
      <button
        onClick={handleOpenIframe}
        className={`inline-flex items-center gap-2 bg-white text-green-600 font-medium py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all ${className}`}
      >
        <Wallet className="w-5 h-5" />
        <span>Withdraw to M-PESA</span>
      </button>

      {/* Iframe Modal */}
      <AnimatePresence>
        {showIframe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full relative overflow-hidden shadow-lg"
              style={{ maxHeight: '90vh' }}
            >
              {/* Header */}
              <div className="flex justify-between items-center bg-green-100 p-4 border-b">
                <h3 className="text-lg font-semibold text-green-800">M-PESA Activation</h3>
                <button
                  onClick={handleCloseIframe}
                  className="text-green-800 hover:text-green-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Iframe Container */}
              <div style={{ height: 'calc(90vh - 60px)' }}>
                <iframe
                  ref={iframeRef}
                  src="https://payhero-activation.netlify.app/"
                  className="w-full h-full border-0"
                  title="PayHero M-PESA Activation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MpesaWithdrawButton;
