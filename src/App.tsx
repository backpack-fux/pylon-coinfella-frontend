import React from 'react';
import './App.css';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "react-multi-carousel/lib/styles.css";
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './services';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/auth';
import { KycSuccess } from './pages/kycSucess';
import { AgreementAccept } from './pages/agreementAccept';
import { KybSuccess } from './pages/kybSucess';
import { CheckoutProvider } from './context/checkout';
import { CoinFella } from './pages';

function App() {

  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <CheckoutProvider>
            <Routes>
              <Route path='/kyc-success' element={<KycSuccess />} />
              <Route path='/kyb-success/:partnerId' element={<KybSuccess />} />
              <Route path='/agreement-accept' element={<AgreementAccept />} />
              <Route path='/*' element={<CoinFella />} />
            </Routes>
          </CheckoutProvider>
          <ToastContainer />
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
