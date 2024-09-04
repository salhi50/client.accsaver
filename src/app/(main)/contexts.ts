import { Dispatch, SetStateAction, createContext } from "react";

type AuthValue = null | {
  accessToken: string;
};

interface AuthContextValue {
  auth: AuthValue;
  setAuth: Dispatch<SetStateAction<AuthValue>>;
}

const noop = () => {};
const AppAlertContext = createContext<Dispatch<SetStateAction<string>>>(noop);
const LoadingContext = createContext<Dispatch<SetStateAction<boolean>>>(noop);
const AuthContext = createContext<AuthContextValue>({
  auth: null,
  setAuth: noop
});

export { AppAlertContext, LoadingContext, AuthContext };
export type { AuthValue };
