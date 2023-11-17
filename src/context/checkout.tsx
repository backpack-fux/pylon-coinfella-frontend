import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import moment from 'moment-timezone';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { FormikProps, useFormik } from 'formik';
import { toast } from 'react-toastify';

import { useAuth } from './auth';
import { useWindowFocus } from '../uses/useWindowFocus';
import {
  CREATE_ACCOUNT,
  CREATE_CHECKOUT,
  CREATE_CHECKOUT_WITHOUT_USER,
  GET_CHECKOUT,
  GET_CHECKOUT_REQUEST,
  GET_KYC_LINK,
  GET_USER,
  GET_USER_KYC_LINK,
  SUBSCRIPTION,
} from '../utils/graphql';
import { CheckoutInfo } from '../types/checkout.type';
import { checkoutValidationSchema } from '../constants/validations';

const config: {
  fee: number
  feeType: 'percent' | 'cash'
  feeMethod: number
  tipType: 'percent' | 'cash'
} = {
  fee: 6.5,
  feeType: 'percent',
  feeMethod: 1,
  tipType: 'percent'
}

interface CheckoutContextProps {
  user?: any;
  checkoutRequest?: any
  checkoutInfo: FormikProps<CheckoutInfo>;
  checkout?: any;
  checkoutError?: any;
  transaction?: any;
  isLoading: boolean;
  isProcessingKyc: boolean;
  loadingMessage?: string;
  onCreateAccount: () => void;
  onProcessKyc: () => void;
  setRequestId: (value: string | undefined) => void;
  onSetUser: (value: any) => void;
}

const CheckoutContext = createContext<CheckoutContextProps>({
  checkoutInfo: {} as FormikProps<CheckoutInfo>,
  isLoading: false,
  isProcessingKyc: false,
  onCreateAccount: () => { },
  onProcessKyc: () => { },
  setRequestId: (value: string | undefined) => { },
  onSetUser: (value: any) => { }
});

export const useCheckout = () => {
  const context = useContext(CheckoutContext);

  return context;
};

