import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';

import { useCheckout } from "../context/checkout";
import { stateList } from "../constants/state";

export const CoinFellaInformation = () => {
  const navigate = useNavigate();

  const { checkoutInfo } = useCheckout()
  const { values, touched, errors, setFieldValue, setFieldTouched } = checkoutInfo

  const isInValid = useMemo(() => {
    return errors.firstName ||
      errors.lastName ||
      errors.email ||
      errors.phoneNumber ||
      errors.country ||
      errors.state ||
      errors.postalCode ||
      errors.city ||
      errors.streetAddress ||
      errors.walletAddress ||
      !values.firstName ||
      !values.lastName ||
      !values.email ||
      !values.phoneNumber ||
      !values.country ||
      !values.state ||
      !values.postalCode ||
      !values.city ||
      !values.streetAddress ||
      !values.walletAddress
  }, [errors, values])

  return <div className="pt-3">
    <h3 className="text-white text-xl">Information</h3>
    <div className="border-b-2 border-gray-300 mt-4 mb-5"></div>
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">First Name</p>
          <input
            value={values.firstName}
            onBlur={() => setFieldTouched('firstName', true)}
            onChange={(e) => setFieldValue('firstName', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="Sam"
          />
          {touched.firstName && errors.firstName && <div className='text-red-400 text-[12px] text-left'>{errors.firstName}</div>}
        </div>
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Last Name</p>
          <input
            value={values.lastName}
            onBlur={() => setFieldTouched('lastName', true)}
            onChange={(e) => setFieldValue('lastName', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="Smith"
          />
          {touched.lastName && errors.lastName && <div className='text-red-400 text-[12px] text-left'>{errors.lastName}</div>}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Email</p>
          <input
            value={values.email}
            type="email"
            onBlur={() => setFieldTouched('email', true)}
            onChange={(e) => setFieldValue('email', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="sam@gmail.com"
          />
          {touched.email && errors.email && <div className='text-red-400 text-[12px] text-left'>{errors.email}</div>}
        </div>
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Mobile Number</p>
          <div className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300">
            <PhoneInput
              defaultCountry="US"
              placeholder="(123) 456-7890"
              autoComplete="off"
              className="placeholder-gray-300"
              onBlur={() => setFieldTouched('phoneNumber', true)}
              value={values.phoneNumber}
              onChange={(e) => setFieldValue('phoneNumber', e)}
            />
          </div>
          {touched.phoneNumber && errors.phoneNumber && <div className='text-red-400 text-[12px] text-left'>{errors.phoneNumber}</div>}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Country</p>
          <input
            value={values.country}
            disabled
            onBlur={() => setFieldTouched('country', true)}
            onChange={(e) => setFieldValue('country', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="USA"
          />
          {touched.country && errors.country && <div className='text-red-400 text-[12px] text-left'>{errors.country}</div>}
        </div>
		<div className="flex-1">
			<p className="text-gray-200 text-md text-left mb-2">State</p>
			<div className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2">
				<select
				value={values.state}
				onBlur={() => setFieldTouched('state', true)}
				onChange={(e) => setFieldValue('state', e.target.value)}
				className="bg-transparent placeholder-white text-lg outline-none w-full"
				>
				<option value="" className="text-gray-400">Select State</option>
				{stateList.map((state) => (
					<option key={state.value} value={state.value}>{state.label}</option>
				))}
			</select>
		</div>
		{touched.state && errors.state && <div className='text-red-400 text-[12px] text-left'>{errors.state}</div>}
		</div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Postal Code</p>
          <input
            value={values.postalCode}
            onBlur={() => setFieldTouched('postalCode', true)}
            onChange={(e) => setFieldValue('postalCode', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="10001"
          />
          {touched.postalCode && errors.postalCode && <div className='text-red-400 text-[12px] text-left'>{errors.postalCode}</div>}
        </div>
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">City</p>
          <input
            value={values.city}
            onBlur={() => setFieldTouched('city', true)}
            onChange={(e) => setFieldValue('city', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="San Francisco"
          />
          {touched.city && errors.city && <div className='text-red-400 text-[12px] text-left'>{errors.city}</div>}
        </div>
      </div>
      <div className="flex">
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Address</p>
          <input
            value={values.streetAddress}
            onBlur={() => setFieldTouched('streetAddress', true)}
            onChange={(e) => setFieldValue('streetAddress', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="100 King Street"
          />
          {touched.streetAddress && errors.streetAddress && <div className='text-red-400 text-[12px] text-left'>{errors.streetAddress}</div>}
        </div>
      </div>
      <button
        onClick={() => !isInValid && navigate('../payment')}
        className={`mt-4 text-lg text-center w-full rounded-md h-12 border-2 border-white flex items-center justify-center ${!isInValid ? 'bg-white text-black' : 'text-gray-300'}`}
      >
        <div className="flex items-center">
          Next
        </div>
      </button>
    </div>
  </div>
}