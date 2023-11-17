import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const KybSuccess = () => {
  const { partnerId } = useParams();

  const processComplete = useCallback(() => {
    if (!partnerId) {
      return
    }

    axios.post(`${process.env.REACT_APP_API_URL}/partners/kyb_success/${partnerId}`)
  }, [partnerId])

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
    processComplete()
  }, [processComplete])
  return <></>
}