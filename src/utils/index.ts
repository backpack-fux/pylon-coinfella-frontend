import { CheckoutInfo } from "../types/checkout.type";

export const calcTip = (checkoutInfo: CheckoutInfo) => {
  if (!checkoutInfo.tipAmount) {
    return 0;
  }

  if (checkoutInfo.tipType === "cash") {
    return Number(checkoutInfo.tipAmount);
  }

  return checkoutInfo.cost
    ? (Number(checkoutInfo.cost) * Number(checkoutInfo.tipAmount || 0)) / 100
    : 0;
};

export const calcFee = (checkoutInfo: CheckoutInfo) => {
  if (!checkoutInfo.fee) {
    return 0;
  }

  if (checkoutInfo.feeType === "cash") {
    return Number(checkoutInfo.fee);
  }

  return checkoutInfo.cost
    ? (Number(checkoutInfo.cost) * Number(checkoutInfo.fee || 0)) / 100
    : 0;
};
