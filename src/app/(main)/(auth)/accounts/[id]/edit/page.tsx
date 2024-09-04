"use client";

import { Account, UpdateAccountRequestBody } from "accsaver-shared";
import AccountEditor from "../../AccountEditor";
import { useContext } from "react";
import { AuthContext, LoadingContext } from "@/app/(main)/contexts";
import { handleUnAuthorizedResponse } from "../../../utils";
import { useRouter } from "next/navigation";
import useAccountFetcher from "@/hooks/useAccountFetcher";
import Container from "@/components/Container";

export default function EditAccountPage({
  params
}: {
  params: { id: string };
}) {
  const { account, hasError } = useAccountFetcher(params.id);
  const setLoading = useContext(LoadingContext);
  const { auth } = useContext(AuthContext);
  const router = useRouter();

  const submitForm = function (body: UpdateAccountRequestBody) {
    const req = new Request(
      `${process.env.NEXT_PUBLIC_ACCOUNTS_ENDPOINT}/${params.id}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth!.accessToken}`
        },
        body: JSON.stringify(body)
      }
    );
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

  if (hasError) {
    router.replace("/accounts");
    return null;
  }

  if (!account) {
    <Container size="md">Loading...</Container>;
  }

  return (
    <AccountEditor
      onValid={handleValid}
      isNew={false}
      account={account as Omit<Account, "id">}
    />
  );
}
