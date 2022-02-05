import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { getAuth } from "firebase/auth";
import { useCheckAlreadyLogin } from "../auth/user";
import { WithHeaderFooter } from "../layouts/WithHeaderFooter";
import { firebaseApp } from "../lib/firebase";

const Account: NextPage = () => {
  useCheckAlreadyLogin();
  const session = useSession();
  const auth = getAuth(firebaseApp);

  if (session.status === "loading") {
    return (
      <WithHeaderFooter>
        <p>loading...</p>
      </WithHeaderFooter>
    );
  }

  if (session?.status === "authenticated") {
    return (
      <WithHeaderFooter>
        <p>Signed in as {session.data.user?.name}</p>
        {/* @ts-ignore */}
        <p>uid {session.data.user?.uid}</p>
        <p>mail {session.data.user?.email}</p>
        <button
          onClick={() => {
            signOut();
            auth.signOut();
          }}
        >
          Sign out
        </button>
      </WithHeaderFooter>
    );
  }

  return (
    <WithHeaderFooter>
      <p>a</p>
    </WithHeaderFooter>
  );
};

export default Account;
