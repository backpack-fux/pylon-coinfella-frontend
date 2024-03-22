import { FormikProps } from "formik";
import React, { useMemo, useState } from "react";
import { CheckoutInfo } from "./src/types/checkout.type";
import UsFlagImage from "../assets/images/us-flag.png";

interface Props extends FormikProps<CheckoutInfo> {
  onNext: () => void;
  checkoutRequestId?: string;
}

export const TipAndSubTotal = ({
  values,
  onNext,
  setFieldValue,
  errors,
  touched,
  setFieldTouched,
  checkoutRequestId,
}: Props) => {
  const [focusedCustomTip, setFocusedCustomTip] = useState(false);
  const isValid = useMemo(
    () => values.cost && !errors.cost && !errors.tipAmount,
    [errors, values]
  );

  return (
    <div className="widget-container">
      <h3 className="text-white text-4xl mb-10 text-center">Tip & Sub Total</h3>
      <p className="text-white text-lg text-left">Cost of Goods</p>
      <div className="flex w-full">
        <input
          value={values.cost}
          placeholder={"0.00"}
          autoComplete="off"
          name={checkoutRequestId ? "cost_off" : "cost"}
          disabled={!!checkoutRequestId}
          onBlur={() => setFieldTouched("cost", true)}
          onChange={(e) =>
            setFieldValue && setFieldValue("cost", e.target.value)
          }
          className="border-white outline-none border-2 rounded-md h-11 bg-transparent flex-1 text-white text-md text-right text-lg p-2 shadow-sm shadow-white"
        />
        <div className="border-2 border-white rounded-md h-11 w-24 ml-1 flex items-center justify-center text-white text-lg shadow-sm shadow-white">
          <img src={UsFlagImage} alt="" className="flag mr-2" />
          USD
        </div>
      </div>
      {touched.cost && errors.cost && (
        <div className="text-red-400 text-[12px] text-left">{errors.cost}</div>
      )}
      <div>
        <p className="text-white text-lg mt-4 text-left">+ Tip (optional)</p>
        <div className="mt-3 flex w-full justify-between items-center flex-wrap">
          {["10", "15", "20"].map((tipAmount) => (
            <div
              key={tipAmount}
              className="flex w-1/4 justify-end items-center"
            >
              <p className="text-white text-lg m-0 mr-5">
                {" "}
                {values.cost
                  ? ((Number(values.cost) * Number(tipAmount)) / 100).toFixed(2)
                  : ""}
              </p>
              <div
                className={`h-11 bg-white/50 text-white flex items-center justify-center w-24 rounded-md cursor-pointer shadow-md shadow-white ${
                  values.tipAmount === tipAmount
                    ? "bg-gradient-to-b from-purple-200 to-purple-400"
                    : ""
                }`}
                onClick={() =>
                  setFieldValue &&
                  setFieldValue(
                    "tipAmount",
                    values.tipAmount === tipAmount ? "" : tipAmount
                  )
                }
              >
                {tipAmount}%
              </div>
            </div>
          ))}
          <div className="mt-3 flex w-1/4 justify-end items-center">
            <p className="text-white text-lg m-0 mr-5">
              {" "}
              {values.cost &&
              values.tipAmount &&
              ![10, 15, 20].includes(Number(values.tipAmount))
                ? (
                    (Number(values.cost) * Number(values.tipAmount)) /
                    100
                  ).toFixed(2)
                : ""}
            </p>
            {focusedCustomTip ? (
              <input
                value={
                  [10, 15, 20].includes(Number(values.tipAmount))
                    ? undefined
                    : values.tipAmount
                }
                placeholder=""
                autoFocus
                onBlur={() => setFocusedCustomTip(false)}
                onChange={(e) =>
                  setFieldValue && setFieldValue("tipAmount", e.target.value)
                }
                className={`h-11 bg-white/50 text-center outline-none text-white flex items-center justify-center w-24 rounded-md cursor-pointer shadow-md shadow-white placeholder-white ${
                  values.tipAmount &&
                  !["10", "15", "20"].includes(values.tipAmount)
                    ? "bg-gradient-to-b from-purple-200 to-purple-400"
                    : ""
                }`}
              />
            ) : (
              <div
                className={`h-11 bg-white/50 text-white flex items-center justify-center w-24 rounded-md cursor-pointer shadow-md shadow-white ${
                  values.tipAmount &&
                  !["10", "15", "20"].includes(values.tipAmount)
                    ? "bg-gradient-to-b from-purple-200 to-purple-400"
                    : ""
                }`}
                onClick={() => setFocusedCustomTip(true)}
              >
                {values.tipAmount &&
                !["10", "15", "20"].includes(values.tipAmount)
                  ? `${values.tipAmount}%`
                  : "__%"}
              </div>
            )}
          </div>
          {touched.tipAmount && errors.tipAmount && (
            <div className="text-red-400 text-[12px] text-right mt-1">
              {errors.tipAmount}
            </div>
          )}
        </div>
        <p className="mt-2 text-white text-lg text-left">= Sub-Total</p>
        <div className="flex w-full">
          <div className="border-white border-2 rounded-md h-11 bg-transparent flex-1 text-white text-md text-right text-lg p-2 shadow-sm shadow-white">
            {values.cost
              ? (
                  Number(values.cost) +
                  (Number(values.cost) * Number(values.tipAmount || 0)) / 100
                ).toFixed(2)
              : ""}
          </div>
          <div className="border-2 border-white rounded-md h-11 w-24 ml-1 flex items-center justify-center text-white text-lg shadow-sm shadow-white">
            <img src={UsFlagImage} alt="" className="flag mr-2" />
            USD
          </div>
        </div>
        <button
          onClick={() => isValid && onNext()}
          className={`mt-4 text-white text-lg text-center w-full rounded-md h-11 border-2 border-white flex items-center justify-center shadow-md shadow-white ${
            isValid ? "bg-gradient-to-b from-purple-400 to-purple-600" : ""
          }`}
        >
          Get Total
        </button>
      </div>
    </div>
  );
};
