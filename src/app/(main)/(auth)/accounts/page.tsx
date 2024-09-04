"use client";

import { useContext, useEffect, useState } from "react";
import { GetAllAccountsResponseBody } from "accsaver-shared";
import Link from "next/link";
import { AuthContext } from "../../contexts";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import { handleUnAuthorizedResponse } from "../utils";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Container size="md">
      <div className="flex justify-between items-center flex-wrap pb-2 border-b">
        <h1 className="mr-2 mt-2">Saved Accounts</h1>
        <Link href="/accounts/new" prefetch={false}>
          <Button className="mt-2" small>
            New
          </Button>
        </Link>
      </div>
      {children}
    </Container>
  );
}

function Status({ children }: { children: string }) {
  return (
    <p className="mt-4">
      <em className="text-body-secondary">{children}</em>
    </p>
  );
}

function AccountListItem({
  name,
  id
}: GetAllAccountsResponseBody["result"][number]) {
  return (
    <li className="py-2 border-b">
      <Link
        prefetch={false}
        href={`/accounts/${id}`}
        className="text-xl link link-primary"
      >
        {name}
      </Link>
    </li>
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<
    GetAllAccountsResponseBody["result"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_ACCOUNTS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${auth!.accessToken}`
      }
    })
      .then(handleUnAuthorizedResponse)
      .then(res => {
        if (res.status === 200) return res.json();
        throw new Error();
      })
      .then(({ result }: GetAllAccountsResponseBody) => setAccounts(result))
      .catch(() => setHasError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Wrapper>
        <Status>Loading...</Status>
      </Wrapper>
    );
  }

  if (hasError) {
    return (
      <Wrapper>
        <Alert className="mt-4">
          <p>Error: Unable to load accounts.</p>
        </Alert>
      </Wrapper>
    );
  }

  if (accounts.length === 0) {
    return (
      <Wrapper>
        <Status>No accounts available.</Status>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <nav>
        <ul>
          {accounts.map(acc => (
            <AccountListItem key={acc.id} name={acc.name} id={acc.id} />
          ))}
        </ul>
      </nav>
    </Wrapper>
  );
}
