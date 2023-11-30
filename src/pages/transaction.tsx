import React, { useEffect, useMemo } from "react";
import _ from 'lodash';
import moment from 'moment-timezone';
import { toast } from "react-toastify";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ClockLoader from 'react-spinners/ClockLoader';

import { useCheckout } from "../context/checkout";
import { calcTip } from "../utils";
import UsFlagImage from '../assets/images/us-flag.png';
import VisaIcon from '../assets/images/visa-icon.png';
const explorerUri = process.env.REACT_APP_EXPLORER_URL || 'https://mumbai.polygonscan.com'

export const CoinFellaTransaction = () => {
  const { checkoutInfo, transaction, checkoutRequest, onRetry } = useCheckout()
  const { values } = checkoutInfo
  const tipAmount = useMemo(() => calcTip(values), [values]);
  const subTotal = useMemo(() => (Number(values.cost || 0) + tipAmount).toFixed(2), [values, tipAmount])

  useEffect(() => {
    if (checkoutRequest?.checkoutRequest && transaction)
      window.parent.postMessage(JSON.stringify({
        type: 'order',
        action: 'update',
        data: {
          id: checkoutRequest.checkoutRequest?.id,
          status: transaction.paidStatus
        }
      }), "*");
  }, [checkoutRequest, transaction])

  return <div className="pt-3">
    <h3 className="text-white text-xl">Transaction</h3>
    <div className="border-b-2 border-gray-300 mt-4 mb-5"></div>
    <div className="flex-1 flex flex-col justify-between gap-2">
      <div>
        <p className="text-gray-300 text-lg text-left">Amount</p>
        <div className="flex w-full">
          <div className="border-white border-2 rounded-md h-11 bg-transparent flex-1 text-white text-md text-right text-lg p-2 shadow-sm shadow-white">
            {subTotal}
          </div>
          <div className='border-2 border-white rounded-md h-11 w-24 ml-2 flex items-center justify-center text-white text-lg shadow-sm shadow-white'>
            <img src={UsFlagImage} alt='' className="flag mr-2" />
            USD
          </div>
        </div>
      </div>
      <div>
        <p className="text-lg text-left text-gray-300">Payment Method</p>
        <div className="flex w-full">
          <div className="border-white border-2 rounded-md h-11 bg-transparent flex-1 text-white text-md text-right text-lg p-2 shadow-sm shadow-white">
            {(!transaction || (transaction?.step === 'Charge' && transaction.status === 'processing')) ? 'Processing' : transaction.paidStatus === 'error' ? 'Failed' : 'Accepted'}
          </div>
          <div className='border-2 border-white rounded-md h-11 w-24 ml-2 flex items-center justify-center text-white text-lg shadow-sm shadow-white'>
            <img src={VisaIcon} alt='' className="!w-8" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-gray-300 text-lg text-left">Transaction Status</p>
        <div className="flex w-full">
          <CopyToClipboard
            text={transaction?.transactionId ? `${explorerUri}/tx/${transaction?.transactionId}` : ''}
            onCopy={() => {
              if (transaction?.transactionId) {
                toast.success('Copied transaction')
              }
            }}>
            <div className="border-white border-2 cursor-pointer rounded-md h-11 bg-transparent flex-1 text-white text-md text-center text-lg p-2 shadow-sm shadow-white truncate overflow-hidden">
              <div className="truncate overflow-ellipsis">{transaction?.transactionId}</div>
            </div>
          </CopyToClipboard>
          <div className='border-2 border-white rounded-md h-11 w-24 ml-2 flex items-center justify-center text-white text-lg shadow-sm shadow-white'>
            TX ID
          </div>
        </div>
      </div>
      <div>
        <p className="text-gray-300 text-lg text-left">Date</p>
        <div className="flex w-full">
          <div className="border-white border-2 rounded-md h-11 bg-transparent flex-1 text-white text-md text-lg p-2 shadow-sm shadow-white text-center">
            {transaction?.date ? moment(transaction?.date).format('MM DD YYYY') : ''}
          </div>
          <div className='border-2 border-white rounded-md h-11 w-24 ml-2 flex items-center justify-center text-white text-lg shadow-sm shadow-white'>
            {transaction?.date ? moment(transaction?.date).format('HH:mm') : ''}
          </div>
        </div>
      </div>
      {(!transaction || transaction?.paidStatus === 'processing' || transaction?.paidStatus === 'pending') && (
        <div className="flex mt-2">
          <ClockLoader size={20} color='white' />
          <div className="text-white ml-2 items-center">{transaction?.message || 'Processing...'}</div>
        </div>
      )}
      {transaction?.paidStatus === 'error' && (
        <div className='text-red-400 mt-2'>{transaction.message}</div>
      )}
      {transaction?.paidStatus === 'paid' && (
        <div className='text-green-500 mt-2'>{transaction.message}</div>
      )}
      {transaction?.paidStatus === 'error' && (
        <button
          onClick={() => onRetry()}
          className={`mt-4 text-lg text-center w-full rounded-md h-12 border-2 border-white flex items-center justify-center bg-white text-black`}
        >
          Retry
        </button>
      )}
    </div>
  </div>
}