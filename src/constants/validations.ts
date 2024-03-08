import * as yup from 'yup';

const blacklistedBins = [
    '409758', '410039', '422967', '435880', '438857', '440393', 
    '444607', '469497', '485932', '485953', '486014', '511332', 
    '511786', '512230', '515307', '515676', '516648', '517148', 
    '517805', '517975', '518725', '518941', '521267', '521876', 
    '523081', '525363', '525475', '532839', '534636', '540324', 
    '542418', '542418',  '545958', '546325', '546616', '548042', 
    '549345', '552433', '558341'
];
const acceptableBrands = ['Visa', 'Mastercard'];

export const checkoutValidationSchema = yup.object().shape({
  walletAddress: yup.string().required('Wallet Address is required'),
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().required('Email is required').email('Email is invalid'),
  phoneNumber: yup.string().required('Phone Number is required'),
  userEmail: yup.string().email('Email is invalid'),
  userPhoneNumber: yup.string(),
  country: yup.string().optional(),
  postalCode: yup.string().required('Postal Code is required'),
  ssn: yup.string().matches(/^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/, 'SSN is invalid'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  streetAddress: yup.string().required('Street Address is required'),
  streetAddress2: yup.string().optional(),
  isValidCard: yup.boolean().isTrue('The card info is invalid'),
  cost: yup.number().required('The cost is required').positive().min(1, 'The cost must be greater than $1'),
  tipAmount: yup.number().positive('The tip amount must be positive'),
  tipType: yup.string(),
  isConfirmedPurchase: yup.boolean().isTrue('Please confirm for purchasing'),
  cardBrand: yup.string().test('check-bin', 'We accept Visa/Mastercard debit/credit', function (value) {
    if (!value) {
      return true
    }

    return acceptableBrands.includes(value)
  }),
  cardBin: yup.string().test('check-bin', 'The issuer of this card is not supported', function (value) {
    const bin = value?.substring(0, 6) || '';
    return !blacklistedBins.includes(bin);
  })
})
