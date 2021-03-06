import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import debounce from "lodash.debounce";
export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {/* if(user){
            if(!username){
                <UsernameForm/>
            }
            <SignOutButton/>
        }else{
            <SignInButton/>
        } */}
      {!user ? <SignInButton /> : <SignOutButton />}
      {!username && <UsernameForm />}
    </main>
  );
}

// Sign In with Google Button
function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src="/google.png" alt="" />
      Sign In with Google
    </button>
  );
}
// Sign out Buttton
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);

  console.log(user);

  useEffect(() => {
    console.log("useeffect triggered");
    checkUsername(formValue);
  }, [formValue]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("clicked!");

    // can be written as const userDoc = doc(firestore, `users/${user.uid}`);

    // create refs for both documents
    const userDoc = doc(firestore, "users", user.uid);
    const userNameDoc = doc(firestore, "usernames", formValue);

    // commit both docs together as a batch write!

    const batch = writeBatch(firestore);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(userNameDoc, { uid: user.uid });
    await batch.commit();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };
  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work.
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        // directly go the the document username inside the collection usernames! where username is simply the form input!
        const ref = doc(firestore, "usernames", username);
        const docSnap = await getDoc(ref);
        console.log("Firestore read executed!");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form action="" onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking....</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username.length >= 3 && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
