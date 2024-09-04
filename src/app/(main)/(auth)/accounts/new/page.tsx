"use client";

import { AuthContext, LoadingContext } from "@/app/(main)/contexts";
import { Account, NewAccountRequestBody } from "accsaver-shared";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { handleUnAuthorizedResponse } from "../../utils";
import AccountEditor from "../AccountEditor";

export default function NewAccountPage() {
  const setLoading = useContext(LoadingContext);
  const { auth } = useContext(AuthContext);
  const router = useRouter();

  const submitForm = function (body: NewAccountRequestBody) {
    const req = new Request(process.env.NEXT_PUBLIC_NEW_ACCOUNT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth!.accessToken}`
      },
      body: JSON.stringify(body)
    });
    return new Promise((resolve, reject) => {
      fetch(req)
        .then(handleUnAuthorizedResponse)
        .finally(() => {
          setLoading(false);
          router.replace("/accounts");
        });
    });
  };

  const handleValid = function (account: Omit<Account, "id">) {
    setLoading(true);
    submitForm(account);
  };

  return <AccountEditor isNew onValid={handleValid} />;
}
