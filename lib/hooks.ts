import { firestore } from "../lib/firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

type usernameType = { username: string | null };

export const useUserData = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<usernameType>(null);

  useEffect(() => {
    let unsubscribe;
    console.log(user);
    if (user) {
      const updateState = async () => {
        unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
          setUsername(doc.data()?.username);
          console.log(doc.data());
        });
      };
      updateState();
    } else {
      setUsername(null);
    }
    return unsubscribe;
  }, [user]);
  return { user, username };
};
