import { handleUnAuthorizedResponse } from "@/app/(main)/(auth)/utils";
import { AuthContext } from "@/app/(main)/contexts";
import { GetAccountByIdResponseBody } from "accsaver-shared";
import { useContext, useEffect, useState } from "react";

export default function useAccountFetcher(id: string) {
  const [account, setAccount] = useState<
    GetAccountByIdResponseBody["result"] | null
  >(null);
  const [hasError, setHasError] = useState(false);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ACCOUNTS_ENDPOINT}/${id}`, {
      headers: {
        Authorization: `Bearer ${auth && auth.accessToken}`
      }
    })
      .then(handleUnAuthorizedResponse)
      .then(res => {
        if (res.status === 200) return res.json();
        throw new Error();
      })
      .then(({ result }: GetAccountByIdResponseBody) => {
        setAccount(result);
      })
      .catch(() => setHasError(true));
  }, []);

  return {
    hasError,
    account
  };
}
