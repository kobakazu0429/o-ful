import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { signIn } from "next-auth/react";
import {
  getAuth,
  signInWithPopup,
  TwitterAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import type { AuthProvider } from "firebase/auth";
import { firebaseApp } from "../lib/firebase";
import { uid } from "../store/user";

const SignIn = () => {
  const router = useRouter();
  const setUid = useSetRecoilState(uid);

  const auth = getAuth(firebaseApp);
  const twitterProvider = new TwitterAuthProvider();

  const handleOAuthSignIn = (provider: AuthProvider) => {
    signInWithPopup(auth, provider)
      // 認証に成功したら ID トークンを NextAuth に渡す
      .then((credential) => credential.user.getIdToken(true))
      .then((idToken) => {
        console.log(idToken);

        signIn("credentials", { idToken });
      })
      .catch((err) => console.error(err));
  };

  onAuthStateChanged(auth, async (user) => {
    if (user?.uid) {
      console.log("user.uid:", user.uid);

      setUid(user.uid);
      router.push("/bar");
    }
  });

  return (
    <>
      <p>Choose your sign-in method:</p>
      <button onClick={() => handleOAuthSignIn(twitterProvider)}>
        Twitter
      </button>
      <br />
    </>
  );
};

export default SignIn;