export const CheckoutProvider = (props: {
  children: React.ReactNode
}) => {
  const refreshUserRef = useRef<any>()
  const { user: authUser, refreshUser } = useAuth()
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>()
  let [searchParams, setSearchParams] = useSearchParams();

  const storedCheckoutId = useMemo(() => searchParams.get('id'), [searchParams])
  const [checkout, setCheckout] = useState<any>()
  const [transaction, setTransaction] = useState<any>();
  const [isProcessingKyc, setIsKycProcessing] = useState(false)
  const [user, setUser] = useState<any>();
  const { isWindowFocused } = useWindowFocus()
  const { data: userRes, refetch: getUser } = useQuery(GET_USER, {
    variables: {
      userId: user?.id
    },
    skip: !user?.id
  })

  const { data: checkoutRequest, error: checkoutRequestError, refetch: refreshCheckoutRequest } = useQuery(GET_CHECKOUT_REQUEST, {
    variables: {
      id: checkoutRequestId
    },
    skip: !checkoutRequestId
  })
  const [createCheckout, { data: checkoutResponse, loading: loadingCheckout, error: errorCheckout, reset: resetCheckout }] = useMutation(CREATE_CHECKOUT);
  const [createCheckoutWithoutUser, { data: checkoutWithoutUserRes, loading: loadingCheckoutWithout, error: errorCheckoutWithoutUser }] = useMutation(CREATE_CHECKOUT_WITHOUT_USER);
  const [createAccount, { data: createAccountResponse, loading: isCreatingAccount, error: createAccountError }] = useMutation(CREATE_ACCOUNT)
  const { data: checkoutData, refetch: refetchCheckout } = useQuery(GET_CHECKOUT, {
    variables: {
      id: storedCheckoutId
    },
    skip: !storedCheckoutId || !!checkoutRequestId
  })
  const { data: kycLinkRes, loading: isGettingKycLink, error: kycError } = useQuery(authUser ? GET_KYC_LINK : GET_USER_KYC_LINK, {
    skip: !isProcessingKyc,
    variables: {
      userId: user?.id
    }
  })

  const kycLink = useMemo(() => kycLinkRes?.kycLink, [kycLinkRes])
  const checkoutError = useMemo(() => errorCheckout || errorCheckoutWithoutUser, [errorCheckout, errorCheckoutWithoutUser])
  const checkoutId = useMemo(() => checkout?.id, [checkout])
  const isCheckingOut = useMemo(() => loadingCheckout || loadingCheckoutWithout, [loadingCheckout, loadingCheckoutWithout])
  const { data: transactionResponse } = useSubscription(SUBSCRIPTION, {
    variables: {
      id: checkoutId,
      type: "TRANSACTION_STATUS"
    },
    shouldResubscribe: isWindowFocused,
    skip: !checkoutId || !isWindowFocused
  })

  const setRequestId = useCallback((value: string | undefined) => {
    setCheckoutRequestId(value)
  }, [])

  const onSetUser = useCallback((value: string) => {
    setUser(value)
  }, [])

  const onSubmitForm = (data: CheckoutInfo) => {
    if (authUser) {
      createCheckout({
        variables: {
          data: {
            checkoutTokenId: data.token,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            amount: Number(data.cost),
            tip: data.tipAmount ? Number(data.tipAmount) : 0,
            tipType: data.tipType,
            fee: data.fee,
            feeType: data.feeType,
            feeMethod: data.feeMethod,
            streetAddress: data.streetAddress,
            streetAddress2: data.streetAddress2 || undefined,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country || undefined,
            walletAddress: data.walletAddress,
            checkoutRequestId,
          }
        }
      })
    } else {
      createCheckoutWithoutUser({
        variables: {
          data: {
            checkoutTokenId: data.token,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            amount: Number(data.cost),
            tip: data.tipAmount ? Number(data.tipAmount) : 0,
            tipType: data.tipType,
            fee: data.fee,
            feeType: data.feeType,
            feeMethod: data.feeMethod,
            streetAddress: data.streetAddress,
            streetAddress2: data.streetAddress2 || undefined,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country || undefined,
            walletAddress: data.walletAddress,
            checkoutRequestId,
            userId: user?.id
          }
        }
      })
    }
  }

  const checkoutInfo = useFormik<CheckoutInfo>({
    initialValues: {
      cost: '',
      tipAmount: '',
      tipType: config.tipType,
      fee: config.fee,
      feeType: config.feeType,
      feeMethod: config.feeMethod,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      streetAddress: '',
      streetAddress2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
      isValidCard: false,
      isConfirmedPurchase: false,
      walletAddress: '',
      token: '',
      auth: 'login',
      userEmail: '',
      userPhoneNumber: '',
      signedAgreementId: '',
      cardBin: '',
      cardBrand: '',
    },
    validateOnBlur: true,
    validateOnChange: true,
    validationSchema: checkoutValidationSchema,
    onSubmit: onSubmitForm
  });
  const { values, setFieldValue } = checkoutInfo

  useEffect(() => {
    if (checkoutError) {
      toast.error(checkoutError.message)
      setFieldValue('isValidCard', false)
      setFieldValue('token', '')
      setFieldValue('cardBrand', '')
      setFieldValue('cardBin', '')
      resetCheckout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutError, setFieldValue])

  useEffect(() => {
    if (kycError) {
      toast.error(kycError.message)
      setIsKycProcessing(false)
    }
  }, [kycError])

  useEffect(() => {
    if (transaction?.paidStatus === 'error') {
      toast.error(transaction.message)
    }
  }, [transaction])

  useEffect(() => {
    if (createAccountResponse?.createUser) {
      localStorage.setItem('auth_token', createAccountResponse?.createUser?.token)
      if (window.parent) {
        window.parent.postMessage(JSON.stringify({
          type: 'account',
          action: 'create',
          data: createAccountResponse.createUser
        }), "*");
      }
      setUser(createAccountResponse?.createUser)
      refreshUser()
    }
  }, [createAccountResponse])

  useEffect(() => {
    if (transaction?.paidStatus === 'paid') {
      toast.success(transaction.message)
    }
  }, [transaction])


  useEffect(() => {
    if (checkoutRequestError) {
      toast.error(checkoutRequestError.message)
    }
  }, [checkoutRequestError])

  useEffect(() => {
    setFieldValue('firstName', checkoutData?.checkout?.firstName || checkoutRequest?.checkoutRequest?.firstName || user?.firstName || '', false)
    setFieldValue('lastName', checkoutData?.checkout?.lastName || checkoutRequest?.checkoutRequest?.lastName || user?.lastName || '', false)
    setFieldValue('email', checkoutData?.checkout?.email || checkoutRequest?.checkoutRequest?.email || user?.email || '', false)
    setFieldValue('phoneNumber', checkoutData?.checkout?.phoneNumber || checkoutRequest?.checkoutRequest?.phoneNumber || user?.phoneNumber || '', false)
    setFieldValue('streetAddress', checkoutData?.checkout?.streetAddress || checkoutRequest?.checkoutRequest?.streetAddress || user?.streetAddress || '', false)
    setFieldValue('streetAddress2', checkoutData?.checkout?.streetAddress2 || checkoutRequest?.checkoutRequest?.streetAddress2 || user?.streetAddress2 || '', false)
    setFieldValue('city', checkoutData?.checkout?.city || checkoutRequest?.checkoutRequest?.city || user?.city || '', false)
    setFieldValue('state', checkoutData?.checkout?.state || checkoutRequest?.checkoutRequest?.state || user?.state || '', false)
    setFieldValue('postalCode', checkoutData?.checkout?.postalCode || checkoutRequest?.checkoutRequest?.postalCode || user?.postalCode || '', false)
    setFieldValue('country', checkoutData?.checkout?.country || checkoutRequest?.checkoutRequest?.country || user?.country || 'USA', false)
    setFieldValue('cost', checkoutData?.checkout?.amount || checkoutRequest?.checkoutRequest?.amount, false)
    setFieldValue('tipAmount', checkoutData?.checkout?.tip || checkoutRequest?.checkoutRequest?.tip, false)
    setFieldValue('tipType', checkoutData?.checkout?.tipType || checkoutRequest?.checkoutRequest?.tipType || config.tipType, false)
    setFieldValue('fee', checkoutData?.checkout?.fee || checkoutRequest?.checkoutRequest?.fee || config.fee, false)
    setFieldValue('feeType', checkoutData?.checkout?.feeType || checkoutRequest?.checkoutRequest?.feeType || config.feeType, false)
    setFieldValue('feeMethod', checkoutData?.checkout?.feeMethod || checkoutRequest?.checkoutRequest?.feeMethod || config.feeMethod, false)
    setFieldValue('password', '', false)
  }, [checkoutRequest, checkoutData, user, setFieldValue])

  useEffect(() => {
    if (createAccountError) {
      toast.error(createAccountError.message)
    }
  }, [createAccountError])

  const onCreateAccount = useCallback(() => {
    createAccount({
      variables: {
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.userEmail,
          phoneNumber: values.userPhoneNumber,
          password: values.password,
          gender: values.gender || 'male',
          dob: moment(values.dob).format('YYYY-MM-DD'),
          ssn: values.ssn,
          streetAddress: values.streetAddress,
          streetAddress2: values.streetAddress2,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
          signedAgreementId: values.signedAgreementId,
        }
      }
    })
  }, [values, createAccount])

  const onProcessKyc = useCallback(() => {
    setIsKycProcessing(true)
  }, [])

  const onRefreshUser = () => {
    if (authUser) {
      refreshUser()
    } else if (user) {
      getUser()
    }
  }

  // KYC PROCESS Start
  useEffect(() => {
    if (refreshUserRef.current) {
      clearInterval(refreshUserRef.current)
    }

    if (isProcessingKyc) {
      refreshUserRef.current = setInterval(() => onRefreshUser(), 5000)
    }
  }, [isProcessingKyc])

  useEffect(() => {
    if (isProcessingKyc && kycLink) {
      window.open(kycLink, '_blank')
    }
  }, [isProcessingKyc, kycLink])

  useEffect(() => {
    if (user?.isVerified) {
      setIsKycProcessing(false)
    }
  }, [user])

  useEffect(() => {
    setUser(authUser)
  }, [authUser])

  useEffect(() => {
    if (userRes?.user) {
      setUser(userRes.user)
    }
  }, [userRes])

  // KYC PROCESS End

  useEffect(() => {
    if (checkout && checkout?.id !== storedCheckoutId) {
      setSearchParams({
        id: checkout.id
      })
    }
  }, [checkout])

  useEffect(() => {
    if (checkoutResponse?.createCheckout) {
      setCheckout(checkoutResponse?.createCheckout)
    }
  }, [checkoutResponse])

  useEffect(() => {
    if (checkoutWithoutUserRes?.createCheckoutWithoutUser) {
      setCheckout(checkoutWithoutUserRes?.createCheckoutWithoutUser)
    }
  }, [checkoutWithoutUserRes])

  useEffect(() => {
    if (checkoutData?.checkout) {
      setCheckout(checkoutData?.checkout)
    }
  }, [checkoutData])

  useEffect(() => {
    if (checkoutRequest?.checkoutRequest?.checkout) {
      setCheckout(checkoutRequest?.checkoutRequest?.checkout)
    }
  }, [checkoutRequest])

  useEffect(() => {
    if (checkout?.transaction) {
      setTransaction(checkout?.transaction)
    }
  }, [checkout])

  useEffect(() => {
    setTransaction(transactionResponse?.subscription?.payload)
  }, [transactionResponse])

  useEffect(() => {
    if (['settled', 'error'].includes(transaction?.status)) {
      return
    }
    if (isWindowFocused) {
      if (checkoutRequestId) {
        refreshCheckoutRequest()
      } else {
        refetchCheckout()
      }
    }
  }, [isWindowFocused, storedCheckoutId])

  const isLoading = useMemo(() => isProcessingKyc || isCreatingAccount || isCheckingOut || isGettingKycLink, [isProcessingKyc, isCreatingAccount, isCheckingOut, isGettingKycLink])
  const loadingMessage = useMemo(() => {
    if (isCreatingAccount) return 'Creating account...'
    if (isGettingKycLink) return 'Generating KYC link...'
    if (isProcessingKyc) return 'Processing KYC...'
    if (isCheckingOut) return 'Sending request...'
    return
  }, [isProcessingKyc, isCreatingAccount, isCheckingOut, isGettingKycLink])

  const value = useMemo(() => ({
    user,
    checkoutRequestId,
    checkoutRequest,
    checkoutInfo,
    checkout,
    checkoutError,
    transaction,
    loadingMessage,
    isLoading,
    isProcessingKyc,
    onCreateAccount,
    onProcessKyc,
    setRequestId,
    onSetUser,
  }), [
    user,
    checkoutRequestId,
    checkoutInfo,
    checkout,
    checkoutError,
    transaction,
    isLoading,
    isProcessingKyc,
    loadingMessage,
    checkoutRequest,
    onSetUser,
    onCreateAccount,
    onProcessKyc,
    setRequestId
  ])

  return (
    <CheckoutContext.Provider
      value={value}>
      {props.children}
    </CheckoutContext.Provider>
  );
};
