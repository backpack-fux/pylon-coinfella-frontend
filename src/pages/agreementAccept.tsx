import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const AgreementAccept = () => {
  let [searchParams] = useSearchParams();
  const subSignedAgreementId = useMemo(() => searchParams.get('signed_agreement_id'), [searchParams])

  useEffect(() => {
    if (subSignedAgreementId) {
      if (window.opener) {
        window.opener.dispatchEvent(new CustomEvent("signed_agreement_id", {
          detail: {
            signed_agreement_id: subSignedAgreementId
          }
        }))
      }
    }
  }, [subSignedAgreementId])

  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      if (subSignedAgreementId) {
        window.close()
      }
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

  return <></>
}