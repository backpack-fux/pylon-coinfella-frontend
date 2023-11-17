import React, { useEffect, useState } from "react";

export const useAgreement = () => {
  const [signedAgreementId, setSignedAgreementId] = useState<string>()

  const openAgreement = (url: string) => {
    setSignedAgreementId('')

    const subWindow = window.open(`${url}&redirect_uri=${window.origin}/agreement-accept`, '', 'width=600,height=400,left=200,top=200');

    if (subWindow) {
      subWindow.opener = window;
    }
  }

  const handleMessage = (event: any) => {
    const res = event?.detail?.signed_agreement_id

    if (!res) {
      return
    }

    setSignedAgreementId(res)
  }

  useEffect(() => {
    window.addEventListener('signed_agreement_id', handleMessage);

    return () => {
      // Clean up event listener when component unmounts
      window.removeEventListener('signed_agreement_id', handleMessage);
    };
  }, [])

  return {
    signedAgreementId,
    openAgreement,
  };
}