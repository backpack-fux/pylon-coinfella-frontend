import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CoinFellaSignup } from "./singup";
import { useCheckout } from "../context/checkout";
import { CoinFellaKYC } from "./kyc";

export const CoinFellaSignupRouter = () => {
  const { user } = useCheckout()

  return <Routes>
    <Route path="/*" element={user ? <Navigate to={"../kyc"} replace /> : <CoinFellaSignup />} />
    <Route path="/kyc" element={!user ? <Navigate to={"../"} replace /> : <CoinFellaKYC />} />
  </Routes>
}