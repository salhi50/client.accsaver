"use client";

import Container from "@/components/Container";
import { useContext } from "react";
import { AuthContext } from "@/app/(main)/contexts";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Link from "next/link";
import Box from "@/components/Box";
import { useRouter } from "next/navigation";
import useAccountFetcher from "@/hooks/useAccountFetcher";
import { handleUnAuthorizedResponse } from "../../utils";

function InfoRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex justify-between items-center flex-wrap py-2">
      <strong className="inline-block mb-1 mr-1">{name}</strong>
      <span className="text-body-secondary mb-1">{value}</span>
    </div>
  );
}

export default function AccountPreviewPage({
  params
}: {
  params: { id: string };
}) {
  const { account, hasError } = useAccountFetcher(params.id);
  const { auth } = useContext(AuthContext);
  const router = useRouter();

  const handleDelete = function () {
    if (confirm("Are you sure you want to delete this account?")) {
      fetch(
        `${process.env.NEXT_PUBLIC_ACCOUNTS_ENDPOINT}/${account!.id}/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth!.accessToken}`
          },
          body: "{}"
        }
      )
        .then(handleUnAuthorizedResponse)
        .finally(() => router.replace("/accounts"));
    }
  };

  if (hasError) {
    return (
      <Container size="md">
        <Alert>
          Error: Unable to load account, an unexpected error has occurred
        </Alert>
      </Container>
    );
  }

  if (!account) {
    return <Container size="md">Loading...</Container>;
  }

  return (
    <>
      <div className="border-b py-4 mb-6">
        <Container size="md">
          <div className="flex justify-between items-center flex-wrap">
            <h1 className="mt-2 mr-2">{account.name}</h1>
            <div className="flex mt-2">
              <Link href={`/accounts/${account.id}/edit`} prefetch={false}>
                <Button variant="outlined" small className="mr-2">
                  Edit
                </Button>
              </Link>
              <Button
                variant="outlined"
                small
                color="danger"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <Container size="md" className="space-y-4">
        <h2>Account Details</h2>
        <Box>
          <InfoRow name="Username" value={account.data.username} />
          <InfoRow name="Email" value={account.data.email} />
          <InfoRow name="Password" value={account.data.password} />
        </Box>
        <h2>Recovery/Backup Codes</h2>
        <Box>{account.data.recoveryCodes}</Box>
        <h2>Other Notes</h2>
        <Box>{account.data.otherNotes}</Box>
      </Container>
    </>
  );
}
