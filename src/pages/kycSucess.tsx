import { useMutation } from "@apollo/client";
import React, { useEffect, useMemo } from "react";
import { KYC_COMPLETED, USER_KYC_COMPLETED } from "../utils/graphql";
import { useSearchParams } from "react-router-dom";

export const KycSuccess = () => {
  const [params] = useSearchParams()
  const userId = useMemo(() => params.get('userId'), [params])
  const [createKycCompleted] = useMutation(userId ? USER_KYC_COMPLETED : KYC_COMPLETED, {
    variables: {
      userId
    }
  });


  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      window.close()
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  useEffect(() => {
    createKycCompleted()
  }, [])
  return <></>
}