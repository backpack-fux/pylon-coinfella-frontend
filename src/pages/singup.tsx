import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import DatePicker from "react-datepicker";
import FadeLoader from 'react-spinners/FadeLoader';
import PhoneInput from 'react-phone-number-input';

import { useCheckout } from "../context/checkout";
import { useAgreement } from "../context/agreement";
import { GET_AGREEMENT_LINK } from "../utils/graphql";
import { stateList } from "../constants/state";

export const CoinFellaSignup = () => {
  const { checkoutInfo, onCreateAccount, isLoading, loadingMessage } = useCheckout()
  const { values, touched, errors, setFieldValue, setFieldTouched } = checkoutInfo
  const { signedAgreementId, openAgreement } = useAgreement()
  const [isGetAgreementLink, setIsGetAgreementLink] = useState(false)
  const { data: agreementLinkRes } = useQuery(GET_AGREEMENT_LINK, {
    skip: !isGetAgreementLink
  })
  const agreementLink = useMemo(() => agreementLinkRes?.agreementLink, [agreementLinkRes])
  const isValid = useMemo(() =>
    !errors.firstName &&
    !errors.lastName &&
    !errors.dob &&
    !errors.userEmail &&
    !errors.userPhoneNumber &&
    !errors.ssn &&
    !errors.streetAddress &&
    !errors.city &&
    !errors.state &&
    !errors.postalCode &&
    !!values.firstName &&
    !!values.lastName &&
    !!values.dob &&
    !!values.userEmail &&
    !!values.userPhoneNumber &&
    !!values.ssn &&
    !!values.streetAddress &&
    !!values.city &&
    !!values.state &&
    !!values.postalCode &&
    !!values.signedAgreementId
    , [values, errors])

  const onGetAgreementLink = () => {
    if (signedAgreementId) {
      return
    }

    if (agreementLink) {
      openAgreement(agreementLink)
    } else {
      setIsGetAgreementLink(true)
    }
  }

  useEffect(() => {
    setFieldValue('signedAgreementId', signedAgreementId)
  }, [signedAgreementId, setFieldValue])

  useEffect(() => {
    if (agreementLink && !signedAgreementId) {
      openAgreement(agreementLink)
    }
  }, [agreementLink])

  return <div className="relative pt-3">
    <h3 className="text-white text-xl">Register</h3>
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
            value={values.userEmail}
            type="email"
            onBlur={() => setFieldTouched('userEmail', true)}
            onChange={(e) => setFieldValue('userEmail', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="sam@gmail.com"
          />
          {touched.userEmail && errors.userEmail && <div className='text-red-400 text-[12px] text-left'>{errors.userEmail}</div>}
        </div>
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Mobile Number</p>
          <div className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300">
            <PhoneInput
              defaultCountry="US"
              placeholder="(123) 456-7890"
              autoComplete="off"
              className="placeholder-gray-300"
              onBlur={() => setFieldTouched('userPhoneNumber', true)}
              value={values.userPhoneNumber}
              onChange={(e) => setFieldValue('userPhoneNumber', e)}
            />
          </div>
          {touched.userPhoneNumber && errors.userPhoneNumber && <div className='text-red-400 text-[12px] text-left'>{errors.userPhoneNumber}</div>}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">Date of Birth</p>
          <DatePicker
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            selected={values.dob}
            showMonthDropdown={true}
            showYearDropdown={true}
            placeholderText="09/28/1993"
            openToDate={new Date("1993/09/28")}
            onBlur={() => setFieldTouched('dob', true)}
            onChange={(date) => setFieldValue('dob', date)}
          />
          {touched.dob && errors.dob && <div className='text-red-400 text-[12px] text-left'>{errors.dob}</div>}
        </div>
        <div className="flex-1">
          <p className="text-gray-200 text-md text-left mb-2">SSN</p>
          <input
            value={values.ssn}
            onBlur={() => setFieldTouched('ssn', true)}
            onChange={(e) => setFieldValue('ssn', e.target.value)}
            className="outline-none border-2 border-gray-300 rounded-md h-11 w-full flex items-center justify-center text-white text-lg shadow-sm bg-transparent p-2 placeholder-gray-300"
            placeholder="123-45-6789"
          />
          {touched.ssn && errors.ssn && <div className='text-red-400 text-[12px] text-left'>{errors.ssn}</div>}
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
				className="bg-transparent text-lg outline-none w-full"
				>
				<option value="" className="text-gray-400">State</option>
				{stateList.map((state) => (
					<option key={state.value} value={state.value}>{state.value}</option>
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
      <label className="text-white text-xs mt-5 cursor-pointer select-none">
        <input className="checkbox" style={{ marginTop: 0 }} type="checkbox" checked={!!values.signedAgreementId} onClick={() => onGetAgreementLink()} />
        Click here to review and accept <span className="text-pink-500">Bridge terms of service (TOS)</span>.
      </label>
      {touched.isConfirmedPurchase && errors.isConfirmedPurchase && <div className='text-red-400 text-[12px] text-left'>{errors.isConfirmedPurchase}</div>}

      <button
        onClick={() => isValid && onCreateAccount()}
        className={`mt-4 text-lg text-center w-full rounded-md h-12 border-2 border-white flex items-center justify-center ${isValid ? 'bg-white text-black' : 'text-gray-300'}`}
      >
        <div className="flex items-center">
          Create Your Account
        </div>
      </button>

      {isLoading && (
        <div className="absolute w-full h-full bg-white/10 flex flex-col items-center justify-center top-0">
          <FadeLoader color="white" />
          <div className='mt-2 text-white'>{loadingMessage}</div>
        </div>
      )}
    </div>
  </div>
}