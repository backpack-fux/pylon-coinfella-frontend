import { Navigate, Route, Routes } from "react-router-dom";
import { useCheckout } from "../context/checkout";
import { CoinFellaKYC } from "./kyc";
import { CoinFellaSignup } from "./signup";

export const CoinFellaSignupRouter = () => {
  const { user } = useCheckout()

  return <Routes>
    <Route path="/*" element={user ? <Navigate to={"../kyc"} replace /> : <CoinFellaSignup />} />
    <Route path="/kyc" element={!user ? <Navigate to={"../"} replace /> : <CoinFellaKYC />} />
  </Routes>
}