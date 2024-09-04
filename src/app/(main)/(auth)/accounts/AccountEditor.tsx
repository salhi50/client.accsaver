"use client";

import Button from "@/components/Button";
import Container from "@/components/Container";
import InputField from "@/components/InputField";
import { Account, AccountValidation } from "accsaver-shared";
import Link from "next/link";
import { FormEventHandler, useState } from "react";

interface Props {
  onValid: (account: Omit<Account, "id">) => void;
  isNew: boolean;
  account?: Omit<Account, "id">;
}

export default function AccountEditor({ isNew, onValid, account }: Props) {
  const [formErrors, setFormErrors] = useState({
    accountName: "",
    username: "",
    email: "",
    password: "",
    recoveryCodes: "",
    otherNotes: ""
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = function (e) {
    const data = new FormData(e.currentTarget);
    const accountName = data.get("name");
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const recoveryCodes = data.get("recoveryCodes");
    const otherNotes = data.get("otherNotes");
    let accountNameError, usernameError, emailError, passwordError;
    let recoveryCodesError, otherNotesError;
    e.preventDefault();

    if (
      typeof accountName !== "string" ||
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof recoveryCodes !== "string" ||
      typeof otherNotes !== "string"
    ) {
      return;
    }

    accountNameError = AccountValidation.validateName(accountName);
    usernameError = AccountValidation.validateUsername(username);
    emailError = AccountValidation.validateEmail(email);
    passwordError = AccountValidation.validatePassword(password);
    recoveryCodesError = AccountValidation.validateRecoveryCodes(recoveryCodes);
    otherNotesError = AccountValidation.validateOtherNotes(otherNotes);

    setFormErrors({
      accountName: accountNameError,
      username: usernameError,
      email: emailError,
      password: passwordError,
      recoveryCodes: recoveryCodesError,
      otherNotes: otherNotesError
    });

    if (
      accountNameError ||
      usernameError ||
      emailError ||
      passwordError ||
      recoveryCodesError ||
      otherNotesError
    ) {
      return;
    }

    onValid({
      name: accountName,
      data: {
        username,
        email,
        password,
        recoveryCodes,
        otherNotes
      }
    });
  };

  return (
    <Container size="sm">
      <form noValidate className="space-y-4" onSubmit={handleSubmit}>
        <h1>{isNew ? "New Account" : "Edit Account"}</h1>
        <InputField
          label="Name"
          name="name"
          errorMessage={formErrors.accountName}
          defaultValue={account?.name}
        />
        <InputField
          label="Username"
          name="username"
          errorMessage={formErrors.username}
          defaultValue={account?.data.username}
        />
        <InputField
          label="Email"
          name="email"
          errorMessage={formErrors.email}
          defaultValue={account?.data.email}
        />
        <InputField
          label="Password"
          name="password"
          errorMessage={formErrors.password}
          defaultValue={account?.data.password}
        />
        <InputField
          label="Recovery/Backup Codes"
          name="recoveryCodes"
          multiline
          errorMessage={formErrors.recoveryCodes}
          defaultValue={account?.data.recoveryCodes}
        />
        <InputField
          label="Other Notes"
          name="otherNotes"
          multiline
          errorMessage={formErrors.otherNotes}
          defaultValue={account?.data.otherNotes}
        />
        <div className="flex">
          <Link href="/accounts" prefetch={false} className="w-full mr-2">
            <Button fullWidth variant="outlined">
              Cancel
            </Button>
          </Link>
          <Button submit fullWidth>
            Save
          </Button>
        </div>
      </form>
    </Container>
  );
}
