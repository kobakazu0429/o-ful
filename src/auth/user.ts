import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { firebaseApp } from "../lib/firebase";

export const getUser = () => {
  const auth = getAuth(firebaseApp);
  return auth.currentUser;
};

export const useCheckAlreadyLogin = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  successHandle = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  noUserHandle = () => {},
}: {
  successHandle?: (user: User) => void;
  noUserHandle?: () => void;
} = {}): void => {
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        successHandle(user);
      } else {
        noUserHandle();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
