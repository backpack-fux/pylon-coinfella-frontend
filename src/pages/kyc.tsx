import React, { useEffect, useMemo } from "react";
import ClockLoader from 'react-spinners/ClockLoader';

import { useCheckout } from "../context/checkout";

export const CoinFellaKYC = () => {
  const { user, onProcessKyc, isProcessingKyc } = useCheckout()
  const isValid = useMemo(() => ['pending', 'rejected'].includes(user?.status) && !isProcessingKyc, [user, isProcessingKyc])

  useEffect(() => {
    if (user && window.parent) {
      window.parent.postMessage(JSON.stringify({
        type: 'account',
        action: 'update',
        data: user
      }), "*");
    }
  }, [user])

  const message = useMemo(() => {
    if (!user) return ''
    if (user.isVerified) return 'Your account verified successfully.'
    if (user.status === 'rejected') return 'Failed KYC, please try again.'
    if (user.status === 'manual_review') return 'It\'s undo review for your KYC, please wait.'
    if (user.status === 'pending') return 'Required KYC process for trading assets.'
    return ''
  }, [user])

  return <div className="relative pt-3">
    <h3 className="text-white text-xl">KYC</h3>
    <div className="border-b-2 border-gray-300 mt-4 mb-5"></div>
    <div className="flex flex-col gap-2">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center text-white mb-5">
          {message}
        </div>
      </div>
      <button
        onClick={() => isValid && onProcessKyc()}
        className={`mt-4 text-lg text-center w-full rounded-md h-12 border-2 border-white flex items-center justify-center ${isValid ? 'bg-white text-black' : 'text-gray-300'}`}
      >
        <div className="flex items-center">
          {isProcessingKyc && <ClockLoader size={20} color='black' className="mr-2" />}
          Process
        </div>
      </button>
    </div>
  </div>
}