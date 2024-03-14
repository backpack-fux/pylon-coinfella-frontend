import { CardNumber, Cvv, ExpiryDate, Frames } from 'frames-react';
import { useEffect, useRef, useState } from "react";
import ClockLoader from 'react-spinners/ClockLoader';

import { useCheckout } from "../context/checkout";
import { checkoutConfig } from "../utils/checkout";

export const CoinFellaPayment = () => {
  const ref = useRef<any>()
  const [isLoading, setIsLoading] = useState(false);

  const { checkoutInfo } = useCheckout()
  const { values, touched, errors, setFieldValue, setFieldTouched, isValid, submitForm } = checkoutInfo

  const onSubmit = () => {
    if (!isValid || isLoading) {
      return
    }

    Frames.submitCard()
    setIsLoading(true)
  }

  const onChangeTip = (value: string, type: 'percent' | 'cash') => {
    if (!setFieldValue) {
      return
    }

    setFieldValue('tipType', type);

    const tipAmount = values.tipAmount === value ? '' : value
    setFieldValue('tipAmount', tipAmount)
  }

  const onCardValidationChanged = (e: any) => {
    setFieldTouched('isValidCard', true, false)
    setFieldValue('isValidCard', e.isValid)
  }

  const onChangeCardBin = (e: any) => {
    setFieldTouched('cardBin', true, false)
    setFieldValue('cardBin', e.bin)
  }

  const onPaymentMethodChanged = (e: any) => {
    setFieldTouched('cardBrand', true, false)
    setFieldValue('cardBrand', e.paymentMethod)
  }

  const onGenerateTokenFailed = (e: any) => {
    Frames.init(checkoutConfig)
    setFieldValue('isValidCard', false)
    setFieldValue('token', '')
    setIsLoading(false)
  }

  const onGenerate = (e: any) => {
    setFieldValue('token', e.token);
  }

  useEffect(() => {
    if (values.isValidCard && values.token && isLoading) {
      submitForm()
      setIsLoading(false)
    }
  }, [values, submitForm, isLoading])



  return <div className="pt-3">
    <h3 className="text-white text-xl">Payment</h3>
    <div className="border-b-2 border-gray-300 mt-4 mb-5"></div>
    <div className="flex flex-col gap-2">
      <Frames
        ref={ref}
        config={{
          ...checkoutConfig,
          localization: {
            cardNumberPlaceholder: '1234 5678 9101 1121',
            expiryMonthPlaceholder: 'MM',
            expiryYearPlaceholder: 'YY',
            cvvPlaceholder: '123',
          },
          style: {
            ...checkoutConfig.style,
            placeholder: {
              base: {
                color: '#d1d5db'
              }
            }
          }
        }}
        cardTokenized={onGenerate}
        paymentMethodChanged={onPaymentMethodChanged}
        cardValidationChanged={onCardValidationChanged}
        cardTokenizationFailed={onGenerateTokenFailed}
        cardBinChanged={onChangeCardBin}
      >
        <div>
          <p className="text-gray-200 text-md text-left mb-2">Card Number</p>
          <div className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300">
            <CardNumber className="w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <p className="text-gray-200 text-md text-left mb-2">Expiration Date</p>
            <div className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300">
              <ExpiryDate className="w-full" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-200 text-md text-left mb-2">CVV</p>
            <div className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300">
              <Cvv
                className="w-full"
                onBlur={() => setFieldTouched('cvv', true)}
                onChange={(e) => setFieldValue('cvv', e)} />
            </div>
          </div>
        </div>
      </Frames>
      {touched.cardBrand && errors.cardBrand ? <div className='text-red-400 text-[12px] text-left'>{errors.cardBrand}</div>
        : touched.cardBin && errors.cardBin ? <div className='text-red-400 text-[12px] text-left'>{errors.cardBin}</div>
          : touched.isValidCard && errors.isValidCard && <div className='text-red-400 text-[12px] text-left'>{errors.isValidCard}</div>}
      <div className="flex mt-6">
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Add a tip?</p>
          <div className="flex gap-4">
            <div
              className={`cursor-pointer border-2 border-gray-300 rounded-md h-11 w-14 flex items-center justify-center text-lg shadow-sm placeholder-gray-300 ${values.tipType === 'percent' && values.tipAmount === '5' ? 'bg-white text-black' : 'bg-transparent text-white'}`}
              onClick={() => onChangeTip('5', 'percent')}
            >5%</div>
            <div
              className={`cursor-pointer border-2 border-gray-300 rounded-md h-11 w-14 flex items-center justify-center text-lg shadow-sm p-2 placeholder-gray-300 ${values.tipType === 'percent' && values.tipAmount === '10' ? 'bg-white text-black' : 'bg-transparent text-white'}`}
              onClick={() => onChangeTip('10', 'percent')}
            >10%</div>
            <div
              className={`cursor-pointer border-2 border-gray-300 rounded-md h-11 w-14 flex items-center justify-center text-lg shadow-sm p-2 placeholder-gray-300 ${values.tipType === 'percent' && values.tipAmount === '15' ? 'bg-white text-black' : 'bg-transparent text-white'}`}
              onClick={() => onChangeTip('15', 'percent')}
            >15%</div>
            <div
              className={`flex-1 cursor-pointer border-2 border-gray-300 rounded-md h-11 flex items-center justify-center text-lg shadow-sm p-2 placeholder-gray-300 ${values.tipType === 'cash' ? 'border-white' : 'border-gray-300'}`}
            >
              <div className="mr-1 text-white">$</div>
              <input
                value={values.tipType === 'percent' ? '' : values.tipAmount}
                onChange={(e) => onChangeTip(e.target.value, 'cash')}
                type="number"
                onBlur={() => setFieldTouched('tipAmount', true)}
                className={`outline-none bg-transparent flex-1 placeholder-gray-300 text-white`}
                placeholder="Add Your Own"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 mb-2 text-left">
        <label className="text-white text-xs cursor-pointer select-none">
          <input className="checkbox" type="checkbox" checked={values.isConfirmedPurchase} onChange={(e) => setFieldValue('isConfirmedPurchase', e.target.checked)} />
          Confirm your intent to use <span className="text-pink-500">Visa / Mastercard</span> checkout by checking the signature box. You can view your customer rights by reviewing our <a onClick={(e) => e.stopPropagation()} className="text-purple-500 underline" href="https://backpack.network/terms-of-service" target="_blank">terms of service (TOS)</a> and <a onClick={(e) => e.stopPropagation()} className="text-purple-500 underline" href="https://backpack.network/privacy-policy" target="_blank">privacy policy (PP)</a>.
        </label>
        {touched.isConfirmedPurchase && errors.isConfirmedPurchase && <div className='text-red-400 text-[12px] text-left'>{errors.isConfirmedPurchase}</div>}
      </div>
      <button
        onClick={onSubmit}
        className={`mt-4 text-lg text-center w-full rounded-md h-12 border-2 border-white flex items-center justify-center ${(isValid || isLoading) ? 'bg-white text-black' : 'text-gray-300'}`}
      >
        <div className="flex items-center">
          {isLoading && <ClockLoader size={20} color='black' className="mr-2" />}
          Pay
        </div>
      </button>
    </div>
  </div>
}