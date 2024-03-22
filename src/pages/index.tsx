import React, { useEffect, useMemo } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { CoinFellaRequest } from "./request";
import { CoinFellaSignupRouter } from "./signupRouter";
import { useCheckout } from "../context/checkout";
import { GET_USER } from "../utils/graphql";
import { useQuery } from "@apollo/client";
import { toast } from "react-toastify";

export const CoinFella = () => {
  const { onSetUser } = useCheckout();
  const [params] = useSearchParams();
  const userId = useMemo(() => params.get("userId"), [params]);
  const { data, error, loading } = useQuery(GET_USER, {
    variables: {
      userId,
    },
    skip: !userId,
  });
  const user = useMemo(() => data?.user, [data]);
  const requiredUser = useMemo(
    () => !!userId && (!!error || loading || !user),
    [userId, error, loading, user]
  );

  useEffect(() => {
    if (user) {
      onSetUser(user);
    }
  }, [user, onSetUser]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div className="coinfella bg-black w-full h-full flex items-center justify-center">
      <div className="max-w-lg w-full h-full p-2 overflow-auto">
        {requiredUser ? (
          <></>
        ) : (
          <Routes>
            <Route path="/signup/*" element={<CoinFellaSignupRouter />} />
            <Route
              path="/:checkoutRequestId/*"
              element={<CoinFellaRequest />}
            />
          </Routes>
        )}
      </div>
    </div>
  );
};
