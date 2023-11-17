import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCheckout } from "../context/checkout";
import { CoinFellaInformation } from "./info";
import { CoinFellaPayment } from "./payment";
import { CoinFellaTransaction } from "./transaction";

export const CoinFellaRequest = () => {
  const {
    setRequestId,
    checkout,
  } = useCheckout()
  const navigate = useNavigate()
  const { checkoutRequestId } = useParams();
  const location = useLocation();
  useEffect(() => {
    setRequestId(checkoutRequestId)
  }, [checkoutRequestId, setRequestId])

  useEffect(() => {
    if (checkout && !location?.pathname?.includes('/transaction')) {
      setTimeout(() => {
        navigate('./transaction')
      }, 500)
    }
  }, [checkout, navigate, location])

  return <Routes>
    <Route path="/info" element={<CoinFellaInformation />} />
    <Route path="/payment" element={<CoinFellaPayment />} />
    <Route path="/transaction" element={<CoinFellaTransaction />} />
    <Route
      path="/*"
      element={<Navigate to={"./info"} replace />}
    />
  </Routes>
}